import { createClient } from "@/lib/supabase/server";
import { getCurrentUser } from "@/lib/current-user";
import type { Notification } from "@/types/forum";

export async function getUnreadCount(): Promise<number> {
  const user = await getCurrentUser();
  if (!user) return 0;
  const supabase = await createClient();
  const { count } = await supabase
    .from("notifications")
    .select("id", { count: "exact", head: true })
    .eq("user_id", user.id)
    .eq("read", false);
  return count ?? 0;
}

export async function getNotifications(): Promise<Notification[]> {
  const user = await getCurrentUser();
  if (!user) return [];
  const supabase = await createClient();
  const { data } = await supabase
    .from("notifications")
    .select("id, topic_id, topic_title, actor_name, read, created_at")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false })
    .limit(50);
  return (data ?? []) as Notification[];
}
