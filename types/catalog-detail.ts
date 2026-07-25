import type { CatalogKind } from "@/types/catalog";
import type { VillageSlug } from "@/types/database";

type CatalogDetailBase = {
  id: string;
  kind: CatalogKind;
  name: string;
  address: string | null;
  whatsappNumber: string | null;
  photoUrl: string | null;
  villageSlug: VillageSlug | null;
};

export type UmkmDetailData = CatalogDetailBase & {
  kind: "umkm";
  description: string | null;
};

export type WarungDetailData = CatalogDetailBase & {
  kind: "warung";
  ownerName: string | null;
};

export type CatalogDetailData = UmkmDetailData | WarungDetailData;
