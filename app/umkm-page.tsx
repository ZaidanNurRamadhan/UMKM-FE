import Image from "next/image";
import Link from "next/link";
import { AnimatedHeader } from "@/components/animations/AnimatedHeader";
import { FadeIn } from "@/components/animations/FadeIn";
import { StaggerContainer } from "@/components/animations/StaggerContainer";
import { StaggerItem } from "@/components/animations/StaggerItem";
import { getWhatsAppUrl } from "@/lib/utils/whatsapp";
import { getUmkm } from "@/services/umkm.service";
import { getVillageAssetUrl } from "@/services/storage.service";
import { getWarungs } from "@/services/warung.service";
import type { Umkm, VillageSlug, Warung } from "@/types/database";
import { ThemeToggle } from "./theme-toggle";

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
      <Header village={village} catalog={catalog} />

      <section className="relative overflow-hidden bg-[#eef8ec] py-24 dark:bg-[#151c14]">
        <Image
          src={heroImage}
          alt={`Latar UMKM Desa ${villageName}`}
          fill
          priority
          className="object-cover opacity-45 dark:opacity-28"
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-white via-white/86 to-white/12 dark:from-[#151c14] dark:via-[#151c14]/88 dark:to-[#151c14]/30" />
        <div className="relative mx-auto max-w-7xl px-6 md:px-10">
          <FadeIn className="max-w-4xl">
            <h1 className="text-4xl font-black leading-tight sm:text-5xl md:text-6xl">
              Katalog {copy.title} Desa {villageName}
            </h1>
            <p className="mt-9 max-w-3xl text-lg font-semibold leading-9 text-[#39433a] dark:text-[#d7e0d3]">
              {copy.heroDescription} Desa {villageName}.
              <br />
              Mari dukung ekonomi desa melalui karya nyata warga kami.
            </p>
          </FadeIn>
        </div>
      </section>

      <section className="py-20">
        <div className="mx-auto max-w-7xl px-6 md:px-10">
          <FadeIn>
            <p className="text-lg font-black text-[#2e6b35] dark:text-[#8bc98c]">
              {copy.eyebrow}
            </p>
            <h2 className="mt-5 text-4xl font-black md:text-5xl">
              {copy.heading}
            </h2>
          </FadeIn>

          {catalogResult.error ? (
            <DataMessage message={catalogResult.error} />
          ) : catalogResult.items.length === 0 ? (
            <DataMessage message={copy.empty} />
          ) : (
            <StaggerContainer className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-5">
              {catalogResult.items.map((product) => (
                <StaggerItem key={product.id}>
                  <article className="product-card-motion group overflow-hidden rounded-[22px] border border-[#d5ddd1] bg-white shadow-sm transition duration-300 hover:border-[#8fb98d] hover:shadow-xl hover:shadow-[#2e6b35]/12 dark:border-[#344233] dark:bg-[#172017] dark:hover:border-[#8bc98c]/70">
                    <div className="relative aspect-[1.18] overflow-hidden">
                      <Image
                        src={product.image}
                        alt={product.title}
                        fill
                        className="object-cover transition duration-500 group-hover:scale-[1.08]"
                        sizes="(min-width: 1024px) 20vw, (min-width: 640px) 50vw, 100vw"
                      />
                    </div>
                    <div className="flex min-h-[220px] flex-col p-5">
                      <span className="w-fit rounded-md border border-[#dce4d8] px-3 py-1 text-sm font-bold text-[#8a9286] dark:border-[#40503e] dark:text-[#b6c3b1]">
                        {product.category}
                      </span>
                      <h3 className="mt-4 min-h-12 text-xl font-black leading-6">
                        {product.title}
                      </h3>
                      <p className="mt-2 line-clamp-2 text-base font-semibold leading-7 text-[#8a9286] dark:text-[#b6c3b1]">
                        {product.description}
                      </p>
                      <div className="mt-auto flex items-center justify-between pt-8">
                        <p className="flex items-center gap-2 text-sm font-black text-[#8a9286] dark:text-[#b6c3b1]">
                          <PinIcon className="h-5 w-5 text-[#273226] dark:text-[#e6efe3]" />
                          Desa {product.villageName}
                        </p>
                        {product.whatsappUrl && (
                          <a
                            href={product.whatsappUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            aria-label={`Hubungi penjual ${product.title}`}
                            className="focus-ring grid h-10 w-10 place-items-center rounded-full text-[#00bf3a] transition duration-300 hover:scale-110 hover:bg-[#e8f8ec] dark:hover:bg-white/10"
                          >
                            <WhatsAppIcon className="h-9 w-9" />
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
        <Footer route={route} />
      </FadeIn>
    </main>
  );
}

function Header({ village, catalog = "umkm" }: UmkmPageProps) {
  const isMangli = village === "mangli";
  const isWarung = catalog === "warung";
  const route = isMangli ? "/mangli" : "/munggangsari";
  const catalogHref = isWarung ? `${route}/warung` : `${route}/umkm`;
  const catalogLabel = isWarung ? "Warung" : "UMKM";

  return (
    <AnimatedHeader>
      <div className="mx-auto flex h-24 max-w-7xl items-center justify-between gap-6 px-6 md:px-10">
        <Logo />
        <nav className="hidden items-center gap-12 lg:flex">
          <Link
            href={route}
            className="text-xl font-black text-[#2e6b35] underline-offset-8 transition hover:underline dark:text-[#a9d8aa]"
          >
            Beranda
          </Link>
          <Link
            href={catalogHref}
            className="text-xl font-black text-[#2e6b35] underline decoration-2 underline-offset-8 dark:text-[#a9d8aa]"
          >
            {catalogLabel}
          </Link>
          <Link
            href={`${route}#potensi`}
            className="text-xl font-black text-[#2e6b35] underline-offset-8 transition hover:underline dark:text-[#a9d8aa]"
          >
            Potensi
          </Link>
        </nav>
        <div className="flex items-center gap-4">
          <Link
            href="/mangli"
            className={`hidden rounded-lg px-7 py-3 text-sm font-black transition md:inline-flex ${
              isMangli
                ? "bg-[#2e6b35] text-white hover:bg-[#25572b] dark:bg-[#8bc98c] dark:text-[#10150f]"
                : "border border-[#2e6b35] text-[#141d13] hover:bg-[#edf3eb] dark:border-[#8bc98c] dark:text-[#f5f7f2] dark:hover:bg-white/10"
            }`}
          >
            Mangli
          </Link>
          <Link
            href="/munggangsari"
            className={`hidden rounded-lg px-7 py-3 text-sm font-black transition md:inline-flex ${
              isMangli
                ? "border border-[#2e6b35] text-[#141d13] hover:bg-[#edf3eb] dark:border-[#8bc98c] dark:text-[#f5f7f2] dark:hover:bg-white/10"
                : "bg-[#2e6b35] text-white hover:bg-[#25572b] dark:bg-[#8bc98c] dark:text-[#10150f]"
            }`}
          >
            Munggangsari
          </Link>
          <Link
            href="/admin/sign-in"
            className="inline-flex rounded-lg border border-[#ef8b00] px-4 py-3 text-sm font-black text-[#ef8b00] transition hover:bg-[#fff4e4] dark:hover:bg-white/10 md:px-6"
          >
            Sign In
          </Link>
          <ThemeToggle />
        </div>
      </div>
    </AnimatedHeader>
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

function Footer({ route }: { route: string }) {
  return (
    <footer className="border-t border-[#c8d0c4] bg-white pt-12 transition-colors dark:border-[#344233] dark:bg-[#10150f]">
      <div className="mx-auto grid max-w-7xl gap-10 px-6 pb-16 md:grid-cols-[1.4fr_0.65fr_0.7fr_1fr] md:px-10">
        <div>
          <Logo />
          <p className="mt-6 max-w-sm text-base font-semibold leading-7 text-[#334135] dark:text-[#d4decf]">
            Portal resmi katalog potensi Desa Mangli & Munggangsari.
            Menghubungkan tradisi dengan inovasi digital.
          </p>
          <div className="mt-6 flex gap-4 text-[#20b15a]">
            <InstagramIcon className="social-motion h-5 w-5" />
            <FacebookIcon className="social-motion h-5 w-5" />
            <YoutubeIcon className="social-motion h-5 w-5" />
            <WhatsAppIcon className="social-motion h-5 w-5" />
          </div>
        </div>
        <div>
          <h3 className="text-2xl font-black text-[#2e6b35] dark:text-[#8bc98c]">
            Tautan Cepat
          </h3>
          <ul className="mt-5 space-y-4 text-base font-bold text-[#2e6b35] dark:text-[#a9d8aa]">
            <li>
              <Link href={`${route}#potensi`} className="footer-link">Tentang Kami</Link>
            </li>
            <li>
              <Link href={`${route}/umkm`} className="footer-link">Kontak</Link>
            </li>
          </ul>
        </div>
        <div>
          <h3 className="text-2xl font-black text-[#2e6b35] dark:text-[#8bc98c]">
            Informasi
          </h3>
          <ul className="mt-5 space-y-4 text-base font-bold text-[#2e6b35] dark:text-[#a9d8aa]">
            <li>
              <a href="#" className="footer-link">Kebijakan Privasi</a>
            </li>
          </ul>
        </div>
        <div>
          <h3 className="text-2xl font-black text-[#2e6b35] dark:text-[#8bc98c]">
            Lokasi Kantor
          </h3>
          <div className="mt-5 space-y-7 text-base font-semibold leading-7 text-[#a0a89d] dark:text-[#b2bdae]">
            <div>
              <p className="font-black text-[#2e6b35] dark:text-[#8bc98c]">
                Balai Desa Munggangsari
              </p>
              <p>
                H464+R3H, Kwayuhan, Munggangsari, Kec. Kaliangkrik, Kabupaten
                Magelang, Jawa Tengah 56153
              </p>
            </div>
            <div>
              <p className="font-black text-[#2e6b35] dark:text-[#8bc98c]">
                Balai Desa Mangli
              </p>
              <p>
                HQG3+666, Mangli, Kec. Kaliangkrik, Kabupaten Magelang, Jawa
                Tengah 56153
              </p>
            </div>
          </div>
        </div>
      </div>
      <div className="py-6 text-center text-xs font-bold text-[#2e6b35] dark:text-[#8bc98c]">
        Dikembangkan oleh Tim KKN-PPM UGM Kaliangkrik 2026
      </div>
    </footer>
  );
}

function Logo() {
  return (
    <Link href="/" className="flex shrink-0 items-center gap-3">
      <Image
        src="/images/kabupaten.png"
        alt="Logo Kabupaten Magelang"
        width={42}
        height={56}
        className="h-14 w-auto"
      />
      <div className="leading-none">
        <p className="text-2xl font-black text-[#2e6b35] dark:text-[#a9d8aa]">
          Mangli
          <br />
          Munggangsari
        </p>
        <p className="mt-1 text-[13px] font-black text-[#ef8b00]">
          Katalog Potensi Desa
        </p>
      </div>
    </Link>
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
