import { createClient } from "@/lib/supabase/server";
import type { ForumCategory } from "@/lib/forum-categories";
import type { ForumReply, ForumTopic } from "@/types/forum";

export type TopicListItem = {
  id: string;
  title: string;
  category: ForumCategory;
  author_name: string;
  created_at: string;
  reply_count: number;
};

export async function getTopics(query?: string, category?: string): Promise<TopicListItem[]> {
  const supabase = await createClient();
  let req = supabase
    .from("forum_topics")
    .select("id, title, category, author_name, created_at, forum_replies(count)")
    .order("created_at", { ascending: false });

  if (category) req = req.eq("category", category);

  const trimmed = query?.trim().replace(/[(),]/g, " ");
  if (trimmed) {
    const term = `%${trimmed}%`;
    req = req.or(`title.ilike.${term},body.ilike.${term},author_name.ilike.${term}`);
  }

  const { data } = await req;
  const rows = (data ?? []) as Array<{
    id: string;
    title: string;
    category: ForumCategory;
    author_name: string;
    created_at: string;
    forum_replies: { count: number }[];
  }>;

  return rows.map((t) => ({
    id: t.id,
    title: t.title,
    category: t.category,
    author_name: t.author_name,
    created_at: t.created_at,
    reply_count: t.forum_replies?.[0]?.count ?? 0,
  }));
}

export async function getTopic(id: string): Promise<{ topic: ForumTopic; replies: ForumReply[] } | null> {
  const supabase = await createClient();
  const { data: topic } = await supabase.from("forum_topics").select("*").eq("id", id).maybeSingle();
  if (!topic) return null;
  const { data: replies } = await supabase
    .from("forum_replies")
    .select("*")
    .eq("topic_id", id)
    .order("created_at", { ascending: true });
  return { topic: topic as ForumTopic, replies: (replies ?? []) as ForumReply[] };
}
