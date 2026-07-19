import type { ComponentType } from "react";
import Image from "next/image";
import Link from "next/link";
import { AnimatedHeader } from "@/components/animations/AnimatedHeader";
import type { VillageSlug } from "@/types/database";
import { ThemeToggle } from "@/app/theme-toggle";

type PublicVillage = "all" | VillageSlug;
type PublicCatalog = "umkm" | "warung";
type PublicHeaderMode = "landing" | "catalog" | "potensi";
type IconProps = { className?: string };

type PublicHeaderProps = {
  village: PublicVillage;
  catalog?: PublicCatalog;
  mode?: PublicHeaderMode;
};

export function PublicHeader({
  village,
  catalog,
  mode = "landing",
}: PublicHeaderProps) {
  const isAll = village === "all";
  const isMangli = village === "mangli";
  const isCatalogPage = mode === "catalog";
  const isPotensiPage = mode === "potensi";
  const route = isAll ? "/" : isMangli ? "/mangli" : "/munggangsari";
  const catalogKind = catalog ?? (isAll || isMangli ? "umkm" : "warung");
  const catalogHref = isAll ? "#umkm" : `${route}/${catalogKind}`;
  const catalogLabel = catalogKind === "warung" ? "Warung" : "UMKM";
  const isSubPage = isCatalogPage || isPotensiPage;
  const hasPotensiPage = !isAll;
  const homeHref = isSubPage ? route : "#beranda";
  const articleHref = isSubPage ? `${route}#artikel` : "#artikel";
  const potensiHref = hasPotensiPage ? `${route}/potensi` : "#potensi";

  return (
    <AnimatedHeader>
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-3 px-4 md:h-24 md:gap-6 md:px-10">
        <Logo compact />
        <nav className="ml-auto flex items-center gap-2 md:hidden">
          <MobileNavLink href={homeHref} label="Beranda" icon={HomeIcon} />
          <MobileNavLink href={catalogHref} label={catalogLabel} icon={StoreIcon} />
          {hasPotensiPage ? (
            <MobileNavLink href={potensiHref} label="Potensi" icon={CompassIcon} />
          ) : (
            <MobileNavLink href={articleHref} label="Artikel" icon={ArticleIcon} />
          )}
          <ThemeToggle />
        </nav>
        {isAll && !isCatalogPage ? (
          <nav className="hidden flex-1 items-center justify-center gap-6 md:flex">
            <Link
              href="/mangli"
              className="rounded-lg border border-[#2e6b35] px-7 py-2 text-sm font-black text-[#2e6b35] transition hover:bg-[#edf3eb] dark:border-[#8bc98c] dark:text-[#8bc98c] dark:hover:bg-white/10"
            >
              Mangli
            </Link>
            <Link
              href="/munggangsari"
              className="rounded-lg border border-[#2e6b35] px-7 py-2 text-sm font-black text-[#2e6b35] transition hover:bg-[#edf3eb] dark:border-[#8bc98c] dark:text-[#8bc98c] dark:hover:bg-white/10"
            >
              Munggangsari
            </Link>
          </nav>
        ) : (
          <nav className="hidden items-center gap-10 lg:flex">
            <Link
              href={homeHref}
              className={navLinkClass(!isCatalogPage && !isPotensiPage)}
            >
              Beranda
            </Link>
            <Link
              href={catalogHref}
              className={navLinkClass(isCatalogPage)}
            >
              {catalogLabel}
            </Link>
            {!hasPotensiPage && (
              <Link
                href={articleHref}
                className={navLinkClass(false)}
              >
                Artikel
              </Link>
            )}
            <Link
              href={potensiHref}
              className={navLinkClass(isPotensiPage)}
            >
              Potensi
            </Link>
          </nav>
        )}
        <div className="flex items-center gap-3">
          {!isAll && (
            <>
              <Link
                href="/mangli"
                className={`hidden rounded-lg px-6 py-2 text-sm font-black transition md:inline-flex ${
                  isMangli
                    ? "bg-[#2e6b35] text-white hover:bg-[#25572b] dark:bg-[#8bc98c] dark:text-[#10150f]"
                    : "border border-[#2e6b35] text-[#2e6b35] hover:bg-[#edf3eb] dark:border-[#8bc98c] dark:text-[#8bc98c] dark:hover:bg-white/10"
                }`}
              >
                Mangli
              </Link>
              <Link
                href="/munggangsari"
                className={`hidden rounded-lg px-6 py-2 text-sm font-black transition md:inline-flex ${
                  isMangli
                    ? "border border-[#2e6b35] text-[#2e6b35] hover:bg-[#edf3eb] dark:border-[#8bc98c] dark:text-[#8bc98c] dark:hover:bg-white/10"
                    : "bg-[#2e6b35] text-white hover:bg-[#25572b] dark:bg-[#8bc98c] dark:text-[#10150f]"
                }`}
              >
                Munggangsari
              </Link>
            </>
          )}
          <Link
            href="/admin/sign-in"
            className="hidden rounded-lg border border-[#ef8b00] px-4 py-2 text-sm font-black text-[#ef8b00] transition hover:bg-[#fff4e4] md:inline-flex md:px-5 dark:hover:bg-white/10"
          >
            Sign In
          </Link>
          <div className="hidden md:block">
            <ThemeToggle />
          </div>
        </div>
      </div>
    </AnimatedHeader>
  );
}

