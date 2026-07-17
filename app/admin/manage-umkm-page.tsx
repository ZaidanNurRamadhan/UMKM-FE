import Image from "next/image";
import Link from "next/link";
import { DeleteCatalogButton } from "./delete-catalog-button";
import { ManageUmkmPanelPage } from "./manage-umkm-panel-page";
import { RetryButton } from "./retry-button";
import { getArticles } from "@/services/article.service";
import { getVillageAssetUrl } from "@/services/storage.service";
import { getUmkm } from "@/services/umkm.service";
import { getWarungs } from "@/services/warung.service";
import type { Article, Umkm, VillageSlug, Warung } from "@/types/database";
import type { CatalogKind } from "./catalog-admin-form";

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

const adminName = {
  mangli: "Admin Mangli",
  munggangsari: "Admin Munggangsari",
} satisfies Record<VillageSlug, string>;

const pageCopy = {
  umkm: {
    manageLabel: "Kelola UMKM",
    addLabel: "Tambah UMKM",
    title: "Kelola UMKM",
    description:
      "Manajemen basis data pelaku usaha mikro, kecil, dan menengah.",
    nameHeader: "Nama UMKM",
    empty: "Belum ada data UMKM.",
    totalLabel: "UMKM",
    segment: "umkm",
  },
  warung: {
    manageLabel: "Kelola Warung",
    addLabel: "Tambah Warung",
    title: "Kelola Warung",
    description: "Manajemen basis data warung dan kuliner lokal desa.",
    nameHeader: "Nama Warung",
    empty: "Belum ada data warung.",
    totalLabel: "warung",
    segment: "warung",
  },
  article: {
    manageLabel: "Kelola Artikel",
    addLabel: "Tambah Artikel",
    title: "Kelola Artikel",
    description: "Manajemen artikel potensi dan cerita inspiratif desa.",
    nameHeader: "Judul Artikel",
    empty: "Belum ada data artikel.",
    totalLabel: "artikel",
    segment: "artikel",
  },
} satisfies Record<
  CatalogKind,
  {
    manageLabel: string;
    addLabel: string;
    title: string;
    description: string;
    nameHeader: string;
    empty: string;
    totalLabel: string;
    segment: string;
  }
>;

