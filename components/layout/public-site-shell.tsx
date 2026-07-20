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
  const homeHref = "/";
  const articleHref = isSubPage ? `${route}#artikel` : "#artikel";
  const potensiHref = hasPotensiPage ? `${route}/potensi` : "#potensi";
  const showMobileMenuLinks = !isAll || isSubPage;

  return (
    <AnimatedHeader>
      <div className="flex h-16 items-center justify-between gap-3 px-4 md:px-[40px] lg:h-24 lg:gap-6">
        <div className="relative shrink-0">
          <Logo compact />
          <ThemeToggle variant="pull-cord" />
        </div>
        <nav className="ml-auto flex items-center gap-2 md:hidden">
          {showMobileMenuLinks && (
            <>
              <MobileNavLink href={homeHref} label="Beranda"/>
              <MobileNavLink href={catalogHref} label={catalogLabel}/>
              {hasPotensiPage ? (
                <MobileNavLink href={potensiHref} label="Potensi"/>
              ) : (
                <MobileNavLink href={articleHref} label="Artikel"/>
              )}
            </>
          )}
          <Link
            href="/admin/sign-in"
            className="inline-flex h-8 shrink-0 items-center justify-center rounded-lg border border-[#ef8b00] px-2.5 text-[0.58rem] font-black leading-none text-[#ef8b00] transition hover:bg-[#fff4e4] dark:hover:bg-white/10"
          >
            Login
          </Link>
        </nav>
        {isAll && !isCatalogPage ? (
          <nav className="hidden flex-1 items-center justify-center gap-3 md:flex lg:gap-6">
            <Link
              href="/mangli"
              className="inline-flex h-9 items-center rounded-lg border border-[#2e6b35] px-4 text-[0.7rem] font-black text-[#2e6b35] transition hover:bg-[#edf3eb] lg:px-7 lg:text-sm dark:border-[#8bc98c] dark:text-[#8bc98c] dark:hover:bg-white/10"
            >
              Mangli
            </Link>
            <Link
              href="/munggangsari"
              className="inline-flex h-9 items-center rounded-lg border border-[#2e6b35] px-4 text-[0.7rem] font-black text-[#2e6b35] transition hover:bg-[#edf3eb] lg:px-7 lg:text-sm dark:border-[#8bc98c] dark:text-[#8bc98c] dark:hover:bg-white/10"
            >
              Munggangsari
            </Link>
          </nav>
        ) : (
          <nav className="hidden items-center gap-4 md:flex lg:gap-10">
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
        <div className="flex shrink-0 items-center gap-3">
          {!isAll && (
            <>
              <Link
                href="/mangli"
                className={`hidden h-9 items-center rounded-lg px-3 text-[0.7rem] font-black transition md:inline-flex lg:px-6 lg:text-sm ${
                  isMangli
                    ? "bg-[#2e6b35] text-white hover:bg-[#25572b] dark:bg-[#8bc98c] dark:text-[#10150f]"
                    : "border border-[#2e6b35] text-[#2e6b35] hover:bg-[#edf3eb] dark:border-[#8bc98c] dark:text-[#8bc98c] dark:hover:bg-white/10"
                }`}
              >
                Mangli
              </Link>
              <Link
                href="/munggangsari"
                className={`hidden h-9 items-center rounded-lg px-3 text-[0.7rem] font-black transition md:inline-flex lg:px-6 lg:text-sm ${
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
            className="hidden h-9 items-center rounded-lg border border-[#ef8b00] px-3 text-[0.1rem] font-black text-[#ef8b00] transition hover:bg-[#fff4e4] md:inline-flex lg:px-5 lg:text-sm dark:hover:bg-white/10"
          >
            Login
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
  const activeVillage = village === "all" ? null : village;

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
      <div className="grid divide-y divide-[#b8c0b5] px-4 pb-8 md:grid-cols-[1.4fr_0.65fr_0.7fr_1fr] md:gap-10 md:divide-y-0 md:px-[40px] md:pb-16">
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
    "inline-flex h-9 items-center text-[0.7rem] font-black text-[#2e6b35] underline-offset-8 transition hover:underline lg:text-base dark:text-[#a9d8aa]",
    active ? "underline decoration-2" : "",
  ]
    .filter(Boolean)
    .join(" ");
}

function MobileNavLink({
  href,
  label
}: {
  href: string;
  label: string;
}) {
  return (
    <Link
      href={href}
      className="flex min-w-[38px] flex-col items-center gap-1 text-[0.48rem] font-black leading-none text-[#2e6b35] dark:text-[#a9d8aa]"
    >
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
        width={38}
        height={48}
        className={compact ? "h-10 w-[34px] lg:h-12 lg:w-auto" : "h-12 w-auto"}
      />
      <div className="leading-none">
        <p className={`${compact ? "text-[0.7rem] lg:text-sm" : "text-xl"} font-black text-[#2e6b35] dark:text-[#a9d8aa]`}>
          Mangli
          <br />
          Munggangsari
        </p>
        <p className={`${compact ? "text-[0.42rem] lg:text-[10px]" : "text-[11px]"} mt-1 font-black text-[#ef8b00]`}>
          Katalog Potensi Desa
        </p>
      </div>
    </Link>
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
