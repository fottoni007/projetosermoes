"use client";

import { Download, Printer, ToggleLeft, ToggleRight } from "lucide-react";
import { useTransition } from "react";
import { toggleAutoApproval } from "@/lib/pastor-profiles";
import type { PastorProfile } from "@/types/pastor";

function padNumber(n: number) {
  return String(n).padStart(4, "0");
}

function exportCsv(profiles: PastorProfile[]) {
  const headers = [
    "Nº", "Nome", "Igreja", "Morada", "Anos Pastorado", "Tipo",
    "Formação", "Indicativo", "Telefone", "Email",
    "Instagram", "Facebook", "YouTube", "Estado", "Auto-Aprovação"
  ];
  const rows = profiles.map((p, i) => [
    padNumber(i + 1),
    p.full_name, p.church_name, p.address, p.years_of_ministry,
    p.pastor_type === "senior" ? "Pastor Sénior" : "Pastor Colaborador",
    p.academic_background, p.phone_country_code, p.phone_number,
    p.contact_email, p.instagram_url ?? "", p.facebook_url ?? "",
    p.youtube_url ?? "",
    p.status === "approved" ? "Aprovado" : p.status === "pending" ? "Pendente" : "Rejeitado",
    p.auto_approve_revoked ? "Revogada" : p.status === "approved" ? "Activa" : "—",
  ]);

  const csv = [headers, ...rows]
    .map((r) => r.map((c) => `"${String(c).replace(/"/g, '""')}"`).join(","))
    .join("\n");

  const blob = new Blob(["\uFEFF" + csv], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `pastores_${new Date().toISOString().slice(0, 10)}.csv`;
  a.click();
  URL.revokeObjectURL(url);
}

const statusStyle: Record<string, string> = {
  approved: "bg-green-100 text-green-700",
  pending: "bg-amber-100 text-amber-700",
  rejected: "bg-red-100 text-red-700",
};
const statusLabel: Record<string, string> = {
  approved: "Aprovado", pending: "Pendente", rejected: "Rejeitado",
};

type Props = { profiles: PastorProfile[] };

export default function AdminPastorsTable({ profiles }: Props) {
  const [isPending, startTransition] = useTransition();

  return (
    <div>
      {/* Export buttons */}
      <div className="mb-4 flex flex-wrap gap-2 print:hidden">
        <button
          onClick={() => exportCsv(profiles)}
          className="inline-flex items-center gap-2 rounded-md border border-ink/10 bg-white px-3 py-2 text-sm font-medium text-ink transition hover:border-olive/30 hover:text-olive"
        >
          <Download size={15} />
          Exportar CSV / Excel
        </button>
        <button
          onClick={() => window.print()}
          className="inline-flex items-center gap-2 rounded-md border border-ink/10 bg-white px-3 py-2 text-sm font-medium text-ink transition hover:border-olive/30 hover:text-olive"
        >
          <Printer size={15} />
          Imprimir / PDF
        </button>
        <span className="self-center text-sm text-ink/70">
          {profiles.length} registo(s)
        </span>
      </div>

      {profiles.length === 0 ? (
        <div className="rounded-xl border border-dashed border-ink/20 bg-white p-8 text-center text-sm text-ink/70">
          Nenhum pastor registado.
        </div>
      ) : (
        <>
          {/* Desktop table */}
          <div className="hidden overflow-hidden rounded-xl border border-ink/10 bg-white shadow-soft sm:block">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="border-b border-ink/10 bg-mist/50">
                  <tr>
                    {["Nº", "Nome", "Igreja", "Tipo", "Contacto", "Estado", "Auto-Aprova.", ""].map((h) => (
                      <th key={h} className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-ink/70">
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-ink/5">
                  {profiles.map((p, i) => (
                    <tr key={p.id} className="transition-colors hover:bg-mist/30">
                      <td className="px-4 py-3 font-mono text-sm font-semibold text-ink/70">
                        {padNumber(i + 1)}
                      </td>
                      <td className="px-4 py-3 font-medium text-ink">{p.full_name}</td>
                      <td className="px-4 py-3 text-ink/70">
                        <div>{p.church_name}</div>
                        <div className="text-xs text-ink/70">{p.address}</div>
                      </td>
                      <td className="px-4 py-3 text-ink/70">
                        {p.pastor_type === "senior" ? "Sénior" : "Colaborador"}
                      </td>
                      <td className="px-4 py-3 text-ink/70">
                        <div>{p.contact_email}</div>
                        <div className="text-xs">{p.phone_country_code} {p.phone_number}</div>
                      </td>
                      <td className="px-4 py-3">
                        <span className={`rounded-full px-2.5 py-0.5 text-xs font-semibold ${statusStyle[p.status]}`}>
                          {statusLabel[p.status]}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        {p.status === "approved" ? (
                          <button
                            disabled={isPending}
                            onClick={() => startTransition(() => toggleAutoApproval(p.id, !p.auto_approve_revoked))}
                            className="inline-flex items-center gap-1.5 text-xs font-medium transition hover:opacity-80 disabled:opacity-40"
                          >
                            {p.auto_approve_revoked ? (
                              <><ToggleLeft size={18} className="text-ink/70" /> Revogada</>
                            ) : (
                              <><ToggleRight size={18} className="text-olive" /> Activa</>
                            )}
                          </button>
                        ) : (
                          <span className="text-xs text-ink/30">—</span>
                        )}
                      </td>
                      <td className="px-4 py-3">
                        {(p.instagram_url || p.facebook_url || p.youtube_url) && (
                          <div className="flex gap-2 text-xs text-ink/70">
                            {p.instagram_url && <a href={p.instagram_url} target="_blank" rel="noreferrer" className="hover:text-olive">IG</a>}
                            {p.facebook_url && <a href={p.facebook_url} target="_blank" rel="noreferrer" className="hover:text-olive">FB</a>}
                            {p.youtube_url && <a href={p.youtube_url} target="_blank" rel="noreferrer" className="hover:text-olive">YT</a>}
                          </div>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Mobile cards */}
          <div className="grid gap-3 sm:hidden">
            {profiles.map((p, i) => (
              <div key={p.id} className="rounded-xl border border-ink/10 bg-white p-4 shadow-soft">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <p className="text-xs font-mono font-semibold text-ink/70 mb-0.5">{padNumber(i + 1)}</p>
                    <p className="font-semibold text-ink">{p.full_name}</p>
                    <p className="text-sm text-ink/70">{p.church_name}</p>
                  </div>
                  <span className={`shrink-0 rounded-full px-2.5 py-0.5 text-xs font-semibold ${statusStyle[p.status]}`}>
                    {statusLabel[p.status]}
                  </span>
                </div>
                <dl className="mt-3 grid grid-cols-2 gap-2 text-xs text-ink/70">
                  <div><dt className="font-medium text-ink/70">Tipo</dt><dd>{p.pastor_type === "senior" ? "Sénior" : "Colaborador"}</dd></div>
                  <div><dt className="font-medium text-ink/70">Anos</dt><dd>{p.years_of_ministry}</dd></div>
                  <div className="col-span-2"><dt className="font-medium text-ink/70">Email</dt><dd>{p.contact_email}</dd></div>
                  <div className="col-span-2"><dt className="font-medium text-ink/70">Telefone</dt><dd>{p.phone_country_code} {p.phone_number}</dd></div>
                </dl>
                {p.status === "approved" && (
                  <div className="mt-3 border-t border-ink/5 pt-3">
                    <button
                      disabled={isPending}
                      onClick={() => startTransition(() => toggleAutoApproval(p.id, !p.auto_approve_revoked))}
                      className="inline-flex items-center gap-1.5 text-xs font-medium"
                    >
                      {p.auto_approve_revoked ? (
                        <><ToggleLeft size={16} className="text-ink/70" /> Auto-aprovação revogada</>
                      ) : (
                        <><ToggleRight size={16} className="text-olive" /> Auto-aprovação activa</>
                      )}
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
