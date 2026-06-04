import { createClient } from "@/lib/supabase/server";

export type ResourceItem = {
  id: string;
  title: string;
  url: string | null;
  created_at: string;
};

export async function getResources(): Promise<ResourceItem[]> {
  const supabase = await createClient();
  const { data } = await supabase
    .from("resources")
    .select("id, title, file_path, created_at")
    .order("created_at", { ascending: false });

  const rows = data ?? [];
  const items: ResourceItem[] = [];
  for (const r of rows) {
    const { data: signed } = await supabase.storage
      .from("resources")
      .createSignedUrl(r.file_path as string, 60 * 60);
    items.push({
      id: r.id as string,
      title: r.title as string,
      url: signed?.signedUrl ?? null,
      created_at: r.created_at as string,
    });
  }
  return items;
}
