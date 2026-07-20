import Image from "next/image";
import { FadeIn } from "@/components/animations/FadeIn";
import { StaggerContainer } from "@/components/animations/StaggerContainer";
import { StaggerItem } from "@/components/animations/StaggerItem";
import {
  PublicFooter,
  PublicHeader,
  VillageSwitch,
} from "@/components/layout/public-site-shell";
import { getWhatsAppUrl } from "@/lib/utils/whatsapp";
import { getUmkm } from "@/services/umkm.service";
import { getVillageAssetUrl } from "@/services/storage.service";
import { getWarungs } from "@/services/warung.service";
import type { Umkm, VillageSlug, Warung } from "@/types/database";

type CatalogKind = "umkm" | "warung";

type UmkmPageProps = {
  village: VillageSlug;
  catalog?: CatalogKind;
};

type IconProps = {
  className?: string;
};

type CatalogItem = {
  id: string;
  title: string;
  category: string;
  description: string;
  image: string;
  villageName: string;
  whatsappUrl: string | null;
};

type CatalogResult = {
  items: CatalogItem[];
  error: string | null;
};

const catalogCopy: Record<
  CatalogKind,
  {
    title: string;
    eyebrow: string;
    heading: string;
    category: string;
    heroDescription: string;
    empty: string;
  }
> = {
  umkm: {
    title: "UMKM",
    eyebrow: "Produk UMKM Unggulan",
    heading: "Produk Lokal Pilihan",
    category: "Produk Desa",
    heroDescription:
      "Temukan produk unggulan dan layanan terbaik dari pengusaha lokal",
    empty: "Belum ada data UMKM yang tersedia untuk desa ini.",
  },
  warung: {
    title: "Warung",
    eyebrow: "Warung Kuliner Unggulan",
    heading: "Warung Lokal Pilihan",
    category: "Warung Kuliner",
    heroDescription:
      "Temukan warung kuliner dan layanan terbaik dari warga lokal",
    empty: "Belum ada data warung yang tersedia untuk desa ini.",
  },
};

