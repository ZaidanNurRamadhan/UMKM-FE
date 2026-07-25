"use client";

import { CatalogDetailError } from "@/components/catalog/catalog-detail-error";

type ErrorProps = {
  error: Error & { digest?: string };
  reset: () => void;
};

export default function WarungDetailError({ reset }: ErrorProps) {
  return (
    <CatalogDetailError
      kind="warung"
      title="Data Warung gagal dimuat"
      message="Terjadi kesalahan saat mengambil data Warung."
      reset={reset}
    />
  );
}
