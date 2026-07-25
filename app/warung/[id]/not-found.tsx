import { CatalogDetailStatus } from "@/components/catalog/catalog-detail-status";

export default function WarungDetailNotFound() {
  return (
    <CatalogDetailStatus
      kind="warung"
      title="Data Warung tidak ditemukan"
      message="Data Warung dengan ID tersebut tidak tersedia."
      actionHref="/"
      actionLabel="Kembali ke beranda"
    />
  );
}
