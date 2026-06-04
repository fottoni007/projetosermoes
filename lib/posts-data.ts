import { createClient } from "@/lib/supabase/server";
import type { Post } from "@/types/post";

export async function getPosts(): Promise<Post[]> {
  const supabase = await createClient();
  const { data } = await supabase
    .from("posts")
    .select("*")
    .order("published_at", { ascending: false })
    .order("created_at", { ascending: false });
  return (data ?? []) as Post[];
}

export async function getPost(id: string): Promise<Post | null> {
  const supabase = await createClient();
  const { data } = await supabase.from("posts").select("*").eq("id", id).maybeSingle();
  return (data as Post) ?? null;
}
