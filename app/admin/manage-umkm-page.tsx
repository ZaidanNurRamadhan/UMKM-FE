import Link from "next/link";
import {
  DashboardIcon,
  PlusCircleIcon,
  PlusIcon,
  StoreIcon,
} from "@/components/icons/admin-icons";
import { CATALOG_CONFIG } from "@/constants/catalog";
import { AdminHeader } from "@/components/layout/admin-header";
import { AdminSidebar } from "@/components/layout/admin-sidebar";
import { ManageCatalogTable } from "./manage-catalog-table";
import { ManageUmkmPanelPage } from "./manage-umkm-panel-page";
import { RetryButton } from "./retry-button";
import { getVillageAssetUrl } from "@/services/storage.service";
import { getUmkm } from "@/services/umkm.service";
import { getWarungs } from "@/services/warung.service";
import type { CatalogKind } from "@/types/catalog";
import type { Umkm, VillageSlug, Warung } from "@/types/database";

type ManageUmkmPageProps = {
  village: VillageSlug;
  kind?: CatalogKind;
};

type UmkmRow = {
  id: string;
  name: string;
  category: string;
  whatsappNumber: string | null;
  photoUrl: string | null;
};

type UmkmData = {
  items: UmkmRow[];
  total: number;
  error: string | null;
};

type UmkmPanelRow = UmkmRow & {
  data: Umkm;
};

type UmkmPanelData = {
  items: UmkmPanelRow[];
  total: number;
  error: string | null;
};

export default async function ManageUmkmPage({
  village,
  kind = "umkm",
}: ManageUmkmPageProps) {
  const copy = CATALOG_CONFIG[kind];
  const listHref = `/admin/${village}/${copy.segment}`;
  const addHref = `${listHref}/tambah`;

  if (kind === "umkm") {
    const panelResult = await loadUmkmPanelRows(village);

    return (
      <ManageUmkmPanelPage
        village={village}
        items={panelResult.items}
        total={panelResult.total}
        error={panelResult.error}
      />
    );
  }

  const result = await loadCatalogRows(village, kind);

  return (
    <main className="min-h-screen bg-white text-[#111111]">
      <div className="lg:grid lg:min-h-screen lg:grid-cols-[325px_1fr]">
        <AdminSidebar
          village={village}
          showAdminName
          items={[
            {
              href: `/admin/${village}`,
              label: "Dashboard",
              icon: <DashboardIcon className="h-5 w-5" />,
            },
            {
              href: `/admin/${village}/umkm`,
              label: "Kelola UMKM",
              icon: <StoreIcon className="h-5 w-5" />,
            },
            {
              href: listHref,
              label: copy.manageLabel,
              icon: <StoreIcon className="h-5 w-5" />,
              active: true,
            },
          ]}
          primaryAction={{
            href: addHref,
            label: copy.addLabel,
            icon: <PlusIcon className="h-5 w-5" />,
          }}
        />

        <div>
          <AdminHeader village={village} />

          <section className="mx-auto max-w-5xl px-6 py-10 md:px-10">
            <div className="flex flex-col justify-between gap-5 md:flex-row md:items-center">
              <div>
                <h2 className="text-4xl font-black text-[#2e6230]">
                  {copy.listTitle}
                </h2>
                <p className="mt-1 text-base font-medium text-[#666]">
                  {copy.listDescription}
                </p>
              </div>
              <Link
                href={addHref}
                className="inline-flex h-12 w-fit items-center justify-center gap-2 rounded-lg bg-[#33a4ff] px-6 text-base font-black text-white transition hover:bg-[#198de9]"
              >
                <PlusCircleIcon className="h-5 w-5" />
                {copy.addLabel}
              </Link>
            </div>

            {result.error && (
              <div className="mt-8 rounded-lg border border-[#d0d0d0] bg-[#fff7f7] px-5 py-4 text-sm font-bold text-[#9a2a2a]">
                {result.error}
                <RetryButton />
              </div>
            )}

            <ManageCatalogTable
              kind={kind}
              items={result.items}
              listHref={listHref}
              nameHeader={copy.nameHeader}
              empty={copy.empty}
              totalLabel={copy.totalLabel}
            />
          </section>
        </div>
      </div>
    </main>
  );
}

async function loadUmkmPanelRows(village: VillageSlug): Promise<UmkmPanelData> {
  try {
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

async function loadCatalogRows(
  village: VillageSlug,
  kind: CatalogKind,
): Promise<UmkmData> {
  try {
    if (kind === "warung") {
      const warungs = await getWarungs({ villageSlug: village });

      return {
        items: warungs.map(mapWarungRow),
        total: warungs.length,
        error: null,
      };
    }

    const umkm = await getUmkm({ villageSlug: village });

    return {
      items: umkm.map(mapUmkmRow),
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

function mapUmkmRow(item: Umkm): UmkmRow {
  return {
    id: item.id,
    name: item.name,
    category: inferCategory(`${item.name} ${item.description}`),
    whatsappNumber: item.whatsapp_number,
    photoUrl: getVillageAssetUrl(item.photo_path),
  };
}

function mapUmkmPanelRow(item: Umkm): UmkmPanelRow {
  return {
    ...mapUmkmRow(item),
    data: item,
  };
}

function mapWarungRow(item: Warung): UmkmRow {
  return {
    id: item.id,
    name: item.name,
    category: "WARUNG",
    whatsappNumber: item.whatsapp_number,
    photoUrl: getVillageAssetUrl(item.photo_path),
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
