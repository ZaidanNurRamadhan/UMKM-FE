"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { CatalogAdminForm, type CatalogFormMode } from "./catalog-admin-form";
import { DeleteCatalogButton } from "./delete-catalog-button";
import { RetryButton } from "./retry-button";
import type { Umkm, VillageSlug } from "@/types/database";

type UmkmPanelRow = {
  id: string;
  name: string;
  category: string;
  whatsappNumber: string | null;
  photoUrl: string | null;
  data: Umkm;
};

type ManageUmkmPanelPageProps = {
  village: VillageSlug;
  items: UmkmPanelRow[];
  total: number;
  error: string | null;
};

const adminName = {
  mangli: "Admin Mangli",
  munggangsari: "Admin Munggangsari",
} satisfies Record<VillageSlug, string>;

export function ManageUmkmPanelPage({
  village,
  items,
  total,
  error,
}: ManageUmkmPanelPageProps) {
  const [isPanelOpen, setIsPanelOpen] = useState(false);
  const [panelMode, setPanelMode] = useState<CatalogFormMode>("create");
  const [selectedItem, setSelectedItem] = useState<Umkm | null>(null);

  useEffect(() => {
    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setIsPanelOpen(false);
      }
    }

    window.addEventListener("keydown", handleKeyDown);

    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  function openCreatePanel() {
    setSelectedItem(null);
    setPanelMode("create");
    setIsPanelOpen(true);
  }

  function openEditPanel(item: Umkm) {
    setSelectedItem(item);
    setPanelMode("edit");
    setIsPanelOpen(true);
  }

  function closePanel() {
    setIsPanelOpen(false);
  }

  return (
    <main className="min-h-screen bg-white text-[#111111]">
      <div className="lg:grid lg:min-h-screen lg:grid-cols-[325px_1fr]">
        <aside className="flex border-b border-[#111] bg-white px-6 py-6 lg:min-h-screen lg:flex-col lg:border-b-0 lg:border-r">
          <div className="flex w-full items-center justify-between gap-6 lg:block">
            <div>
              <Logo size="large" />
              <p className="mt-5 text-base font-black text-[#2e6230]">
                {adminName[village]}
              </p>
            </div>
            <Link
              href="/admin/sign-in"
              className="inline-flex items-center gap-2 rounded-lg border border-[#d0d0d0] px-4 py-3 text-sm font-black text-[#2e6230] transition hover:bg-[#f3f8ef] lg:hidden"
            >
              <LogOutIcon className="h-5 w-5" />
              Keluar
            </Link>
          </div>

          <nav className="mt-10 hidden space-y-3 lg:block lg:pt-14">
            <Link
              href={`/admin/${village}`}
              className="flex h-10 items-center gap-4 rounded-lg border border-[#d0d0d0] px-6 text-base font-black text-[#2e6230] transition hover:bg-[#f3f8ef]"
            >
              <DashboardIcon className="h-5 w-5" />
              Dashboard
            </Link>
            <Link
              href={`/admin/${village}/umkm`}
              className="flex h-10 items-center gap-4 rounded-lg bg-[#dcf8d6] px-6 text-base font-black text-[#2e6230]"
            >
              <StoreIcon className="h-5 w-5" />
              Kelola UMKM
            </Link>
          </nav>

          <div className="mt-auto hidden space-y-5 pb-10 lg:block">
            <Link
              href="/admin/sign-in"
              className="flex h-12 w-[220px] items-center justify-center gap-4 rounded-lg bg-[#ffc9cf] text-base font-black text-[#111] transition hover:bg-[#ffb9c1]"
            >
              <LogOutIcon className="h-6 w-6" />
              Log Out
            </Link>
          </div>
        </aside>

        <div>
          <header className="flex min-h-[100px] items-center justify-between border-b border-[#111] px-6 py-6 md:px-8 lg:px-8">
            <div>
              <h1 className="text-2xl font-black text-[#2e6230]">
                Dashboard Overview
              </h1>
              <p className="text-sm font-bold text-[#8aa100]">
                Katalog Potensi Desa
              </p>
            </div>
            <div className="flex items-center gap-5 text-[#2e6230]">
              <p className="hidden text-xl font-black sm:block">
                {adminName[village]}
              </p>
              <UserIcon className="h-10 w-10 text-[#95ac00]" />
            </div>
          </header>

          <section className="mx-auto max-w-5xl px-6 py-10 md:px-10">
            <div className="flex flex-col justify-between gap-5 md:flex-row md:items-center">
              <div>
                <h2 className="text-4xl font-black text-[#2e6230]">
                  Kelola UMKM
                </h2>
                <p className="mt-1 text-base font-medium text-[#666]">
                  Manajemen basis data pelaku usaha mikro, kecil, dan menengah.
                </p>
              </div>
              <button
                type="button"
                onClick={openCreatePanel}
                className="inline-flex h-12 w-fit items-center justify-center gap-2 rounded-lg bg-[#33a4ff] px-6 text-base font-black text-white transition hover:bg-[#198de9]"
              >
                <PlusCircleIcon className="h-5 w-5" />
                Tambah UMKM
              </button>
            </div>

            {error && (
              <div className="mt-8 rounded-lg border border-[#d0d0d0] bg-[#fff7f7] px-5 py-4 text-sm font-bold text-[#9a2a2a]">
                {error}
                <RetryButton />
              </div>
            )}

            <section className="mt-8 overflow-hidden rounded-lg border border-[#bfc8bf]">
              <div className="overflow-x-auto">
                <table className="w-full min-w-[860px] border-collapse text-left">
                  <thead className="bg-[#2f662d] text-white">
                    <tr>
                      <th className="w-16 px-6 py-4 text-sm font-black">
                        No
                      </th>
                      <th className="w-24 px-6 py-4 text-sm font-black">
                        Foto
                      </th>
                      <th className="px-6 py-4 text-sm font-black">
                        Nama UMKM
                      </th>
                      <th className="w-36 px-6 py-4 text-sm font-black">
                        Kategori
                      </th>
                      <th className="w-44 px-6 py-4 text-sm font-black">
                        WhatsApp
                      </th>
                      <th className="w-28 px-6 py-4 text-right text-sm font-black">
                        Aksi
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {items.length > 0 ? (
                      items.map((item, index) => (
                        <tr
                          key={item.id}
                          className="border-b border-[#e1e5e1] last:border-b-0"
                        >
                          <td className="px-6 py-4 text-sm text-[#465366]">
                            {index + 1}
                          </td>
                          <td className="px-6 py-4">
                            <PhotoCell src={item.photoUrl} alt={item.name} />
                          </td>
                          <td className="px-6 py-4 text-base font-black text-[#1e2533]">
                            {item.name}
                          </td>
                          <td className="px-6 py-4">
                            <CategoryBadge category={item.category} />
                          </td>
                          <td className="px-6 py-4 text-sm text-[#465366]">
                            {item.whatsappNumber ?? "-"}
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex justify-end gap-5 text-[#4c5868]">
                              <button
                                type="button"
                                aria-label={`Edit ${item.name}`}
                                onClick={() => openEditPanel(item.data)}
                                className="transition hover:text-[#2e6230]"
                              >
                                <EditIcon className="h-5 w-5" />
                              </button>
                              <DeleteCatalogButton
                                kind="umkm"
                                id={item.id}
                                name={item.name}
                              />
                            </div>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td
                          colSpan={6}
                          className="px-6 py-16 text-center text-sm font-bold text-[#777]"
                        >
                          Belum ada data UMKM.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
              <div className="flex flex-col gap-4 bg-[#2f662d] px-6 py-4 text-white sm:flex-row sm:items-center sm:justify-between">
                <p className="text-sm font-medium">
                  Menampilkan {items.length > 0 ? "1" : "0"}-{items.length}{" "}
                  dari {total} UMKM
                </p>
                <div className="flex items-center gap-2">
                  <PaginationButton ariaLabel="Halaman sebelumnya">
                    <ChevronLeftIcon className="h-4 w-4" />
                  </PaginationButton>
                  <span className="grid h-8 min-w-8 place-items-center rounded-md bg-[#d67a00] px-3 text-sm font-black">
                    1
                  </span>
                  <span className="grid h-8 min-w-8 place-items-center px-3 text-sm">
                    2
                  </span>
                  <span className="grid h-8 min-w-8 place-items-center px-3 text-sm">
                    3
                  </span>
                  <span className="grid h-8 min-w-8 place-items-center px-3 text-sm">
                    ...
                  </span>
                  <span className="grid h-8 min-w-8 place-items-center px-3 text-sm">
                    9
                  </span>
                  <PaginationButton ariaLabel="Halaman berikutnya">
                    <ChevronRightIcon className="h-4 w-4" />
                  </PaginationButton>
                </div>
              </div>
            </section>
          </section>
        </div>
      </div>

      <div
        aria-hidden={!isPanelOpen}
        className={`fixed inset-0 z-40 bg-[#101828]/45 transition-opacity duration-300 ${
          isPanelOpen
            ? "pointer-events-auto opacity-100"
            : "pointer-events-none opacity-0"
        }`}
        onClick={closePanel}
      />
      <aside
        aria-label={panelMode === "edit" ? "Edit UMKM" : "Tambah UMKM"}
        className={`fixed right-0 top-0 z-50 flex h-screen w-full sm:w-[75vw] max-w-none flex-col bg-white shadow-[-22px_0_50px_rgb(15_23_42/0.2)] transition-transform duration-300 ease-out ${
          isPanelOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex items-start justify-between border-b border-[#dfe6df] px-5 py-5 sm:px-7">
          <div>
            <h2 className="text-2xl font-black text-[#202a37]">
              {panelMode === "edit" ? "Edit UMKM" : "Tambah UMKM"}
            </h2>
            <p className="mt-1 text-sm font-medium text-[#667085]">
              {panelMode === "edit"
                ? "Perbarui data UMKM tanpa berpindah halaman."
                : "Lengkapi data UMKM tanpa berpindah halaman."}
            </p>
          </div>
          <button
            type="button"
            aria-label="Tutup panel"
            onClick={closePanel}
            className="grid h-10 w-10 shrink-0 place-items-center rounded-full border border-[#d7dfd7] text-[#2e6230] transition hover:bg-[#f3f8ef]"
          >
            <CloseIcon className="h-5 w-5" />
          </button>
        </div>
        <div className="min-h-0 flex-1 overflow-y-auto">
          {isPanelOpen && (
            <CatalogAdminForm
              key={`${panelMode}-${selectedItem?.id ?? "baru"}`}
              kind="umkm"
              mode={panelMode}
              village={village}
              variant="panel"
              initialData={panelMode === "edit" ? selectedItem : null}
              onCancel={closePanel}
              onSaved={closePanel}
            />
          )}
        </div>
      </aside>
    </main>
  );
}

function PhotoCell({ src, alt }: { src: string | null; alt: string }) {
  if (!src) {
    return (
      <div className="relative h-12 w-12 overflow-hidden rounded border border-[#aeb3ae] bg-[#f8f8f8]">
        <span className="absolute left-[-8px] top-1/2 h-px w-[68px] rotate-45 bg-[#969c96]" />
        <span className="absolute left-[-8px] top-1/2 h-px w-[68px] -rotate-45 bg-[#969c96]" />
      </div>
    );
  }

  return (
    <div className="relative h-12 w-12 overflow-hidden rounded border border-[#d9ded9] bg-[#f8f8f8]">
      <Image src={src} alt={alt} fill className="object-cover" sizes="48px" />
    </div>
  );
}

function CategoryBadge({ category }: { category: string }) {
  return (
    <span className="inline-flex rounded-full bg-[#ace5ad] px-3 py-1 text-[10px] font-black text-[#0a1d0b]">
      {category}
    </span>
  );
}

function PaginationButton({
  ariaLabel,
  children,
}: {
  ariaLabel: string;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      aria-label={ariaLabel}
      className="grid h-8 w-8 place-items-center rounded border border-white/90 transition hover:bg-white/10"
    >
      {children}
    </button>
  );
}

function Logo({ size }: { size: "small" | "large" }) {
  const imageClass = size === "large" ? "h-12 w-auto" : "h-12 w-auto";
  const titleClass =
    size === "large"
      ? "text-2xl font-black leading-[0.88]"
      : "text-2xl font-black leading-[0.88]";

  return (
    <Link href="/" className="flex items-center gap-3">
      <Image
        src="/images/kabupaten.png"
        alt="Logo Kabupaten Magelang"
        width={42}
        height={56}
        className={imageClass}
      />
      <div>
        <p className={`${titleClass} text-[#2e6230]`}>
          Mangli
          <br />
          Munggangsari
        </p>
        <p className="mt-1 text-xs font-black text-[#8aa100]">
          Katalog Potensi Desa
        </p>
      </div>
    </Link>
  );
}

type IconProps = {
  className?: string;
};

function DashboardIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={className}>
      <rect x="4" y="4" width="6" height="6" />
      <rect x="14" y="4" width="6" height="6" />
      <rect x="4" y="14" width="6" height="6" />
      <rect x="14" y="14" width="6" height="6" />
    </svg>
  );
}

function StoreIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={className}>
      <path d="M4 10h16l-1.2-5.5H5.2L4 10Z" />
      <path d="M6 10v9h12v-9" />
      <path d="M9 19v-5h6v5" />
      <path d="M4 10a2 2 0 0 0 4 0 2 2 0 0 0 4 0 2 2 0 0 0 4 0 2 2 0 0 0 4 0" />
    </svg>
  );
}

function UserIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
      <circle cx="12" cy="6" r="4" />
      <path d="M3 21a9 9 0 0 1 18 0" />
    </svg>
  );
}

function PlusIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" className={className}>
      <path d="M12 5v14" />
      <path d="M5 12h14" />
    </svg>
  );
}

function PlusCircleIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" className={className}>
      <circle cx="12" cy="12" r="9" />
      <path d="M12 8v8" />
      <path d="M8 12h8" />
    </svg>
  );
}

function LogOutIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={className}>
      <path d="M14 8V5a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h7a2 2 0 0 0 2-2v-3" />
      <path d="M9 12h12" />
      <path d="m17 8 4 4-4 4" />
    </svg>
  );
}

function EditIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" className={className}>
      <path d="m14 5 5 5" />
      <path d="M4 20h5L20 9a3.54 3.54 0 0 0-5-5L4 15v5Z" />
    </svg>
  );
}

function ChevronLeftIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" className={className}>
      <path d="m15 18-6-6 6-6" />
    </svg>
  );
}

function ChevronRightIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" className={className}>
      <path d="m9 18 6-6-6-6" />
    </svg>
  );
}

function CloseIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.3" className={className}>
      <path d="m6 6 12 12" />
      <path d="M18 6 6 18" />
    </svg>
  );
}
