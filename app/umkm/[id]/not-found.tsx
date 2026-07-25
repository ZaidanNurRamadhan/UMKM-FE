import { CatalogDetailStatus } from "@/components/catalog/catalog-detail-status";

export default function UmkmDetailNotFound() {
  return (
    <CatalogDetailStatus
      kind="umkm"
      title="Data UMKM tidak ditemukan"
      message="Data UMKM dengan ID tersebut tidak tersedia."
      actionHref="/"
      actionLabel="Kembali ke beranda"
    />
  );
}
