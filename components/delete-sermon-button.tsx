"use client";

import { Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { useToast } from "@/components/toast";

export default function DeleteSermonButton({ action }: { action: () => Promise<{ success: boolean; error?: string }> }) {
  const [confirming, setConfirming] = useState(false);
  const [isPending, startTransition] = useTransition();
  const router = useRouter();
  const toast = useToast();

  function doDelete() {
    startTransition(async () => {
      const res = await action();
      if (res.success) {
        toast("Sermão apagado.", "success");
        router.push("/sermoes");
        router.refresh();
      } else {
        toast(res.error ?? "Erro ao apagar o sermão.", "error");
        setConfirming(false);
      }
    });
  }

  if (confirming) {
    return (
      <span className="inline-flex items-center gap-2 text-sm">
        <span className="text-ink/70">Apagar?</span>
        <button onClick={doDelete} disabled={isPending} className="inline-flex items-center rounded-md bg-clay px-2.5 py-2 text-xs font-semibold text-white transition hover:bg-clay/90 disabled:opacity-60">
          {isPending ? "A apagar…" : "Sim"}
        </button>
        <button onClick={() => setConfirming(false)} disabled={isPending} className="rounded-md border border-ink/15 px-2.5 py-2 text-xs font-medium text-ink/70 transition hover:bg-mist disabled:opacity-60">
          Não
        </button>
      </span>
    );
  }

  return (
    <button onClick={() => setConfirming(true)} className="inline-flex items-center gap-2 rounded-md border border-clay/30 px-3 py-2 text-sm font-medium text-clay transition hover:bg-clay/5">
      <Trash2 size={15} /> Apagar
    </button>
  );
}
