"use client";

import { Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useTransition } from "react";

type Props = {
  action: () => Promise<{ success: boolean; error?: string }>;
  redirectTo?: string;
  confirmText?: string;
  small?: boolean;
};

export default function DeleteForumButton({ action, redirectTo, confirmText, small }: Props) {
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  function onClick() {
    if (!confirm(confirmText ?? "Apagar? Esta acção é irreversível.")) return;
    startTransition(async () => {
      const res = await action();
      if (res.success) {
        if (redirectTo) router.push(redirectTo);
        router.refresh();
      } else {
        alert(res.error ?? "Erro ao apagar.");
      }
    });
  }

  return (
    <button
      type="button"
      onClick={onClick}
      disabled={isPending}
      title="Apagar"
      className={`inline-flex items-center gap-1.5 rounded-md border border-clay/30 font-medium text-clay transition hover:bg-clay/5 disabled:opacity-50 ${small ? "px-2 py-1 text-xs" : "px-3 py-2 text-sm"}`}
    >
      <Trash2 size={small ? 13 : 15} />
      {!small && (isPending ? "A apagar…" : "Apagar")}
    </button>
  );
}
