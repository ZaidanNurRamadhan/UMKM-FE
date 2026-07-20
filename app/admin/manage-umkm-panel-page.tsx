"use client";

import { useEffect, useState } from "react";
import {
  CategoryBadge,
  PaginationButton,
  PhotoCell,
} from "@/components/admin/catalog-table-parts";
import {
  ChevronLeftIcon,
  ChevronRightIcon,
  CloseIcon,
  DashboardIcon,
  EditIcon,
  PlusCircleIcon,
  StoreIcon,
} from "@/components/icons/admin-icons";
import { AdminHeader } from "@/components/layout/admin-header";
import { AdminSidebar } from "@/components/layout/admin-sidebar";
import { CatalogAdminForm } from "./catalog-admin-form";
import { DeleteCatalogButton } from "./delete-catalog-button";
import { RetryButton } from "./retry-button";
import type { CatalogFormMode } from "@/types/catalog";
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

const PAGE_SIZE = 10;

export function ManageUmkmPanelPage({
  village,
  items,
  total,
  error,
}: ManageUmkmPanelPageProps) {
  const [isPanelOpen, setIsPanelOpen] = useState(false);
  const [panelMode, setPanelMode] = useState<CatalogFormMode>("create");
  const [selectedItem, setSelectedItem] = useState<Umkm | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [page, setPage] = useState(1);
  const normalizedSearch = searchTerm.trim().toLowerCase();
  const filteredItems =
    normalizedSearch.length === 0
      ? items
      : items.filter((item) =>
          [item.name, item.category, item.whatsappNumber ?? ""]
            .join(" ")
            .toLowerCase()
            .includes(normalizedSearch),
        );
  const totalPages = Math.max(1, Math.ceil(filteredItems.length / PAGE_SIZE));
  const currentPage = Math.min(page, totalPages);
  const firstIndex = (currentPage - 1) * PAGE_SIZE;
  const visibleItems = filteredItems.slice(firstIndex, firstIndex + PAGE_SIZE);
  const rangeStart = filteredItems.length === 0 ? 0 : firstIndex + 1;
  const rangeEnd = Math.min(firstIndex + PAGE_SIZE, filteredItems.length);
  const footerTotal = normalizedSearch.length === 0 ? total : filteredItems.length;
  const sidebarItems = [
    {
      href: `/admin/${village}`,
      label: "Dashboard",
      icon: <DashboardIcon className="h-5 w-5" />,
    },
    {
      href: `/admin/${village}/umkm`,
      label: "Kelola UMKM",
      icon: <StoreIcon className="h-5 w-5" />,
      active: true,
    },
  ];

  useEffect(() => {
    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setIsPanelOpen(false);
      }
    }

    window.addEventListener("keydown", handleKeyDown);

    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  function openCreateUmkmPanel() {
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

  function handleSearchChange(value: string) {
    setSearchTerm(value);
    setPage(1);
  }

  return (
    <main className="min-h-screen bg-white text-[#111111]">
      <div className="lg:grid lg:min-h-screen lg:grid-cols-[325px_1fr]">
        <AdminSidebar
          village={village}
          showAdminName
          items={sidebarItems}
        />

        <div>
          <AdminHeader village={village} />

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
                onClick={openCreateUmkmPanel}
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
              <div className="border-b border-[#dfe6df] bg-white px-6 py-4">
                <input
                  id="umkm-search"
                  type="search"
                  value={searchTerm}
                  onChange={(event) => handleSearchChange(event.target.value)}
                  placeholder="Cari UMKM..."
                  className="h-11 w-full rounded-lg border border-[#cfd8cf] px-4 text-sm font-semibold text-[#1e2533] outline-none transition placeholder:text-[#8a938a] focus:border-[#2f662d] focus:ring-2 focus:ring-[#2f662d]/15"
                />
              </div>
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
                    {visibleItems.length > 0 ? (
                      visibleItems.map((item, index) => (
                        <tr
                          key={item.id}
                          className="border-b border-[#e1e5e1] last:border-b-0"
                        >
                          <td className="px-6 py-4 text-sm text-[#465366]">
                            {firstIndex + index + 1}
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
                          {items.length === 0
                            ? "Belum ada data UMKM."
                            : "Data tidak ditemukan."}
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
              <div className="flex flex-col gap-4 bg-[#2f662d] px-6 py-4 text-white sm:flex-row sm:items-center sm:justify-between">
                <p className="text-sm font-medium">
                  Menampilkan {rangeStart}-{rangeEnd} dari {footerTotal} UMKM
                </p>
                <div className="flex items-center gap-2">
                  <PaginationButton
                    ariaLabel="Halaman sebelumnya"
                    disabled={currentPage === 1}
                    onClick={() => setPage(Math.max(1, currentPage - 1))}
                  >
                    <ChevronLeftIcon className="h-4 w-4" />
                  </PaginationButton>
                  <span className="grid h-8 min-w-[72px] place-items-center rounded-md bg-[#d67a00] px-3 text-sm font-black">
                    {currentPage} / {totalPages}
                  </span>
                  <PaginationButton
                    ariaLabel="Halaman berikutnya"
                    disabled={currentPage === totalPages}
                    onClick={() => setPage(Math.min(totalPages, currentPage + 1))}
                  >
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
        aria-label={getPanelTitle(panelMode)}
        className={`fixed right-0 top-0 z-50 flex h-screen w-full max-w-none flex-col bg-white shadow-[-22px_0_50px_rgb(15_23_42/0.2)] transition-transform duration-300 ease-out sm:w-[75vw] ${
          isPanelOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex items-start justify-between border-b border-[#dfe6df] px-5 py-5 sm:px-7">
          <div>
            <h2 className="text-2xl font-black text-[#202a37]">
              {getPanelTitle(panelMode)}
            </h2>
            <p className="mt-1 text-sm font-medium text-[#667085]">
              {getPanelDescription(panelMode)}
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
        <div className="min-h-0 flex-1 overflow-y-auto lg:overflow-hidden">
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

function getPanelTitle(mode: CatalogFormMode): string {
  return mode === "edit" ? "Edit UMKM" : "Tambah UMKM";
}

function getPanelDescription(mode: CatalogFormMode): string {
  return mode === "edit"
    ? "Perbarui data UMKM tanpa berpindah halaman."
    : "Lengkapi data UMKM tanpa berpindah halaman.";
}
