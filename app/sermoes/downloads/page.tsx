import { redirect } from "next/navigation";
import ResourcesSection from "@/components/resources-section";
import { isAdminUser } from "@/lib/auth";
import { getResources } from "@/lib/resources-data";
import { getCurrentUser } from "@/lib/sermons";

export const dynamic = "force-dynamic";
export const maxDuration = 60;

export default async function DownloadsPage() {
  const [user, resources] = await Promise.all([getCurrentUser(), getResources()]);
  if (!user) redirect("/login");
  const admin = isAdminUser(user);

  return (
    <section className="mx-auto max-w-3xl px-4 py-8 sm:px-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-ink sm:text-3xl">Downloads</h1>
        <p className="mt-1 text-sm text-ink/70">Materiais e documentos para descarregar.</p>
      </div>
      <ResourcesSection items={resources.map((r) => ({ id: r.id, title: r.title, url: r.url }))} isAdmin={admin} />
    </section>
  );
}
