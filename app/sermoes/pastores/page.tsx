import { redirect } from "next/navigation";
import AdminPastorsTable from "@/components/admin-pastors-table";
import { listPendingPastorProfiles } from "@/lib/pastor-profiles";
import { getCurrentUser } from "@/lib/sermons";
import { isAdminUser } from "@/lib/auth";

export const dynamic = "force-dynamic";

export default async function PastoresPage() {
  const user = await getCurrentUser();
  if (!user || !isAdminUser(user)) redirect("/sermoes");

  const profiles = await listPendingPastorProfiles();

  return (
    <section className="px-4 py-8 sm:px-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-ink sm:text-3xl">Todos os pastores</h1>
        <p className="mt-1 text-sm text-ink/55">
          {profiles.length} pastor(es) registado(s) · Exportável em CSV/Excel ou PDF
        </p>
      </div>
      <AdminPastorsTable profiles={profiles} />
    </section>
  );
}
