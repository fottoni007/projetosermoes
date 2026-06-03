"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { isAdminUser } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";
import { pastorProfileSchema } from "@/lib/validations";
import type { PastorProfile, PastorProfileFormState } from "@/types/pastor";

export async function getMyPastorProfile(): Promise<PastorProfile | null> {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;
  const { data } = await supabase
    .from("pastor_profiles").select("*").eq("user_id", user.id).maybeSingle();
  return data as PastorProfile | null;
}

export async function isApprovedPastor(): Promise<boolean> {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return false;
  if (isAdminUser(user)) return true;
  const { data } = await supabase
    .from("pastor_profiles").select("status").eq("user_id", user.id).maybeSingle();
  return data?.status === "approved";
}

export async function savePastorProfile(
  _prev: PastorProfileFormState,
  formData: FormData
): Promise<PastorProfileFormState> {
  const raw = Object.fromEntries(formData.entries());
  const parsed = pastorProfileSchema.safeParse(raw);

  if (!parsed.success) {
    return {
      message: "Revê os campos assinalados.",
      errors: parsed.error.flatten().fieldErrors as Record<string, string[]>,
    };
  }

  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const existing = await getMyPastorProfile();

  const payload = {
    ...parsed.data,
    instagram_url: parsed.data.instagram_url || null,
    facebook_url: parsed.data.facebook_url || null,
    youtube_url: parsed.data.youtube_url || null,
    user_id: user.id,
    status: "pending" as const,
    rejection_reason: null,
  };

  if (existing) {
    const { error } = await supabase
      .from("pastor_profiles").update(payload).eq("user_id", user.id);
    if (error) return { message: error.message };
  } else {
    const { error } = await supabase.from("pastor_profiles").insert(payload);
    if (error) return { message: error.message };
  }

  revalidatePath("/pastores/perfil");
  return {
    message: existing
      ? "Perfil actualizado. Aguarda nova aprovação."
      : "Perfil submetido. Aguarda aprovação.",
    success: true,
  };
}

export async function listPendingPastorProfiles(): Promise<PastorProfile[]> {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user || !isAdminUser(user)) return [];
  const { data } = await supabase
    .from("pastor_profiles").select("*").order("created_at", { ascending: true });
  return (data ?? []) as PastorProfile[];
}

export async function approvePastorProfile(id: string): Promise<void> {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user || !isAdminUser(user)) return;
  await supabase
    .from("pastor_profiles")
    .update({ status: "approved", rejection_reason: null })
    .eq("id", id);
  revalidatePath("/sermoes/aprovar");
}

export async function rejectPastorProfile(id: string): Promise<void> {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user || !isAdminUser(user)) return;
  await supabase
    .from("pastor_profiles")
    .update({
      status: "rejected",
      rejection_reason:
        "O teu perfil de pastor não foi aprovado. Para mais informações, entra em contacto diretamente pelo email fottoni@icloud.com.",
    })
    .eq("id", id);
  revalidatePath("/sermoes/aprovar");
}

export async function toggleAutoApproval(id: string, revoke: boolean): Promise<void> {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user || !isAdminUser(user)) return;
  await supabase
    .from("pastor_profiles")
    .update({ auto_approve_revoked: revoke })
    .eq("id", id);
  revalidatePath("/sermoes/aprovar");
}
