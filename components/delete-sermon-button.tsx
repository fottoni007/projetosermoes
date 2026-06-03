"use client";

import { Trash2 } from "lucide-react";
import { useTransition } from "react";

type Props = { action: () => Promise<void> };

export default function DeleteSermonButton({ action }: Props) {
  const [isPending, startTransition] = useTransition();

  function handleClick() {
    if (!confirm("Tens a certeza que queres apagar este sermão? Esta acção é irreversível.")) {
      return;
    }
    startTransition(async () => {
      await action();
    });
  }

  return (
    <button
      onClick={handleClick}
      disabled={isPending}
      className="inline-flex items-center gap-2 rounded-md border border-clay/30 px-3 py-2 text-sm font-medium text-clay transition hover:bg-clay/5 disabled:opacity-50"
    >
      <Trash2 size={15} />
      {isPending ? "A apagar…" : "Apagar"}
    </button>
  );
}
