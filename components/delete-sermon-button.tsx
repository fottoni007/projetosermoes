"use client";

import { Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useTransition } from "react";

type Props = { action: () => Promise<{ success: boolean; error?: string }> };

export default function DeleteSermonButton({ action }: Props) {
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  function handleClick() {
    if (!confirm("Tens a certeza que queres apagar este sermão? Esta acção é irreversível.")) {
      return;
    }
    startTransition(async () => {
      const result = await action();
      if (result.success) {
        router.push("/sermoes");
        router.refresh();
      } else {
        alert(result.error ?? "Erro ao apagar o sermão.");
      }
    });
  }

  return (
    <button
      type="button"
      onClick={handleClick}
      disabled={isPending}
      className="inline-flex items-center gap-2 rounded-md border border-clay/30 px-3 py-2 text-sm font-medium text-clay transition hover:bg-clay/5 disabled:opacity-50"
    >
      <Trash2 size={15} />
      {isPending ? "A apagar…" : "Apagar"}
    </button>
  );
}