export function VillageSwitch({ village }: { village: PublicVillage }) {
  const activeVillage = village === "munggangsari" ? "munggangsari" : "mangli";

  return (
    <nav className="grid h-8 w-[236px] grid-cols-2 overflow-hidden rounded-full bg-white text-[0.52rem] font-black shadow-lg shadow-black/20">
      <Link
        href="/mangli"
        className={`grid place-items-center ${
          activeVillage === "mangli"
            ? "bg-[#2e6b35] text-white"
            : "text-[#2e6b35]"
        }`}
      >
        Mangli
      </Link>
      <Link
        href="/munggangsari"
        className={`grid place-items-center ${
          activeVillage === "munggangsari"
            ? "bg-[#2e6b35] text-white"
            : "text-[#2e6b35]"
        }`}
      >
        Munggangsari
      </Link>
    </nav>
  );
}

export function PublicFooter({ route }: { route?: string }) {
  const aboutHref = route ? `${route}#potensi` : "#potensi";
  const contactHref = route ? `${route}/umkm` : "#umkm";

  return (
    <footer className="bg-white pt-7 transition-colors md:pt-12 dark:bg-[#10150f]">
      <div className="mx-auto grid max-w-7xl divide-y divide-[#b8c0b5] px-6 pb-8 md:grid-cols-[1.4fr_0.65fr_0.7fr_1fr] md:gap-10 md:divide-y-0 md:px-10 md:pb-16">
        <div className="pb-7 md:pb-0">
          <Logo />
          <p className="mt-5 max-w-sm text-sm font-semibold leading-5 text-[#334135] md:mt-6 md:text-base md:leading-7 dark:text-[#d4decf]">
            Portal resmi katalog potensi Desa Mangli & Munggangsari.
            Menghubungkan tradisi dengan inovasi digital.
          </p>
          <div className="mt-5 flex gap-3 text-[#20b15a] md:mt-6 md:gap-4">
            <InstagramIcon className="social-motion h-6 w-6 md:h-5 md:w-5" />
            <FacebookIcon className="social-motion h-6 w-6 md:h-5 md:w-5" />
            <YoutubeIcon className="social-motion h-6 w-6 md:h-5 md:w-5" />
            <WhatsAppIcon className="social-motion h-6 w-6 md:h-5 md:w-5" />
          </div>
        </div>
        <div className="py-7 md:py-0">
          <h3 className="text-xl font-black text-[#2e6b35] dark:text-[#8bc98c]">Tautan Cepat</h3>
          <ul className="mt-4 space-y-3 text-sm font-bold text-[#2e6b35] md:mt-5 dark:text-[#a9d8aa]">
            <li>
              <Link href={aboutHref} className="footer-link">Tentang Kami</Link>
            </li>
            <li>
              <Link href={contactHref} className="footer-link">Kontak</Link>
            </li>
          </ul>
        </div>
        <div className="py-7 md:py-0">
          <h3 className="text-xl font-black text-[#2e6b35] dark:text-[#8bc98c]">Informasi</h3>
          <ul className="mt-4 space-y-3 text-sm font-bold text-[#2e6b35] md:mt-5 dark:text-[#a9d8aa]">
            <li>
              <a href="#" className="footer-link">Kebijakan Privasi</a>
            </li>
          </ul>
        </div>
        <div className="pt-7 md:pt-0">
          <h3 className="text-xl font-black text-[#2e6b35] dark:text-[#8bc98c]">Lokasi Kantor</h3>
          <div className="mt-4 space-y-5 text-sm font-semibold leading-5 text-[#9aa39a] md:mt-5 md:space-y-7 md:leading-6 dark:text-[#b2bdae]">
            <div>
              <p className="font-black text-[#2e6b35] dark:text-[#8bc98c]">Balai Desa Munggangsari</p>
              <p>
                H464+R3H, Kwayuhan, Munggangsari, Kec. Kaliangkrik, Kabupaten
                Magelang, Jawa Tengah 56153
              </p>
            </div>
            <div>
              <p className="font-black text-[#2e6b35] dark:text-[#8bc98c]">Balai Desa Mangli</p>
              <p>
                HQG3+666, Mangli, Kec. Kaliangkrik, Kabupaten Magelang, Jawa
                Tengah 56153
              </p>
            </div>
          </div>
        </div>
      </div>
      <div className="bg-[#23672d] py-3 text-center text-[0.58rem] font-bold text-white md:border-t md:border-[#edf0eb] md:bg-transparent md:py-6 md:text-xs md:text-[#2e6b35] md:dark:border-[#273425] md:dark:text-[#8bc98c]">
        Dikembangkan oleh Tim KKN-PPM UGM Kaliangkrik 2026
      </div>
    </footer>
  );
}

