import { notFound } from "next/navigation";
import { CatalogDetailPage } from "@/components/catalog/catalog-detail-page";
import { getVillageAssetUrl } from "@/services/storage.service";
import { getWarungById } from "@/services/warung.service";
import type { WarungDetailData } from "@/types/catalog-detail";
import type { Warung } from "@/types/database";

export const dynamic = "force-dynamic";

type PageProps = {
  params: Promise<{ id: string }>;
};

export default async function WarungDetailRoute({ params }: PageProps) {
  const { id } = await params;
  const warung = await getWarungById(id);

  if (!warung) {
    notFound();
  }

  return <CatalogDetailPage detail={mapWarungDetail(warung)} />;
}

function mapWarungDetail(warung: Warung): WarungDetailData {
  return {
    id: warung.id,
    kind: "warung",
    name: warung.name,
    ownerName: getVisibleText(warung.owner_name),
    address: getVisibleText(warung.address),
    whatsappNumber: getVisibleText(warung.whatsapp_number),
    photoUrl: getVillageAssetUrl(warung.photo_path),
    villageSlug: warung.villages?.slug ?? null,
  };
}

function getVisibleText(value: string | null): string | null {
  const trimmedValue = value?.trim();

  return trimmedValue || null;
}
