"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import { signOutAdmin } from "@/services/auth.service";
import { deleteUmkm } from "@/services/umkm.service";
import { deleteWarung } from "@/services/warung.service";
import type { CatalogKind } from "@/types/catalog";

type DeleteCatalogButtonProps = {
  kind: CatalogKind;
  id: string;
  name: string;
};

async function deleteByKind(kind: CatalogKind, id: string) {
  if (kind === "warung") {
    return deleteWarung(id);
  }

  return deleteUmkm(id);
}

export function DeleteCatalogButton({ kind, id, name }: DeleteCatalogButtonProps) {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  async function handleDelete() {
    setIsDeleting(true);
    const result = await deleteByKind(kind, id);
    setIsDeleting(false);

    if (!result.success) {
      if (result.code === "PHOTO_DELETE_FAILED") {
        toast.warning(result.message);
        setIsOpen(false);
        router.refresh();
        return;
      }

      toast.error(result.message);

      if (
        result.message === "Sesi login telah berakhir. Silakan login kembali." ||
        result.message === "Sesi login tidak ditemukan. Silakan login kembali."
      ) {
        await signOutAdmin();
        router.push("/admin/sign-in");
      }

      return;
    }

    toast.success(result.message);
    setIsOpen(false);
    router.refresh();
  }

  return (
    <>
      <button
        type="button"
        aria-label={`Hapus ${name}`}
        onClick={() => setIsOpen(true)}
        className="transition hover:text-[#b32323]"
      >
        <TrashIcon className="h-5 w-5" />
      </button>

      {isOpen && (
        <div className="fixed inset-0 z-50 grid place-items-center bg-black/45 px-4">
          <div className="w-full max-w-md rounded-lg border border-[#d0d0d0] bg-white p-6 text-[#111] shadow-xl">
            <h2 className="text-xl font-black text-[#2e6230]">
              Hapus data?
            </h2>
            <p className="mt-3 text-sm font-semibold leading-6 text-[#4c5868]">
              Data <span className="font-black">{name}</span> akan dihapus permanen. Tindakan ini tidak dapat
              dibatalkan.
            </p>
            <div className="mt-6 flex justify-end gap-3">
              <button
                type="button"
                disabled={isDeleting}
                onClick={() => setIsOpen(false)}
                className="inline-flex h-10 items-center justify-center rounded-md border border-[#d0d0d0] px-5 text-sm font-black text-[#2e6230] transition hover:bg-[#f3f8ef] disabled:cursor-not-allowed disabled:opacity-60"
              >
                Batal
              </button>
              <button
                type="button"
                disabled={isDeleting}
                onClick={handleDelete}
                className="inline-flex h-10 items-center justify-center rounded-md bg-[#e52525] px-5 text-sm font-black text-white transition hover:bg-[#c91f1f] disabled:cursor-not-allowed disabled:opacity-60"
              >
                {isDeleting ? "Menghapus..." : "Hapus"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

type IconProps = {
  className?: string;
};

function TrashIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" className={className}>
      <path d="M4 7h16" />
      <path d="M10 11v6" />
      <path d="M14 11v6" />
      <path d="M6 7l1 14h10l1-14" />
      <path d="M9 7V4h6v3" />
    </svg>
  );
}
