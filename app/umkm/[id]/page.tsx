import { notFound } from "next/navigation";
import { CatalogDetailPage } from "@/components/catalog/catalog-detail-page";
import { getVillageAssetUrl } from "@/services/storage.service";
import { getUmkmById } from "@/services/umkm.service";
import type { UmkmDetailData } from "@/types/catalog-detail";
import type { Umkm } from "@/types/database";

export const dynamic = "force-dynamic";

type PageProps = {
  params: Promise<{ id: string }>;
};

export default async function UmkmDetailRoute({ params }: PageProps) {
  const { id } = await params;
  const umkm = await getUmkmById(id);

  if (!umkm) {
    notFound();
  }

  return <CatalogDetailPage detail={mapUmkmDetail(umkm)} />;
}

function mapUmkmDetail(umkm: Umkm): UmkmDetailData {
  return {
    id: umkm.id,
    kind: "umkm",
    name: umkm.name,
    description: getVisibleText(umkm.description),
    address: getVisibleText(umkm.address),
    whatsappNumber: getVisibleText(umkm.whatsapp_number),
    photoUrl: getVillageAssetUrl(umkm.photo_path),
    villageSlug: umkm.villages?.slug ?? null,
  };
}

function getVisibleText(value: string | null): string | null {
  const trimmedValue = value?.trim();

  return trimmedValue || null;
}
