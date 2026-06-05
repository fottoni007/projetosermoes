import { createClient } from "@/lib/supabase/server";
import type { ForumReply, ForumTopic } from "@/types/forum";

export type TopicListItem = {
  id: string;
  title: string;
  author_name: string;
  created_at: string;
  reply_count: number;
};

export async function getTopics(): Promise<TopicListItem[]> {
  const supabase = await createClient();
  const { data } = await supabase
    .from("forum_topics")
    .select("id, title, author_name, created_at, forum_replies(count)")
    .order("created_at", { ascending: false });

  const rows = (data ?? []) as Array<{
    id: string;
    title: string;
    author_name: string;
    created_at: string;
    forum_replies: { count: number }[];
  }>;

  return rows.map((t) => ({
    id: t.id,
    title: t.title,
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
