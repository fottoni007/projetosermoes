"use client";

import { Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { useToast } from "@/components/toast";

type Props = {
  action: () => Promise<{ success: boolean; error?: string }>;
  redirectTo?: string;
  small?: boolean;
};

export default function DeleteForumButton({ action, redirectTo, small }: Props) {
  const [confirming, setConfirming] = useState(false);
  const [isPending, startTransition] = useTransition();
  const router = useRouter();
  const toast = useToast();

  function doDelete() {
    startTransition(async () => {
      const res = await action();
      if (res.success) {
        toast("Apagado.", "success");
        if (redirectTo) router.push(redirectTo);
        router.refresh();
      } else {
        toast(res.error ?? "Erro ao apagar.", "error");
        setConfirming(false);
      }
    });
  }

  if (confirming) {
    return (
      <span className="inline-flex items-center gap-1.5 text-xs">
        <span className="text-ink/70">Apagar?</span>
        <button onClick={doDelete} disabled={isPending} className="inline-flex items-center rounded-md bg-clay px-2 py-1.5 font-semibold text-white transition hover:bg-clay/90 disabled:opacity-60">
          {isPending ? "…" : "Sim"}
        </button>
        <button onClick={() => setConfirming(false)} disabled={isPending} className="rounded-md border border-ink/15 px-2 py-1.5 font-medium text-ink/70 transition hover:bg-mist disabled:opacity-60">
          Não
        </button>
      </span>
    );
  }

  return (
    <button
      type="button"
      onClick={() => setConfirming(true)}
      aria-label="Apagar"
      className={`inline-flex items-center gap-1.5 rounded-md border border-clay/30 font-medium text-clay transition hover:bg-clay/5 ${small ? "px-2 py-1.5 text-xs" : "px-3 py-2 text-sm"}`}
    >
      <Trash2 size={small ? 13 : 15} />
      {!small && "Apagar"}
    </button>
  );
}
