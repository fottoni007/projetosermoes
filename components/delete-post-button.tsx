"use client";

import { Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useTransition } from "react";
import { deletePostAction } from "@/lib/posts";

export default function DeletePostButton({ id }: { id: string }) {
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  function onClick() {
    if (!confirm("Apagar este post? Esta acção é irreversível.")) return;
    startTransition(async () => {
      const res = await deletePostAction(id);
      if (res.success) {
        router.push("/sermoes/dicas-preciosas");
        router.refresh();
      } else {
        alert(res.error ?? "Erro ao apagar o post.");
      }
    });
  }

  return (
    <button
      type="button"
      onClick={onClick}
      disabled={isPending}
      className="inline-flex items-center gap-2 rounded-md border border-clay/30 px-3 py-2 text-sm font-medium text-clay transition hover:bg-clay/5 disabled:opacity-50"
    >
      <Trash2 size={15} />
      {isPending ? "A apagar…" : "Apagar"}
    </button>
  );
}
