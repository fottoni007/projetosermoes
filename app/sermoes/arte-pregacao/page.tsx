import { redirect } from "next/navigation";
import EditablePage from "@/components/editable-page";
import { isAdminUser } from "@/lib/auth";
import { getSitePage } from "@/lib/site-pages";
import { getCurrentUser } from "@/lib/sermons";

export const dynamic = "force-dynamic";

export default async function Page() {
  const [user, page] = await Promise.all([getCurrentUser(), getSitePage("arte-pregacao")]);
  if (!user) redirect("/login");
  const admin = isAdminUser(user);

  return (
    <EditablePage
      slug="arte-pregacao"
      title={page?.title ?? "A Arte da Pregação"}
      initialContent={page?.content ?? ""}
      isAdmin={admin}
    />
  );
}
