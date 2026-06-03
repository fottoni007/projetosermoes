import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { isAdminUser } from "@/lib/auth";
import { isApprovedPastor } from "@/lib/pastor-profiles";
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
  if (!file || file.size === 0) return null;

  const supabase = await createClient();
  const extension = file.name.split(".").pop() ?? "pdf";
  const path = `${userId}/${sermonId}/${Date.now()}.${extension}`;

  const { error } = await supabase.storage.from(bucketName).upload(path, file, {
    contentType: "application/pdf",
    upsert: true
  });

  if (error) throw new Error(error.message);
  return path;
}

export async function getCurrentUser() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  return user;
}

export async function listSermons(query?: string) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  let request = supabase
    .from("sermons")
    .select("*")
    .order("date", { ascending: false });

  if (!isAdminUser(user)) {
    if (user) {
      request = request.or(`status.eq.published,and(status.eq.pending,created_by.eq.${user.id})`);
    } else {
      request = request.eq("status", "published");
    }
  }

  const trimmedQuery = query?.trim().replace(/[(),]/g, " ");
  if (trimmedQuery) {
    const term = `%${trimmedQuery}%`;
    request = request.or(
      `title.ilike.${term},preacher_name.ilike.${term},biblical_text.ilike.${term},series_theme.ilike.${term},notes.ilike.${term}`
    );
  }

  const { data, error } = await request;
  if (error) throw new Error(error.message);
  return (data ?? []) as Sermon[];
}

export async function getSermon(id: string) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("sermons")
    .select("*")
    .eq("id", id)
    .single();

  if (error) throw new Error(error.message);
  return data as Sermon;
}

export async function getPdfUrl(path: string | null) {
  if (!path) return null;
  const supabase = await createClient();
  const { data } = await supabase.storage.from(bucketName).createSignedUrl(path, 60 * 10);
  return data?.signedUrl ?? null;
}

export async function createSermon(
  _prev: SermonFormState,
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
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const admin = isAdminUser(user);
  const approved = admin || (await isApprovedPastor());

  if (!approved) {
    return { message: "O teu perfil de pastor ainda não foi aprovado." };
  }

  const { pdf, ...sermon } = parsed.data;
  const status = admin ? "published" : "pending";

  const { data, error } = await supabase
    .from("sermons")
    .insert({ ...sermon, created_by: user.id, status })
    .select("id")
    .single();

  if (error) return { message: error.message };

  if (pdf && pdf.size > 0) {
    try {
      const pdfPath = await uploadPdf(user.id, data.id, pdf);
      await supabase.from("sermons").update({ pdf_path: pdfPath }).eq("id", data.id);
    } catch (err) {
      return {
        message: err instanceof Error
          ? err.message
          : "O sermão foi criado, mas não foi possível guardar o PDF."
      };
    }
  }

  revalidatePath("/sermoes");
  redirect(`/sermoes/${data.id}`);
}

export async function updateSermon(
  id: string,
  _prev: SermonFormState,
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
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const existing = await getSermon(id);
  if (!existing) return { message: "Sermão não encontrado." };

  const admin = isAdminUser(user);
  if (!admin && existing.created_by !== user.id) {
    return { message: "Não tens permissão para editar este sermão." };
  }

  const { pdf, ...sermon } = parsed.data;
  let pdfPath: string | null = null;

  if (pdf && pdf.size > 0) {
    try {
      pdfPath = await uploadPdf(user.id, id, pdf);
    } catch (err) {
      return {
        message: err instanceof Error ? err.message : "Não foi possível guardar o PDF."
      };
    }
  }

  const payload = pdfPath ? { ...sermon, pdf_path: pdfPath } : sermon;
  const { error } = await supabase.from("sermons").update(payload).eq("id", id);
  if (error) return { message: error.message };

  revalidatePath("/sermoes");
  revalidatePath(`/sermoes/${id}`);
  return { message: "Sermão actualizado com sucesso." };
}

export async function approveSermon(id: string): Promise<void> {
  "use server";
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user || !isAdminUser(user)) return;

  await supabase.from("sermons").update({ status: "published" }).eq("id", id);
  revalidatePath("/sermoes");
  revalidatePath("/sermoes/aprovar");
}

export async function rejectSermon(id: string): Promise<void> {
  "use server";
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user || !isAdminUser(user)) return;

  await supabase.from("sermons").update({ status: "rejected" }).eq("id", id);
  revalidatePath("/sermoes");
  revalidatePath("/sermoes/aprovar");
}

export async function listPendingSermons(): Promise<Sermon[]> {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user || !isAdminUser(user)) return [];

  const { data } = await supabase
    .from("sermons")
    .select("*")
    .eq("status", "pending")
    .order("created_at", { ascending: true });

  return (data ?? []) as Sermon[];
}
