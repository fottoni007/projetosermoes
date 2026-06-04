import { createClient } from "@/lib/supabase/server";

export type SitePage = {
  slug: string;
  title: string;
  content: string;
  updated_at: string;
};

export async function getSitePage(slug: string): Promise<SitePage | null> {
  const supabase = await createClient();
  const { data } = await supabase
    .from("site_pages")
    .select("slug, title, content, updated_at")
    .eq("slug", slug)
    .maybeSingle();
  return (data as SitePage) ?? null;
}
