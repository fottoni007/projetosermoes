import { redirect } from "next/navigation";
import EditablePage from "@/components/editable-page";
import { isAdminUser } from "@/lib/auth";
import { getSitePage } from "@/lib/site-pages";
import { getCurrentUser } from "@/lib/sermons";

export const dynamic = "force-dynamic";

export default async function Page() {
  const [user, page] = await Promise.all([getCurrentUser(), getSitePage("sobre")]);
  if (!user) redirect("/login");
  const admin = isAdminUser(user);

  return (
    <EditablePage
      slug="sobre"
      title={page?.title ?? "Servos Fiéis"}
      initialContent={page?.content ?? ""}
      isAdmin={admin}
    />
  );
}
