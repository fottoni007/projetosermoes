"use server";

import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

export async function signIn(formData: FormData) {
  const email = String(formData.get("email") ?? "").trim();
  const password = String(formData.get("password") ?? "").trim();
  const supabase = await createClient();

  const { error } = await supabase.auth.signInWithPassword({
    email,
    password
  });

  if (error) {
    redirect(`/login?erro=${encodeURIComponent(error.message)}`);
  }

  redirect("/sermoes");
}

export async function signUp(formData: FormData) {
  const email = String(formData.get("new-email") ?? "").trim();
  const password = String(formData.get("new-password") ?? "").trim();
  const confirmPassword = String(formData.get("confirm-password") ?? "").trim();
  const acceptsRgpd = formData.get("accepts-rgpd") === "on";

  if (password.length < 6) {
    redirect("/login?registo=palavra-passe-curta");
  }

  if (password !== confirmPassword) {
    redirect("/login?registo=palavras-passe-diferentes");
  }

  if (!acceptsRgpd) {
    redirect("/login?registo=rgpd-obrigatorio");
  }

  const supabase = await createClient();
  const { error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        rgpd_accepted: true,
        rgpd_accepted_at: new Date().toISOString(),
        rgpd_contact_email: "fottoni@icloud.com"
      }
    }
  });

  if (error) {
    redirect(`/login?registo=${encodeURIComponent(error.message)}`);
  }

  redirect("/login?registo=conta-criada");
}
