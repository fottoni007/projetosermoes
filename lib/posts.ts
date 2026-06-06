"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { isAdminUser } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";
import type { PostFormState } from "@/types/post";

const VALID_CATEGORIES = ["pastoral", "noticias", "teologia"];
const IMG_BUCKET = "post-images";
const MAX_IMG = 8 * 1024 * 1024;

async function requireAdmin() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user || !isAdminUser(user)) return null;
  return { supabase, user };
}

function parsePost(formData: FormData) {
  return {
    title: String(formData.get("title") ?? "").trim(),
    author: String(formData.get("author") ?? "").trim() || "Pastor Fabrício Ottoni",
    categories: formData.getAll("categories").map(String).filter((c) => VALID_CATEGORIES.includes(c)),
    published_at: String(formData.get("published_at") ?? "").trim(),
    cover_image_url: String(formData.get("cover_image_url") ?? "").trim() || null,
    content: String(formData.get("content") ?? ""),
  };
}

export async function createPostAction(_prev: PostFormState, formData: FormData): Promise<PostFormState> {
  const ctx = await requireAdmin();
  if (!ctx) return { message: "Apenas o administrador pode criar posts." };
  const p = parsePost(formData);
  if (p.title.length < 2) return { message: "Indica o tema/título do post." };
  if (p.categories.length === 0) return { message: "Seleciona pelo menos uma categoria." };

  const { data, error } = await ctx.supabase
    .from("posts")
    .insert({
      title: p.title,
      author: p.author,
      categories: p.categories,
      content: p.content,
      cover_image_url: p.cover_image_url,
      published_at: p.published_at || new Date().toISOString().slice(0, 10),
      created_by: ctx.user.id,
    })
    .select("id")
    .single();
  if (error) return { message: error.message };

  revalidatePath("/sermoes/dicas-preciosas");
  redirect(`/sermoes/dicas-preciosas/${data.id}`);
}

export async function updatePostAction(id: string, _prev: PostFormState, formData: FormData): Promise<PostFormState> {
  const ctx = await requireAdmin();
  if (!ctx) return { message: "Sem permissão." };
  const p = parsePost(formData);
  if (p.title.length < 2) return { message: "Indica o tema/título do post." };
  if (p.categories.length === 0) return { message: "Seleciona pelo menos uma categoria." };

  const { error } = await ctx.supabase
    .from("posts")
    .update({
      title: p.title,
      author: p.author,
      categories: p.categories,
      content: p.content,
      cover_image_url: p.cover_image_url,
      published_at: p.published_at || new Date().toISOString().slice(0, 10),
    })
    .eq("id", id);
  if (error) return { message: error.message };

  revalidatePath("/sermoes/dicas-preciosas");
  revalidatePath(`/sermoes/dicas-preciosas/${id}`);
  redirect(`/sermoes/dicas-preciosas/${id}`);
}

export async function deletePostAction(id: string): Promise<{ success: boolean; error?: string }> {
  const ctx = await requireAdmin();
  if (!ctx) return { success: false, error: "Sem permissão." };
  const { data, error } = await ctx.supabase.from("posts").delete().eq("id", id).select();
  if (error) return { success: false, error: error.message };
  if (!data || data.length === 0) return { success: false, error: "Post não encontrado ou sem permissão." };
  revalidatePath("/sermoes/dicas-preciosas");
  return { success: true };
}

export async function uploadPostImageAction(formData: FormData): Promise<{ success: boolean; url?: string; error?: string }> {
  const ctx = await requireAdmin();
  if (!ctx) return { success: false, error: "Sem permissão." };
  const file = formData.get("file");
  if (!(file instanceof File) || file.size === 0) return { success: false, error: "Seleciona uma imagem." };
  if (!file.type.startsWith("image/")) return { success: false, error: "O ficheiro deve ser uma imagem." };
  if (file.size > MAX_IMG) return { success: false, error: "A imagem deve ter no máximo 8 MB." };

  const ext = (file.name.split(".").pop() || "jpg").replace(/[^A-Za-z0-9]/g, "").toLowerCase() || "jpg";
  const path = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`;
  const { error } = await ctx.supabase.storage.from(IMG_BUCKET).upload(path, file, { contentType: file.type, upsert: false });
  if (error) return { success: false, error: error.message };

  const { data } = ctx.supabase.storage.from(IMG_BUCKET).getPublicUrl(path);
  return { success: true, url: data.publicUrl };
}
