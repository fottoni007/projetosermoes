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

  // .select() devolve as linhas apagadas — permite verificar que algo foi de facto removido.
  const { data, error } = await supabase
    .from("sermons")
    .delete()
    .eq("id", id)
    .select();

  if (error) return { success: false, error: error.message };

  if (!data || data.length === 0) {
    return {
      success: false,
      error: "O sermão não foi apagado. Verifica as permissões ou se o registo ainda existe.",
    };
  }

  revalidatePath("/sermoes");
  return { success: true };
}