function navLinkClass(active: boolean) {
  return [
    "text-base font-black text-[#2e6b35] underline-offset-8 transition hover:underline dark:text-[#a9d8aa]",
    active ? "underline decoration-2" : "",
  ]
    .filter(Boolean)
    .join(" ");
}

function MobileNavLink({
  href,
  label,
  icon: Icon,
}: {
  href: string;
  label: string;
  icon: ComponentType<IconProps>;
}) {
  return (
    <Link
      href={href}
      className="flex min-w-[38px] flex-col items-center gap-1 text-[0.48rem] font-black leading-none text-[#2e6b35] dark:text-[#a9d8aa]"
    >
      <Icon className="h-5 w-5" />
      <span>{label}</span>
    </Link>
  );
}

function Logo({ compact = false }: { compact?: boolean } = {}) {
  return (
    <Link href="/" className="flex shrink-0 items-center gap-3">
      <Image
        src="/images/kabupaten.png"
        alt="Logo Kabupaten Magelang"
        width={42}
        height={56}
        className={compact ? "h-9 w-auto md:h-12" : "h-12 w-auto"}
      />
      <div className="leading-none">
        <p className={`${compact ? "text-xs md:text-sm" : "text-xl"} font-black text-[#2e6b35] dark:text-[#a9d8aa]`}>
          Mangli
          <br />
          Munggangsari
        </p>
        <p className={`${compact ? "text-[0.45rem] md:text-[10px]" : "text-[11px]"} mt-1 font-black text-[#ef8b00]`}>
          Katalog Potensi Desa
        </p>
      </div>
    </Link>
  );
}

function HomeIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={className}>
      <path d="m3 11 9-8 9 8" />
      <path d="M5 10v10h14V10" />
      <path d="M10 20v-6h4v6" />
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

function ArticleIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={className}>
      <path d="M5 4h14v16H5z" />
      <path d="M8 8h8" />
      <path d="M8 12h8" />
      <path d="M8 16h5" />
    </svg>
  );
}

function CompassIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={className}>
      <circle cx="12" cy="12" r="9" />
      <path d="m15.5 8.5-2.2 4.8-4.8 2.2 2.2-4.8 4.8-2.2Z" />
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
