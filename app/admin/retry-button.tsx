"use client";

import { useRouter } from "next/navigation";
import { useTransition } from "react";

export function RetryButton() {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  return (
    <button
      type="button"
      disabled={isPending}
      onClick={() => startTransition(() => router.refresh())}
      className="mt-3 inline-flex h-9 items-center justify-center rounded-md bg-[#2e6230] px-4 text-xs font-black text-white transition hover:bg-[#245128] disabled:cursor-not-allowed disabled:opacity-60"
    >
      {isPending ? "Memuat..." : "Coba Lagi"}
    </button>
  );
}