export default async function ManageUmkmPage({
  village,
  kind = "umkm",
}: ManageUmkmPageProps) {
  const copy = pageCopy[kind];
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
        <aside className="flex border-b border-[#111] bg-white px-6 py-6 lg:min-h-screen lg:flex-col lg:border-b-0 lg:border-r">
          <div className="flex w-full items-center justify-between gap-6 lg:block">
            <div>
              <Logo size="large" />
              <p className="mt-5 text-base font-black text-[#2e6230]">
                {adminName[village]}
              </p>
            </div>
            <Link
              href="/admin/sign-in"
              className="inline-flex items-center gap-2 rounded-lg border border-[#d0d0d0] px-4 py-3 text-sm font-black text-[#2e6230] transition hover:bg-[#f3f8ef] lg:hidden"
            >
              <LogOutIcon className="h-5 w-5" />
              Keluar
            </Link>
          </div>

          <nav className="mt-10 hidden space-y-3 lg:block lg:pt-14">
            <Link
              href={`/admin/${village}`}
              className="flex h-10 items-center gap-4 rounded-lg border border-[#d0d0d0] px-6 text-base font-black text-[#2e6230] transition hover:bg-[#f3f8ef]"
            >
              <DashboardIcon className="h-5 w-5" />
              Dashboard
            </Link>
            <Link
              href={`/admin/${village}/umkm`}
              className="flex h-10 items-center gap-4 rounded-lg border border-[#d0d0d0] px-6 text-base font-black text-[#2e6230] transition hover:bg-[#f3f8ef]"
            >
              <StoreIcon className="h-5 w-5" />
              Kelola UMKM
            </Link>
            <Link
              href={listHref}
              className="flex h-10 items-center gap-4 rounded-lg bg-[#dcf8d6] px-6 text-base font-black text-[#2e6230]"
            >
              <StoreIcon className="h-5 w-5" />
              {copy.manageLabel}
            </Link>
          </nav>

          <div className="mt-auto hidden space-y-5 pb-10 lg:block">
            <Link
              href={addHref}
              className="flex h-12 w-[210px] items-center justify-center gap-4 rounded-lg bg-[#33a4ff] text-base font-black text-white transition hover:bg-[#198de9]"
            >
              <PlusIcon className="h-5 w-5" />
              {copy.addLabel}
            </Link>
            <Link
              href="/admin/sign-in"
              className="flex h-12 w-[220px] items-center justify-center gap-4 rounded-lg bg-[#ffc9cf] text-base font-black text-[#111] transition hover:bg-[#ffb9c1]"
            >
              <LogOutIcon className="h-6 w-6" />
              Log Out
            </Link>
          </div>
        </aside>

        <div>
          <header className="flex min-h-[100px] items-center justify-between border-b border-[#111] px-6 py-6 md:px-8 lg:px-8">
            <div>
              <h1 className="text-2xl font-black text-[#2e6230]">
                Dashboard Overview
              </h1>
              <p className="text-sm font-bold text-[#8aa100]">
                Katalog Potensi Desa
              </p>
            </div>
            <div className="flex items-center gap-5 text-[#2e6230]">
              <p className="hidden text-xl font-black sm:block">
                {adminName[village]}
              </p>
              <UserIcon className="h-10 w-10 text-[#95ac00]" />
            </div>
          </header>

          <section className="mx-auto max-w-5xl px-6 py-10 md:px-10">
            <div className="flex flex-col justify-between gap-5 md:flex-row md:items-center">
              <div>
                <h2 className="text-4xl font-black text-[#2e6230]">
                  {copy.title}
                </h2>
                <p className="mt-1 text-base font-medium text-[#666]">
                  {copy.description}
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

function PhotoCell({ src, alt }: { src: string | null; alt: string }) {
  if (!src) {
    return (
      <div className="relative h-12 w-12 overflow-hidden rounded border border-[#aeb3ae] bg-[#f8f8f8]">
        <span className="absolute left-[-8px] top-1/2 h-px w-[68px] rotate-45 bg-[#969c96]" />
        <span className="absolute left-[-8px] top-1/2 h-px w-[68px] -rotate-45 bg-[#969c96]" />
      </div>
    );
  }

  return (
    <div className="relative h-12 w-12 overflow-hidden rounded border border-[#d9ded9] bg-[#f8f8f8]">
      <Image src={src} alt={alt} fill className="object-cover" sizes="48px" />
    </div>
  );
}

function CategoryBadge({ category }: { category: string }) {
  return (
    <span className="inline-flex rounded-full bg-[#ace5ad] px-3 py-1 text-[10px] font-black text-[#0a1d0b]">
      {category}
    </span>
  );
}

function PaginationButton({
  ariaLabel,
  children,
}: {
  ariaLabel: string;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      aria-label={ariaLabel}
      className="grid h-8 w-8 place-items-center rounded border border-white/90 transition hover:bg-white/10"
    >
      {children}
    </button>
  );
}

function Logo({ size }: { size: "small" | "large" }) {
  const imageClass = size === "large" ? "h-12 w-auto" : "h-12 w-auto";
  const titleClass =
    size === "large"
      ? "text-2xl font-black leading-[0.88]"
      : "text-2xl font-black leading-[0.88]";

  return (
    <Link href="/" className="flex items-center gap-3">
      <Image
        src="/images/kabupaten.png"
        alt="Logo Kabupaten Magelang"
        width={42}
        height={56}
        className={imageClass}
      />
      <div>
        <p className={`${titleClass} text-[#2e6230]`}>
          Mangli
          <br />
          Munggangsari
        </p>
        <p className="mt-1 text-xs font-black text-[#8aa100]">
          Katalog Potensi Desa
        </p>
      </div>
    </Link>
  );
}

type IconProps = {
  className?: string;
};

function DashboardIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={className}>
      <rect x="4" y="4" width="6" height="6" />
      <rect x="14" y="4" width="6" height="6" />
      <rect x="4" y="14" width="6" height="6" />
      <rect x="14" y="14" width="6" height="6" />
    </svg>
  );
}

function StoreIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={className}>
      <path d="M4 10h16l-1.2-5.5H5.2L4 10Z" />
      <path d="M6 10v9h12v-9" />
      <path d="M9 19v-5h6v5" />
      <path d="M4 10a2 2 0 0 0 4 0 2 2 0 0 0 4 0 2 2 0 0 0 4 0 2 2 0 0 0 4 0" />
    </svg>
  );
}

function UserIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
      <circle cx="12" cy="6" r="4" />
      <path d="M3 21a9 9 0 0 1 18 0" />
    </svg>
  );
}

function PlusIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" className={className}>
      <path d="M12 5v14" />
      <path d="M5 12h14" />
    </svg>
  );
}

function PlusCircleIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" className={className}>
      <circle cx="12" cy="12" r="9" />
      <path d="M12 8v8" />
      <path d="M8 12h8" />
    </svg>
  );
}

function LogOutIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={className}>
      <path d="M14 8V5a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h7a2 2 0 0 0 2-2v-3" />
      <path d="M9 12h12" />
      <path d="m17 8 4 4-4 4" />
    </svg>
  );
}

function EditIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" className={className}>
      <path d="m14 5 5 5" />
      <path d="M4 20h5L20 9a3.54 3.54 0 0 0-5-5L4 15v5Z" />
    </svg>
  );
}

function ChevronLeftIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" className={className}>
      <path d="m15 18-6-6 6-6" />
    </svg>
  );
}

function ChevronRightIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" className={className}>
      <path d="m9 18 6-6-6-6" />
    </svg>
  );
}

function InstagramIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={className}>
      <rect x="4" y="4" width="16" height="16" rx="4" />
      <circle cx="12" cy="12" r="3.5" />
      <path d="M17 7.2h.01" />
    </svg>
  );
}

function FacebookIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
      <path d="M14 8h2V5h-2.4C10.95 5 10 6.83 10 8.6V11H8v3h2v7h3v-7h2.45L16 11h-3V8.85c0-.58.22-.85 1-.85Z" />
    </svg>
  );
}

function YoutubeIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
      <path d="M21.6 7.2a3 3 0 0 0-2.1-2.1C17.65 4.6 12 4.6 12 4.6s-5.65 0-7.5.5a3 3 0 0 0-2.1 2.1A31 31 0 0 0 1.9 12a31 31 0 0 0 .5 4.8 3 3 0 0 0 2.1 2.1c1.85.5 7.5.5 7.5.5s5.65 0 7.5-.5a3 3 0 0 0 2.1-2.1 31 31 0 0 0 .5-4.8 31 31 0 0 0-.5-4.8ZM10 15.2V8.8l5.4 3.2L10 15.2Z" />
    </svg>
  );
}

function WhatsAppIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
      <path d="M12.04 2C6.56 2 2.1 6.41 2.1 11.84c0 1.73.46 3.41 1.33 4.89L2 22l5.4-1.4a10.1 10.1 0 0 0 4.64 1.15c5.48 0 9.94-4.41 9.94-9.84C21.98 6.41 17.52 2 12.04 2Zm0 18.05a8.4 8.4 0 0 1-4.27-1.17l-.31-.18-3.2.83.86-3.08-.2-.32a8.05 8.05 0 0 1-1.24-4.29c0-4.48 3.75-8.14 8.36-8.14 4.61 0 8.36 3.66 8.36 8.14 0 4.56-3.75 8.21-8.36 8.21Zm4.58-6.15c-.25-.12-1.48-.72-1.71-.8-.23-.08-.4-.12-.57.12-.17.25-.66.8-.81.97-.15.16-.3.18-.55.06-.25-.12-1.06-.38-2.02-1.21-.75-.65-1.25-1.45-1.4-1.7-.15-.24-.02-.37.11-.49.12-.11.25-.29.38-.43.13-.15.17-.25.25-.41.08-.16.04-.31-.02-.43-.06-.12-.57-1.35-.78-1.84-.2-.47-.41-.41-.57-.42h-.48c-.17 0-.43.06-.66.31-.23.25-.87.84-.87 2.04s.89 2.36 1.02 2.53c.13.16 1.76 2.65 4.27 3.72.6.25 1.06.4 1.43.52.6.19 1.14.16 1.57.1.48-.07 1.48-.59 1.69-1.16.21-.57.21-1.06.15-1.16-.06-.11-.23-.17-.48-.29Z" />
    </svg>
  );
}
