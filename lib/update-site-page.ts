"use server";

import { revalidatePath } from "next/cache";
import { isAdminUser } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";

export async function updateSitePageAction(
  slug: string,
  content: string
): Promise<{ success: boolean; error?: string }> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user || !isAdminUser(user)) {
    return { success: false, error: "Apenas o administrador pode editar esta página." };
  }

  const { data, error } = await supabase
    .from("site_pages")
    .update({ content, updated_by: user.id })
    .eq("slug", slug)
    .select();

  if (error) return { success: false, error: error.message };
  if (!data || data.length === 0) {
    return { success: false, error: "Página não encontrada ou sem permissão." };
  }

  revalidatePath(`/sermoes/${slug}`);
  return { success: true };
}
