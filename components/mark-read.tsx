"use client";

import { useRouter } from "next/navigation";
import { useEffect, useRef } from "react";
import { markAllReadAction } from "@/lib/notifications";

export default function MarkRead() {
  const router = useRouter();
  const done = useRef(false);
  useEffect(() => {
    if (done.current) return;
    done.current = true;
    markAllReadAction().then(() => router.refresh());
  }, [router]);
  return null;
}
