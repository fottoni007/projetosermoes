"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { FORUM_CATEGORY_VALUES } from "@/lib/forum-categories";
import type { ForumState } from "@/types/forum";

type SC = Awaited<ReturnType<typeof createClient>>;

async function displayName(supabase: SC, userId: string, email: string | null | undefined): Promise<string> {
  const { data } = await supabase
    .from("pastor_profiles")
    .select("full_name")
    .eq("user_id", userId)
    .maybeSingle();
  if (data?.full_name) return data.full_name as string;
  const local = (email ?? "").split("@")[0];
  return local || "Utilizador";
}

export async function createTopicAction(_prev: ForumState, formData: FormData): Promise<ForumState> {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { message: "Sessão expirada. Inicia sessão novamente." };

  const title = String(formData.get("title") ?? "").trim();
  const body = String(formData.get("body") ?? "").trim();
  const rawCat = String(formData.get("category") ?? "geral");
  const category = FORUM_CATEGORY_VALUES.includes(rawCat) ? rawCat : "geral";
  if (title.length < 4) return { message: "O título deve ter pelo menos 4 caracteres." };
  if (body.length < 10) return { message: "Desenvolve um pouco mais o conteúdo do tópico." };

  const name = await displayName(supabase, user.id, user.email);
  const { data, error } = await supabase
    .from("forum_topics")
    .insert({ title, body, category, author_id: user.id, author_name: name })
    .select("id")
    .single();
  if (error) return { message: error.message };

  revalidatePath("/sermoes/forum");
  redirect(`/sermoes/forum/${data.id}`);
}

export async function createReplyAction(topicId: string, _prev: ForumState, formData: FormData): Promise<ForumState> {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { message: "Sessão expirada." };

  const body = String(formData.get("body") ?? "").trim();
  if (body.length < 2) return { message: "Escreve a tua resposta." };

  const name = await displayName(supabase, user.id, user.email);
  const { error } = await supabase
    .from("forum_replies")
    .insert({ topic_id: topicId, body, author_id: user.id, author_name: name });
  if (error) return { message: error.message };

  revalidatePath(`/sermoes/forum/${topicId}`);
  return { message: "", success: true };
}

export async function deleteTopicAction(id: string): Promise<{ success: boolean; error?: string }> {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { success: false, error: "Sem sessão." };

  const { data, error } = await supabase.from("forum_topics").delete().eq("id", id).select("id");
  if (error) return { success: false, error: error.message };
  if (!data || data.length === 0) return { success: false, error: "Não tens permissão para apagar este tópico." };

  revalidatePath("/sermoes/forum");
  return { success: true };
}

export async function deleteReplyAction(id: string): Promise<{ success: boolean; error?: string }> {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { success: false, error: "Sem sessão." };

  const { data, error } = await supabase.from("forum_replies").delete().eq("id", id).select("topic_id");
  if (error) return { success: false, error: error.message };
  if (!data || data.length === 0) return { success: false, error: "Não tens permissão para apagar esta resposta." };

  revalidatePath(`/sermoes/forum/${data[0].topic_id}`);
  return { success: true };
}
