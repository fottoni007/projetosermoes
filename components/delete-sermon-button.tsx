"use client";

import { Trash2 } from "lucide-react";

type Props = { action: () => Promise<void> };

export default function DeleteSermonButton({ action }: Props) {
  return (
    <form
      action={action}
      onSubmit={(e) => {
        if (!confirm("Tens a certeza que queres apagar este sermão? Esta acção é irreversível.")) {
          e.preventDefault();
        }
      }}
    >
      <button
        type="submit"
        className="inline-flex items-center gap-2 rounded-md border border-clay/30 px-3 py-2 text-sm font-medium text-clay transition hover:bg-clay/5"
      >
        <Trash2 size={15} />
        Apagar
      </button>
    </form>
  );
}
