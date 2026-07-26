import { ManageUmkmPanelPage, type CatalogPanelRow } from "./manage-umkm-panel-page";
import { getVillageAssetUrl } from "@/services/storage.service";
import { getUmkm } from "@/services/umkm.service";
import { getWarungs } from "@/services/warung.service";
import type { CatalogKind } from "@/types/catalog";
import type { Umkm, VillageSlug, Warung } from "@/types/database";

type ManageUmkmPageProps = {
  village: VillageSlug;
  kind?: CatalogKind;
};

type CatalogPanelData = {
  items: CatalogPanelRow[];
  total: number;
  error: string | null;
};

export default async function ManageUmkmPage({
  village,
  kind = "umkm",
}: ManageUmkmPageProps) {
  const result = await loadCatalogPanelRows(village, kind);

  return (
    <ManageUmkmPanelPage
      village={village}
      kind={kind}
      items={result.items}
      total={result.total}
      error={result.error}
    />
  );
}

async function loadCatalogPanelRows(
  village: VillageSlug,
  kind: CatalogKind,
): Promise<CatalogPanelData> {
  try {
    if (kind === "warung") {
      const warungs = await getWarungs({ villageSlug: village });

      return {
        items: warungs.map(mapWarungPanelRow),
        total: warungs.length,
        error: null,
      };
    }

    const umkm = await getUmkm({ villageSlug: village });

    return {
      items: umkm.map(mapUmkmPanelRow),
      total: umkm.length,
      error: null,
    };
  } catch (error) {
    return {
      items: [],
      total: 0,
      error:
        error instanceof Error
          ? error.message
          : "Data tidak dapat dimuat. Silakan coba lagi.",
    };
  }
}

function mapUmkmPanelRow(item: Umkm): CatalogPanelRow {
  return {
    id: item.id,
    name: item.name,
    category: inferCategory(`${item.name} ${item.description}`),
    whatsappNumber: item.whatsapp_number,
    photoUrl: getVillageAssetUrl(item.photo_path),
    data: item,
  };
}

function mapWarungPanelRow(item: Warung): CatalogPanelRow {
  return {
    id: item.id,
    name: item.name,
    category: "WARUNG",
    whatsappNumber: item.whatsapp_number,
    photoUrl: getVillageAssetUrl(item.photo_path),
    data: item,
  };
}

function inferCategory(text: string): string {
  const lowerText = text.toLowerCase();

  if (
    lowerText.includes("kerajinan") ||
    lowerText.includes("anyaman") ||
    lowerText.includes("bambu")
  ) {
    return "KERAJINAN";
  }

  if (
    lowerText.includes("madu") ||
    lowerText.includes("tani") ||
    lowerText.includes("sayur") ||
    lowerText.includes("kopi")
  ) {
    return "PERTANIAN";
  }

  if (lowerText.includes("jasa") || lowerText.includes("bengkel")) {
    return "JASA";
  }

  return "KULINER";
}
