"use server";

import { revalidatePath } from "next/cache";
import { isAdminUser } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";

export async function deleteSermonAction(
  id: string
): Promise<{ success: boolean; error?: string }> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return { success: false, error: "Não autenticado." };

  const admin = isAdminUser(user);

  if (!admin) {
    const { data: sermon } = await supabase
      .from("sermons")
      .select("created_by")
      .eq("id", id)
      .maybeSingle();

    if (!sermon || sermon.created_by !== user.id) {
      return { success: false, error: "Sem permissão para apagar este sermão." };
    }
  }

  const { error } = await supabase.from("sermons").delete().eq("id", id);

  if (error) return { success: false, error: error.message };

  revalidatePath("/sermoes");
  return { success: true };
}
