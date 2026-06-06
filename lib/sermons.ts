import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { isAdminUser } from "@/lib/auth";
import { isApprovedPastor } from "@/lib/pastor-profiles";
import { analyzePdf } from "@/lib/ai";
import { scanPdfBuffer } from "@/lib/virustotal";
import { createClient } from "@/lib/supabase/server";
import { getCurrentUser } from "@/lib/current-user";
import { sermonSchema } from "@/lib/validations";
import type { Sermon, SermonFormState, SermonListItem } from "@/types/sermon";

const bucketName = "sermon-pdfs";

function formDataToObject(formData: FormData) {
  return {
    title: String(formData.get("title") ?? ""),
    preacher_name: String(formData.get("preacher_name") ?? ""),
    date: String(formData.get("date") ?? ""),
    biblical_text: String(formData.get("biblical_text") ?? ""),
    sermon_type: String(formData.get("sermon_type") ?? ""),
    is_series: String(formData.get("is_series") ?? "false") === "true",
    series_theme: String(formData.get("series_theme") ?? ""),
    notes: String(formData.get("notes") ?? ""),
    pdf: formData.get("pdf") instanceof File ? formData.get("pdf") : undefined,
  };
}

async function uploadPdf(userId: string, sermonId: string, file: File) {
  const supabase = await createClient();
  const extension = file.name.split(".").pop() ?? "pdf";
  const path = `${userId}/${sermonId}/${Date.now()}.${extension}`;
  const { error } = await supabase.storage.from(bucketName).upload(path, file, {
    contentType: "application/pdf",
    upsert: true,
  });
  if (error) throw new Error(error.message);
  return path;
}

// Reexportado de lib/current-user (memoizado por pedido com cache() do React).
export { getCurrentUser };

const SERMON_LIST_COLUMNS =
  "id, title, preacher_name, date, biblical_text, series_theme, sermon_type, status, ai_summary, pdf_path";
const SERMONS_PER_PAGE = 24;

export type SermonListResult = {
  sermons: SermonListItem[];
  total: number;
  page: number;
  pageSize: number;
};

export async function listSermons(query?: string, page = 1): Promise<SermonListResult> {
  const user = await getCurrentUser();
  const supabase = await createClient();

  const safePage = Number.isFinite(page) && page > 0 ? Math.floor(page) : 1;

  // Seleciona apenas as colunas mostradas na lista (sem `notes`, que pode ser
  // muito grande) e pede a contagem total para a paginação.
  let request = supabase
    .from("sermons")
    .select(SERMON_LIST_COLUMNS, { count: "exact" })
    .order("date", { ascending: false });

  if (!isAdminUser(user)) {
    if (user) {
      request = request.or(`status.eq.published,and(status.eq.pending,created_by.eq.${user.id})`);
    } else {
      request = request.eq("status", "published");
    }
  }

  const trimmed = query?.trim().replace(/[(),]/g, " ");
  if (trimmed) {
    const term = `%${trimmed}%`;
    request = request.or(
      `title.ilike.${term},preacher_name.ilike.${term},biblical_text.ilike.${term},series_theme.ilike.${term},notes.ilike.${term}`
    );
  }

  const from = (safePage - 1) * SERMONS_PER_PAGE;
  request = request.range(from, from + SERMONS_PER_PAGE - 1);

  const { data, error, count } = await request;
  if (error) throw new Error(error.message);
  return {
    sermons: (data ?? []) as SermonListItem[],
    total: count ?? 0,
    page: safePage,
    pageSize: SERMONS_PER_PAGE,
  };
}

export async function getSermon(id: string) {
  const supabase = await createClient();
  const { data, error } = await supabase.from("sermons").select("*").eq("id", id).single();
  if (error) throw new Error(error.message);
  return data as Sermon;
}

export async function getPdfUrl(path: string | null) {
  if (!path) return null;
  const supabase = await createClient();
  const { data } = await supabase.storage.from(bucketName).createSignedUrl(path, 60 * 10);
  return data?.signedUrl ?? null;
}

async function shouldAutoApprove(userId: string): Promise<boolean> {
  const supabase = await createClient();
  const { data: profile } = await supabase
    .from("pastor_profiles").select("auto_approve_revoked").eq("user_id", userId).maybeSingle();
  if (profile?.auto_approve_revoked) return false;
  const { count } = await supabase
    .from("sermons").select("id", { count: "exact", head: true })
    .eq("created_by", userId).eq("status", "published");
  return (count ?? 0) >= 3;
}

export async function createSermon(
  _prev: SermonFormState,
  formData: FormData
): Promise<SermonFormState> {
  "use server";
  const parsed = sermonSchema.safeParse(formDataToObject(formData));
  if (!parsed.success) {
    return { message: "Revê os campos assinalados.", errors: parsed.error.flatten().fieldErrors };
  }
  const { pdf, ...sermon } = parsed.data;
  if (!pdf || pdf.size === 0) return { message: "O envio de PDF é obrigatório." };

  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const admin = isAdminUser(user);
  if (!admin && !(await isApprovedPastor())) return { message: "O teu perfil de pastor ainda não foi aprovado." };

  const pdfBuffer = Buffer.from(await pdf.arrayBuffer());

  const vtResult = await scanPdfBuffer(pdfBuffer);
  if (!vtResult.safe) return { message: vtResult.message };

  const aiResult = await analyzePdf(pdfBuffer);
  if (aiResult.hasLinks) {
    return { message: "O PDF contém hiperlinks. Remove os links e tenta novamente." };
  }

  const autoApprove = admin || (await shouldAutoApprove(user.id));
  const status = autoApprove ? "published" : "pending";

  const { data, error } = await supabase
    .from("sermons")
    .insert({ ...sermon, created_by: user.id, status, ai_summary: aiResult.summary })
    .select("id").single();
  if (error) return { message: error.message };

  try {
    const pdfPath = await uploadPdf(user.id, data.id, pdf);
    await supabase.from("sermons").update({ pdf_path: pdfPath }).eq("id", data.id);
  } catch (err) {
    return { message: err instanceof Error ? err.message : "Erro ao guardar o PDF." };
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
    return { message: "Revê os campos assinalados.", errors: parsed.error.flatten().fieldErrors };
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
  let aiSummary: string | null | undefined = undefined;

  if (pdf && pdf.size > 0) {
    const pdfBuffer = Buffer.from(await pdf.arrayBuffer());
    const vtResult = await scanPdfBuffer(pdfBuffer);
    if (!vtResult.safe) return { message: vtResult.message };
    const aiResult = await analyzePdf(pdfBuffer);
    if (aiResult.hasLinks) return { message: "O PDF contém hiperlinks. Remove os links e tenta novamente." };
    aiSummary = aiResult.summary;
    pdfPath = await uploadPdf(user.id, id, pdf).catch(() => null);
  }

  const payload: Record<string, unknown> = { ...sermon };
  if (pdfPath) payload.pdf_path = pdfPath;
  if (aiSummary !== undefined) payload.ai_summary = aiSummary;

  const { error } = await supabase.from("sermons").update(payload).eq("id", id);
  if (error) return { message: error.message };

  revalidatePath("/sermoes");
  revalidatePath(`/sermoes/${id}`);
  return { message: "Sermão atualizado com sucesso." };
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
  const user = await getCurrentUser();
  if (!user || !isAdminUser(user)) return [];
  const supabase = await createClient();
  const { data } = await supabase
    .from("sermons").select("*").eq("status", "pending").order("created_at", { ascending: true });
  return (data ?? []) as Sermon[];
}
