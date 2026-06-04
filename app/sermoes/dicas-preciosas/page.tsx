import { redirect } from "next/navigation";
import EditablePage from "@/components/editable-page";
import ResourcesSection from "@/components/resources-section";
import { isAdminUser } from "@/lib/auth";
import { getResources } from "@/lib/resources-data";
import { getSitePage } from "@/lib/site-pages";
import { getCurrentUser } from "@/lib/sermons";

export const dynamic = "force-dynamic";
export const maxDuration = 60;

export default async function DicasPreciosasPage() {
  const [user, page, resources] = await Promise.all([
    getCurrentUser(),
    getSitePage("dicas-preciosas"),
    getResources(),
  ]);
  if (!user) redirect("/login");
  const admin = isAdminUser(user);

  return (
    <>
      <EditablePage
        slug="dicas-preciosas"
        title={page?.title ?? "Dicas Preciosas"}
        initialContent={page?.content ?? ""}
        isAdmin={admin}
      />
      <section className="mx-auto max-w-3xl px-4 pb-10 sm:px-6">
        <ResourcesSection
          items={resources.map((r) => ({ id: r.id, title: r.title, url: r.url }))}
          isAdmin={admin}
        />
      </section>
    </>
  );
}
