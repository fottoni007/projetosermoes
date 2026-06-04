"use server";

import { revalidatePath } from "next/cache";
import { isAdminUser } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";

const BUCKET = "resources";
const MAX = 25 * 1024 * 1024;

export async function uploadResourceAction(
  formData: FormData
): Promise<{ success: boolean; error?: string }> {
  const title = String(formData.get("title") ?? "").trim();
  const file = formData.get("file");

  if (title.length < 2) return { success: false, error: "Indica um título para o recurso." };
  if (!(file instanceof File) || file.size === 0) return { success: false, error: "Selecciona um ficheiro PDF." };
  if (file.type !== "application/pdf") return { success: false, error: "O ficheiro deve ser um PDF." };
  if (file.size > MAX) return { success: false, error: "O PDF deve ter no máximo 25 MB." };

  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user || !isAdminUser(user)) {
    return { success: false, error: "Apenas o administrador pode adicionar recursos." };
  }

  const safe = file.name.replace(/[^A-Za-z0-9._-]/g, "_");
  const path = `${Date.now()}-${safe}`;

  const { error: upErr } = await supabase.storage
    .from(BUCKET)
    .upload(path, file, { contentType: "application/pdf", upsert: false });
  if (upErr) return { success: false, error: upErr.message };

  const { error: insErr } = await supabase
    .from("resources")
    .insert({ title, file_path: path, created_by: user.id });
  if (insErr) {
    await supabase.storage.from(BUCKET).remove([path]);
    return { success: false, error: insErr.message };
  }

  revalidatePath("/sermoes/dicas-preciosas");
  return { success: true };
}

export async function deleteResourceAction(
  id: string
): Promise<{ success: boolean; error?: string }> {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user || !isAdminUser(user)) return { success: false, error: "Sem permissão." };

  const { data: row } = await supabase
    .from("resources").select("file_path").eq("id", id).maybeSingle();

  const { data, error } = await supabase
    .from("resources").delete().eq("id", id).select();
  if (error) return { success: false, error: error.message };
  if (!data || data.length === 0) return { success: false, error: "Recurso não encontrado ou sem permissão." };

  if (row?.file_path) {
    await supabase.storage.from(BUCKET).remove([row.file_path as string]);
  }

  revalidatePath("/sermoes/dicas-preciosas");
  return { success: true };
}