export default async function UmkmPage({
  village,
  catalog = "umkm",
}: UmkmPageProps) {
  const isMangli = village === "mangli";
  const villageName = isMangli ? "Mangli" : "Munggangsari";
  const route = isMangli ? "/mangli" : "/munggangsari";
  const heroImage = isMangli ? "/images/mangli.jpg" : "/images/culinary.jpg";
  const copy = catalogCopy[catalog];
  const catalogResult = await loadCatalogItems(village, catalog);

  return (
    <main className="min-h-screen overflow-x-hidden bg-white text-[#101510] transition-colors dark:bg-[#10150f] dark:text-[#f5f7f2]">
      <PublicHeader village={village} catalog={catalog} mode="catalog" />

      <section className="relative overflow-hidden bg-[#eef8ec] py-16 md:py-24 dark:bg-[#151c14]">
        <Image
          src={heroImage}
          alt={`Latar UMKM Desa ${villageName}`}
          fill
          priority
          className="object-cover opacity-45 dark:opacity-28"
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-white/88 via-white/80 to-white/62 md:bg-gradient-to-r md:from-white md:via-white/86 md:to-white/12 dark:from-[#151c14] dark:via-[#151c14]/88 dark:to-[#151c14]/30" />
        <div className="absolute left-0 right-0 top-3 z-10 flex justify-center px-6 md:hidden">
          <VillageSwitch village={village} />
        </div>
        <div className="relative px-6 pt-10 md:px-[40px] md:pt-0">
          <FadeIn className="max-w-[330px] md:max-w-4xl">
            <h1 className="text-[2.05rem] font-black leading-[0.98] md:text-6xl md:leading-tight">
              Katalog {copy.title} Desa {villageName}
            </h1>
            <p className="mt-4 max-w-[310px] text-[0.72rem] font-semibold leading-5 text-[#39433a] md:mt-9 md:max-w-3xl md:text-lg md:leading-9 dark:text-[#d7e0d3]">
              {copy.heroDescription} Desa {villageName}.
              <br />
              Mari dukung ekonomi desa melalui karya nyata warga kami.
            </p>
          </FadeIn>
        </div>
      </section>

      <section className="py-14 md:py-20">
        <div className="px-5 md:px-[40px]">
          <FadeIn>
            <p className="text-[0.55rem] font-black text-[#2e6b35] md:text-lg dark:text-[#8bc98c]">
              {copy.eyebrow}
            </p>
            <h2 className="mt-2 text-[1.45rem] font-black leading-tight md:mt-5 md:text-5xl">
              {copy.heading}
            </h2>
          </FadeIn>

          {catalogResult.error ? (
            <DataMessage message={catalogResult.error} />
          ) : catalogResult.items.length === 0 ? (
            <DataMessage message={copy.empty} />
          ) : (
            <StaggerContainer className="mt-4 grid grid-cols-3 gap-3 md:mt-8 md:grid-cols-2 md:gap-6 lg:grid-cols-5">
              {catalogResult.items.map((product) => (
                <StaggerItem key={product.id}>
                  <article className="product-card-motion group overflow-hidden rounded-lg border border-[#d5ddd1] bg-white shadow-sm transition duration-300 hover:border-[#8fb98d] hover:shadow-xl hover:shadow-[#2e6b35]/12 md:rounded-[22px] dark:border-[#344233] dark:bg-[#172017] dark:hover:border-[#8bc98c]/70">
                    <div className="relative aspect-[1.05] overflow-hidden md:aspect-[1.18]">
                      <Image
                        src={product.image}
                        alt={product.title}
                        fill
                        className="object-cover transition duration-500 group-hover:scale-[1.08]"
                        sizes="(min-width: 1024px) 20vw, (min-width: 640px) 50vw, 100vw"
                      />
                    </div>
                    <div className="flex min-h-[118px] flex-col p-2 md:min-h-[220px] md:p-5">
                      <span className="w-fit rounded border border-[#dce4d8] px-1.5 py-0.5 text-[0.42rem] font-bold text-[#8a9286] md:rounded-md md:px-3 md:py-1 md:text-sm dark:border-[#40503e] dark:text-[#b6c3b1]">
                        {product.category}
                      </span>
                      <h3 className="mt-2 min-h-8 text-[0.62rem] font-black leading-3 md:mt-4 md:min-h-12 md:text-xl md:leading-6">
                        {product.title}
                      </h3>
                      <p className="mt-2 hidden line-clamp-2 text-base font-semibold leading-7 text-[#8a9286] md:block dark:text-[#b6c3b1]">
                        {product.description}
                      </p>
                      <div className="mt-auto flex items-center justify-between pt-4 md:pt-8">
                        <p className="flex min-w-0 items-center gap-1 truncate text-[0.5rem] font-black text-[#8a9286] md:gap-2 md:text-sm dark:text-[#b6c3b1]">
                          <PinIcon className="h-3 w-3 shrink-0 text-[#273226] md:h-5 md:w-5 dark:text-[#e6efe3]" />
                          Desa {product.villageName}
                        </p>
                        {product.whatsappUrl && (
                          <a
                            href={product.whatsappUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            aria-label={`Hubungi penjual ${product.title}`}
                            className="focus-ring grid h-5 w-5 shrink-0 place-items-center rounded-full text-[#00bf3a] transition duration-300 hover:scale-110 hover:bg-[#e8f8ec] md:h-10 md:w-10 dark:hover:bg-white/10"
                          >
                            <WhatsAppIcon className="h-4 w-4 md:h-9 md:w-9" />
                          </a>
                        )}
                      </div>
                    </div>
                  </article>
                </StaggerItem>
              ))}
            </StaggerContainer>
          )}
        </div>
      </section>

      <FadeIn>
        <PublicFooter route={route} />
      </FadeIn>
    </main>
  );
}

async function loadCatalogItems(
  village: VillageSlug,
  catalog: CatalogKind,
): Promise<CatalogResult> {
  try {
    if (catalog === "warung") {
      const warungs = await getWarungs({ villageSlug: village });

      return {
        items: warungs.map(mapWarungToCatalogItem),
        error: null,
      };
    }

    const umkm = await getUmkm({ villageSlug: village });

    return {
      items: umkm.map(mapUmkmToCatalogItem),
      error: null,
    };
  } catch (error) {
    return {
      items: [],
      error:
        error instanceof Error
          ? error.message
          : "Data belum dapat dimuat saat ini.",
    };
  }
}

function mapUmkmToCatalogItem(umkm: Umkm): CatalogItem {
  return {
    id: umkm.id,
    title: umkm.name,
    category: catalogCopy.umkm.category,
    description: umkm.description,
    image: getVillageAssetUrl(umkm.photo_path) ?? "/images/chips.jpg",
    villageName: umkm.villages?.name ?? "Mangli",
    whatsappUrl: getWhatsAppUrl(umkm.whatsapp_number, umkm.name),
  };
}

function mapWarungToCatalogItem(warung: Warung): CatalogItem {
  return {
    id: warung.id,
    title: warung.name,
    category: catalogCopy.warung.category,
    description: getWarungDescription(warung),
    image: getVillageAssetUrl(warung.photo_path) ?? "/images/culinary.jpg",
    villageName: warung.villages?.name ?? "Munggangsari",
    whatsappUrl: getWhatsAppUrl(warung.whatsapp_number, warung.name),
  };
}

function getWarungDescription(warung: Warung): string {
  const details = [
    warung.owner_name ? `Pemilik: ${warung.owner_name}` : null,
    warung.address,
  ].filter((detail): detail is string => Boolean(detail));

  return details.join(" - ") || "Warung lokal desa dengan hidangan pilihan.";
}

function DataMessage({ message }: { message: string }) {
  return (
    <div className="mt-8 rounded-lg border border-[#d5ddd1] bg-[#f7f8f4] px-6 py-8 text-center text-base font-bold leading-7 text-[#536052] dark:border-[#344233] dark:bg-[#172017] dark:text-[#d4decf]">
      {message}
    </div>
  );
}

function PinIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
      <path d="M12 2a7 7 0 0 0-7 7c0 5.25 7 13 7 13s7-7.75 7-13a7 7 0 0 0-7-7Zm0 10.2A3.2 3.2 0 1 1 12 5.8a3.2 3.2 0 0 1 0 6.4Z" />
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
