import Link from "next/link";
import {
  CategoryBadge,
  PaginationButton,
  PhotoCell,
} from "@/components/admin/catalog-table-parts";
import {
  ChevronLeftIcon,
  ChevronRightIcon,
  DashboardIcon,
  EditIcon,
  PlusCircleIcon,
  PlusIcon,
  StoreIcon,
} from "@/components/icons/admin-icons";
import { CATALOG_CONFIG } from "@/constants/catalog";
import { AdminHeader } from "@/components/layout/admin-header";
import { AdminSidebar } from "@/components/layout/admin-sidebar";
import { DeleteCatalogButton } from "./delete-catalog-button";
import { ManageUmkmPanelPage } from "./manage-umkm-panel-page";
import { RetryButton } from "./retry-button";
import { getArticles } from "@/services/article.service";
import { getVillageAssetUrl } from "@/services/storage.service";
import { getUmkm } from "@/services/umkm.service";
import { getWarungs } from "@/services/warung.service";
import type { CatalogKind } from "@/types/catalog";
import type { Article, Umkm, VillageSlug, Warung } from "@/types/database";

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

            <section className="mt-8 overflow-hidden rounded-lg border border-[#bfc8bf]">
              <div className="overflow-x-auto">
                <table className="w-full min-w-[860px] border-collapse text-left">
                  <thead className="bg-[#2f662d] text-white">
                    <tr>
                      <th className="w-16 px-6 py-4 text-sm font-black">
                        No
                      </th>
                      <th className="w-24 px-6 py-4 text-sm font-black">
                        Foto
                      </th>
                      <th className="px-6 py-4 text-sm font-black">
                        {copy.nameHeader}
                      </th>
                      <th className="w-36 px-6 py-4 text-sm font-black">
                        Kategori
                      </th>
                      <th className="w-44 px-6 py-4 text-sm font-black">
                        WhatsApp
                      </th>
                      <th className="w-28 px-6 py-4 text-right text-sm font-black">
                        Aksi
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {result.items.length > 0 ? (
                      result.items.map((item, index) => (
                        <tr
                          key={item.id}
                          className="border-b border-[#e1e5e1] last:border-b-0"
                        >
                          <td className="px-6 py-4 text-sm text-[#465366]">
                            {index + 1}
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
                          {copy.empty}
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
              <div className="flex flex-col gap-4 bg-[#2f662d] px-6 py-4 text-white sm:flex-row sm:items-center sm:justify-between">
                <p className="text-sm font-medium">
                  Menampilkan {result.items.length > 0 ? "1" : "0"}-
                  {result.items.length} dari {result.total} {copy.totalLabel}
                </p>
                <div className="flex items-center gap-2">
                  <PaginationButton ariaLabel="Halaman sebelumnya">
                    <ChevronLeftIcon className="h-4 w-4" />
                  </PaginationButton>
                  <span className="grid h-8 min-w-8 place-items-center rounded-md bg-[#d67a00] px-3 text-sm font-black">
                    1
                  </span>
                  <span className="grid h-8 min-w-8 place-items-center px-3 text-sm">
                    2
                  </span>
                  <span className="grid h-8 min-w-8 place-items-center px-3 text-sm">
                    3
                  </span>
                  <span className="grid h-8 min-w-8 place-items-center px-3 text-sm">
                    ...
                  </span>
                  <span className="grid h-8 min-w-8 place-items-center px-3 text-sm">
                    9
                  </span>
                  <PaginationButton ariaLabel="Halaman berikutnya">
                    <ChevronRightIcon className="h-4 w-4" />
                  </PaginationButton>
                </div>
              </div>
            </section>
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
      items: umkm.slice(0, 5).map(mapUmkmPanelRow),
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
    if (kind === "article") {
      const articles = await getArticles({ villageSlug: village });

      return {
        items: articles.slice(0, 5).map(mapArticleRow),
        total: articles.length,
        error: null,
      };
    }

    if (kind === "warung") {
      const warungs = await getWarungs({ villageSlug: village });

      return {
        items: warungs.slice(0, 5).map(mapWarungRow),
        total: warungs.length,
        error: null,
      };
    }

    const umkm = await getUmkm({ villageSlug: village });

    return {
      items: umkm.slice(0, 5).map(mapUmkmRow),
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

function mapArticleRow(item: Article): UmkmRow {
  return {
    id: item.id,
    name: item.title,
    category: "ARTIKEL",
    whatsappNumber: null,
    photoUrl: null,
  };
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
