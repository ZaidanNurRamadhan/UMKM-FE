"use client";

import { useState } from "react";
import Link from "next/link";
import {
  CategoryBadge,
  PaginationButton,
  PhotoCell,
} from "@/components/admin/catalog-table-parts";
import {
  ChevronLeftIcon,
  ChevronRightIcon,
  EditIcon,
} from "@/components/icons/admin-icons";
import type { CatalogKind } from "@/types/catalog";
import { DeleteCatalogButton } from "./delete-catalog-button";

export type ManageCatalogTableRow = {
  id: string;
  name: string;
  category: string;
  whatsappNumber: string | null;
  photoUrl: string | null;
};

type ManageCatalogTableProps = {
  kind: CatalogKind;
  items: ManageCatalogTableRow[];
  listHref: string;
  nameHeader: string;
  empty: string;
  totalLabel: string;
};

const PAGE_SIZE = 10;

export function ManageCatalogTable({
  kind,
  items,
  listHref,
  nameHeader,
  empty,
  totalLabel,
}: ManageCatalogTableProps) {
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

  function handleSearchChange(value: string) {
    setSearchTerm(value);
    setPage(1);
  }

  return (
    <section className="mt-8 overflow-hidden rounded-lg border border-[#bfc8bf]">
      <div className="border-b border-[#dfe6df] bg-white px-6 py-4">
        <input
          id={`${kind}-search`}
          type="search"
          value={searchTerm}
          onChange={(event) => handleSearchChange(event.target.value)}
          placeholder={`Cari ${totalLabel}...`}
          className="h-11 w-full rounded-lg border border-[#cfd8cf] px-4 text-sm font-semibold text-[#1e2533] outline-none transition placeholder:text-[#8a938a] focus:border-[#2f662d] focus:ring-2 focus:ring-[#2f662d]/15"
        />
      </div>
      <div className="overflow-x-auto">
        <table className="w-full min-w-[860px] border-collapse text-left">
          <thead className="bg-[#2f662d] text-white">
            <tr>
              <th className="w-16 px-6 py-4 text-sm font-black">No</th>
              <th className="w-24 px-6 py-4 text-sm font-black">Foto</th>
              <th className="px-6 py-4 text-sm font-black">{nameHeader}</th>
              <th className="w-36 px-6 py-4 text-sm font-black">
                Kategori
              </th>
              <th className="w-44 px-6 py-4 text-sm font-black">WhatsApp</th>
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
                      <Link
                        href={`${listHref}/${item.id}/edit`}
                        aria-label={`Edit ${item.name}`}
                        className="transition hover:text-[#2e6230]"
                      >
                        <EditIcon className="h-5 w-5" />
                      </Link>
                      <DeleteCatalogButton
                        kind={kind}
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
                  {items.length === 0 ? empty : "Data tidak ditemukan."}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      <div className="flex flex-col gap-4 bg-[#2f662d] px-6 py-4 text-white sm:flex-row sm:items-center sm:justify-between">
        <p className="text-sm font-medium">
          Menampilkan {rangeStart}-{rangeEnd} dari {filteredItems.length}{" "}
          {totalLabel}
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
  );
}
