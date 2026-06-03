import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { isAdminUser } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";
import { sermonSchema } from "@/lib/validations";
import type { Sermon, SermonFormState } from "@/types/sermon";

const bucketName = "sermon-pdfs";

function formDataToObject(formData: FormData) {
  return {
    title: String(formData.get("title") ?? ""),
    preacher_name: String(formData.get("preacher_name") ?? ""),
    date: String(formData.get("date") ?? ""),
    biblical_text: String(formData.get("biblical_text") ?? ""),
    series_theme: String(formData.get("series_theme") ?? ""),
    notes: String(formData.get("notes") ?? ""),
    pdf: formData.get("pdf") instanceof File ? formData.get("pdf") : undefined
  };
}

async function uploadPdf(userId: string, sermonId: string, file?: File) {
  if (!file || file.size === 0) {
    return null;
  }

  const supabase = await createClient();
  const extension = file.name.split(".").pop() ?? "pdf";
  const path = `${userId}/${sermonId}/${Date.now()}.${extension}`;

  const { error } = await supabase.storage.from(bucketName).upload(path, file, {
    contentType: "application/pdf",
    upsert: true
  });

  if (error) {
    throw new Error(error.message);
  }

  return path;
}

export async function getCurrentUser() {
  const supabase = await createClient();
  const {
    data: { user }
  } = await supabase.auth.getUser();

  return user;
}

export async function listSermons(query?: string) {
  const supabase = await createClient();
  let request = supabase
    .from("sermons")
    .select("*")
    .order("date", { ascending: false });

  const trimmedQuery = query?.trim().replace(/[(),]/g, " ");

  if (trimmedQuery) {
    const term = `%${trimmedQuery}%`;
    request = request.or(
      `title.ilike.${term},preacher_name.ilike.${term},biblical_text.ilike.${term},series_theme.ilike.${term},notes.ilike.${term}`
    );
  }

  const { data, error } = await request;

  if (error) {
    throw new Error(error.message);
  }

  return (data ?? []) as Sermon[];
}

export async function getSermon(id: string) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("sermons")
    .select("*")
    .eq("id", id)
    .single();

  if (error) {
    throw new Error(error.message);
  }

  return data as Sermon;
}

export async function getPdfUrl(path: string | null) {
  if (!path) {
    return null;
  }

  const supabase = await createClient();
  const { data } = await supabase.storage.from(bucketName).createSignedUrl(path, 60 * 10);

  return data?.signedUrl ?? null;
}

export async function createSermon(
  _previousState: SermonFormState,
  formData: FormData
): Promise<SermonFormState> {
  "use server";

  const parsed = sermonSchema.safeParse(formDataToObject(formData));

  if (!parsed.success) {
    return {
      message: "Revê os campos assinalados.",
      errors: parsed.error.flatten().fieldErrors
    };
  }

  const supabase = await createClient();
  const {
    data: { user }
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  if (!isAdminUser(user)) {
    return { message: "Apenas o administrador pode criar sermões." };
  }

  const { pdf, ...sermon } = parsed.data;

  const { data, error } = await supabase
    .from("sermons")
    .insert({
      ...sermon,
      created_by: user.id
    })
    .select("id")
    .single();

  if (error) {
    return { message: error.message };
  }

  if (pdf && pdf.size > 0) {
    try {
      const pdfPath = await uploadPdf(user.id, data.id, pdf);
      await supabase.from("sermons").update({ pdf_path: pdfPath }).eq("id", data.id);
    } catch (error) {
      return {
        message:
          error instanceof Error
            ? error.message
            : "O sermão foi criado, mas não foi possível guardar o PDF."
      };
    }
  }

  revalidatePath("/sermoes");
  redirect(`/sermoes/${data.id}`);
}

export async function updateSermon(
  id: string,
  _previousState: SermonFormState,
  formData: FormData
): Promise<SermonFormState> {
  "use server";

  const parsed = sermonSchema.safeParse(formDataToObject(formData));

  if (!parsed.success) {
    return {
      message: "Revê os campos assinalados.",
      errors: parsed.error.flatten().fieldErrors
    };
  }

  const supabase = await createClient();
  const {
    data: { user }
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  if (!isAdminUser(user)) {
    return { message: "Apenas o administrador pode editar sermões." };
  }

  const { pdf, ...sermon } = parsed.data;
  let pdfPath: string | null = null;

  if (pdf && pdf.size > 0) {
    try {
      pdfPath = await uploadPdf(user.id, id, pdf);
    } catch (error) {
      return {
        message:
          error instanceof Error ? error.message : "Não foi possível guardar o PDF."
      };
    }
  }

  const payload = pdfPath ? { ...sermon, pdf_path: pdfPath } : sermon;
  const { error } = await supabase.from("sermons").update(payload).eq("id", id);

  if (error) {
    return { message: error.message };
  }

  revalidatePath("/sermoes");
  revalidatePath(`/sermoes/${id}`);
  return { message: "Sermão actualizado com sucesso." };
}
