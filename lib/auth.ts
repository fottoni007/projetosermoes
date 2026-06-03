import type { User } from "@supabase/supabase-js";

export function isAdminUser(user: User | null) {
  const email = user?.email?.trim().toLowerCase();

  if (!email) {
    return false;
  }

  const adminEmails = (process.env.ADMIN_EMAILS ?? "")
    .split(",")
    .map((adminEmail) => adminEmail.trim().toLowerCase())
    .filter(Boolean);

  return adminEmails.includes(email);
}
