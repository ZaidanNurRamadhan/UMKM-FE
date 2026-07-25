"use client";

import { CatalogDetailError } from "@/components/catalog/catalog-detail-error";

type ErrorProps = {
  error: Error & { digest?: string };
  reset: () => void;
};

export default function UmkmDetailError({ reset }: ErrorProps) {
  return (
    <CatalogDetailError
      kind="umkm"
      title="Data UMKM gagal dimuat"
      message="Terjadi kesalahan saat mengambil data UMKM."
      reset={reset}
    />
  );
}
