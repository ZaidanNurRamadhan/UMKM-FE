import Image from "next/image";
import Link from "next/link";
import { CatalogAdminForm, type CatalogFormMode, type CatalogKind } from "./catalog-admin-form";
import type { Article, Umkm, VillageSlug, Warung } from "@/types/database";

type UmkmFormPageProps = {
  village: VillageSlug;
  kind?: CatalogKind;
  mode?: CatalogFormMode;
  initialData?: Umkm | Warung | Article | null;
};

const adminName = {
  mangli: "Admin Mangli",
  munggangsari: "Admin Munggangsari",
} satisfies Record<VillageSlug, string>;

const catalogCopy = {
  umkm: {
    manageLabel: "Kelola UMKM",
    addLabel: "Tambah UMKM",
    titleCreate: "Tambah UMKM",
    titleEdit: "Edit UMKM",
    description:
      "Lengkapi informasi UMKM Anda dengan data yang akurat dan menarik.",
    segment: "umkm",
  },
  warung: {
    manageLabel: "Kelola Warung",
    addLabel: "Tambah Warung",
    titleCreate: "Tambah Warung",
    titleEdit: "Edit Warung",
    description: "Manajemen basis data warung dan kuliner lokal desa.",
    segment: "warung",
  },
  article: {
    manageLabel: "Kelola Artikel",
    addLabel: "Tambah Artikel",
    titleCreate: "Tambah Artikel",
    titleEdit: "Edit Artikel",
    description: "Manajemen artikel potensi dan cerita inspiratif desa.",
    segment: "artikel",
  },
} satisfies Record<
  CatalogKind,
  {
    manageLabel: string;
    addLabel: string;
    titleCreate: string;
    titleEdit: string;
    description: string;
    segment: string;
  }
>;

export default function UmkmFormPage({
  village,
  kind = "umkm",
  mode = "create",
  initialData = null,
}: UmkmFormPageProps) {
  const copy = catalogCopy[kind];
  const listHref = `/admin/${village}/${copy.segment}`;
  const addHref = `/admin/${village}/${copy.segment}/tambah`;
  const pageTitle = mode === "edit" ? copy.titleEdit : copy.titleCreate;

  return (
    <main className="min-h-screen bg-[#f7faf4] text-[#1f2937]">
      <div className="lg:grid lg:min-h-screen lg:grid-cols-[340px_minmax(0,1fr)]">
        <aside className="flex border-b border-[#e3e8e1] bg-white px-6 py-6 shadow-[10px_0_30px_rgb(15_23_42/0.03)] lg:sticky lg:top-0 lg:min-h-screen lg:flex-col lg:border-b-0 lg:border-r">
          <div className="flex w-full items-center justify-between gap-6 lg:block">
            <div>
              <Logo size="large" />
            </div>
            <Link
              href="/admin/sign-in"
              className="inline-flex items-center gap-2 rounded-lg border border-[#d7dfd7] px-4 py-3 text-sm font-black text-[#116b27] transition hover:bg-[#f3f8ef] lg:hidden"
            >
              <LogOutIcon className="h-5 w-5" />
              Keluar
            </Link>
          </div>

          <nav className="mt-12 hidden space-y-4 lg:block lg:pt-24">
            <Link
              href={`/admin/${village}`}
              className="flex h-12 items-center gap-4 rounded-lg px-7 text-base font-extrabold text-[#293445] transition hover:bg-[#f3f8ef] hover:text-[#116b27]"
            >
              <DashboardIcon className="h-5 w-5" />
              Dashboard
            </Link>
            <Link
              href={`/admin/${village}/umkm`}
              className={`relative flex h-12 items-center gap-4 rounded-lg px-7 text-base font-extrabold transition ${
                kind === "umkm"
                  ? "bg-[#eef8e9] text-[#116b27] shadow-[0_12px_28px_rgb(17_107_39/0.08)] before:absolute before:left-0 before:top-1.5 before:h-9 before:w-1 before:rounded-full before:bg-[#118331]"
                  : "text-[#293445] hover:bg-[#f3f8ef] hover:text-[#116b27]"
              }`}
            >
              <StoreIcon className="h-5 w-5" />
              Kelola UMKM
            </Link>
            {kind !== "umkm" && (
              <Link
                href={listHref}
                className="relative flex h-12 items-center gap-4 rounded-lg bg-[#eef8e9] px-7 text-base font-extrabold text-[#116b27] shadow-[0_12px_28px_rgb(17_107_39/0.08)] before:absolute before:left-0 before:top-1.5 before:h-9 before:w-1 before:rounded-full before:bg-[#118331]"
              >
                <StoreIcon className="h-5 w-5" />
                {copy.manageLabel}
              </Link>
            )}
          </nav>

          <div className="mt-auto hidden space-y-5 pb-7 lg:block">
            <Link
              href="/admin/sign-in"
              className="flex h-12 w-[280px] items-center justify-center gap-4 rounded-lg bg-[#fff0f0] text-base font-black text-[#ef1b1b] transition hover:bg-[#ffe2e2]"
            >
              <LogOutIcon className="h-6 w-6" />
              Log Out
            </Link>
            {/* <div className="flex items-end justify-between border-t border-[#e3e8e1] pt-7 text-xs font-medium leading-6 text-[#6a7280]">
              <p>
                &copy; 2024 Katalog Potensi Desa
                <br />
                Mangli Munggangsari
              </p>
              <span className="grid h-9 w-9 place-items-center rounded-full border border-[#dce4dd] bg-white text-[#394253] shadow-[0_8px_22px_rgb(15_23_42/0.08)]">
                <ChevronDoubleLeftIcon className="h-4 w-4" />
              </span>
            </div> */}
          </div>
        </aside>

        <div className="min-w-0">
          <header className="flex min-h-[114px] items-center justify-between border-b border-[#dfe6df] bg-white px-6 py-6 shadow-[0_4px_18px_rgb(15_23_42/0.04)] md:px-10">
            <div>
              <h1 className="text-2xl font-black text-[#0f6b24]">
                Dashboard Overview
              </h1>
              <p className="mt-1 text-sm font-medium text-[#6a7280]">
                Katalog Potensi Desa
              </p>
            </div>
            <div className="flex items-center gap-5 text-[#0f6b24]">
              <p className="hidden text-base font-black sm:block">
                {adminName[village]}
              </p>
              <span className="grid h-11 w-11 place-items-center rounded-full bg-[#d8edcf]">
                <UserIcon className="h-7 w-7 text-[#118331]" />
              </span>
            </div>
          </header>

          <section className="relative min-h-[calc(100vh-114px)] overflow-hidden px-5 pb-12 pt-8 md:px-10 lg:px-11">
            <div className="pointer-events-none absolute inset-x-0 top-0 h-[238px] overflow-hidden bg-[linear-gradient(180deg,#fbfdf9_0%,#f5faf2_100%)]">
              <AdminLandscape />
            </div>

            <div className="relative z-10 mx-auto max-w-[1500px]">
              <div className="flex min-h-[138px] items-center gap-6">
                <div className="grid h-[86px] w-[86px] shrink-0 place-items-center rounded-xl bg-[#e8f5df] text-[#0f7a2b] shadow-[0_16px_36px_rgb(15_122_43/0.08)]">
                  <StoreIcon className="h-10 w-10" />
                </div>
                <div>
                  <h2 className="text-3xl font-black leading-tight text-[#202a37] md:text-4xl">
                    {pageTitle}
                  </h2>
                  <p className="mt-2 text-base font-medium text-[#687286]">
                    {copy.description}
                  </p>
                </div>
              </div>

              <CatalogAdminForm
                kind={kind}
                mode={mode}
                village={village}
                initialData={initialData}
              />
            </div>
          </section>

          {/* <AdminFooter /> */}
        </div>
      </div>
    </main>
  );
}

function AdminLandscape() {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 980 238"
      fill="none"
      className="absolute bottom-0 right-0 h-full w-[74%] min-w-[720px]"
      preserveAspectRatio="none"
    >
      <path
        d="M0 232C92 222 119 166 194 166C239 166 270 190 318 176C373 160 405 105 471 105C541 105 577 176 646 183C720 190 741 131 805 142C864 152 879 209 980 190V238H0V232Z"
        fill="#dcebd3"
      />
      <path
        d="M184 238C267 220 303 141 386 142C453 143 472 198 542 202C629 207 666 152 740 168C804 182 834 222 980 214V238H184Z"
        fill="#c9e0bc"
      />
      <path d="M770 151h73l-12-28h-49l-12 28Z" fill="#74b858" />
      <path d="M781 151h50v53h-50V151Z" fill="#8cca71" />
      <path d="M790 166h13v18h-13V166Z" fill="#eaf5dd" />
      <path d="M812 166h13v38h-13V166Z" fill="#eaf5dd" />
      <path d="M770 151c3 12 18 12 21 0c3 12 18 12 21 0c3 12 18 12 21 0c3 12 18 12 21 0" fill="#69ae4f" />
      <path d="M902 89c14 36 25 83 0 93c-25-10-14-57 0-93Z" fill="#91c57f" />
      <path d="M902 142v61" stroke="#6da85d" strokeWidth="5" strokeLinecap="round" />
      <path d="M846 116c12 31 21 72 0 80c-21-8-12-49 0-80Z" fill="#9ccc8b" />
      <path d="M846 160v44" stroke="#6da85d" strokeWidth="4" strokeLinecap="round" />
      <path d="M626 96c5-16 29-16 34 0c13-4 26 5 27 18h-89c2-13 15-22 28-18Z" fill="#d8e9cf" />
      <path d="M902 95c7-23 41-23 48 0c18-6 36 7 38 25H862c3-19 22-31 40-25Z" fill="#d8e9cf" />
      <path d="M737 93c6-14 27-14 33 0c10-2 20 5 22 16h-76c1-11 11-18 21-16Z" fill="#d8e9cf" />
    </svg>
  );
}

function AdminFooter() {
  return (
    <footer className="border-t border-[#f0f0f0] bg-white px-6 py-12 md:px-10">
      <div className="mx-auto grid max-w-6xl gap-10 md:grid-cols-[1.2fr_0.5fr_0.55fr_1fr]">
        <div>
          <Logo size="small" />
          <p className="mt-5 max-w-sm text-base font-medium leading-7">
            Portal resmi katalog potensi Desa Mangli & Munggangsari.
            Menghubungkan tradisi dengan inovasi digital.
          </p>
          <div className="mt-4 flex gap-3 text-[#05b72f]">
            <InstagramIcon className="h-5 w-5" />
            <FacebookIcon className="h-5 w-5" />
            <YoutubeIcon className="h-5 w-5" />
            <WhatsAppIcon className="h-5 w-5" />
          </div>
        </div>
        <div>
          <h3 className="text-2xl font-black text-[#2e6230]">Tautan Cepat</h3>
          <ul className="mt-4 space-y-3 text-base font-bold text-[#2e6230]">
            <li>
              <Link href="/#potensi">Tentang Kami</Link>
            </li>
            <li>
              <Link href="/#umkm">Kontak</Link>
            </li>
          </ul>
        </div>
        <div>
          <h3 className="text-2xl font-black text-[#2e6230]">Informasi</h3>
          <ul className="mt-4 space-y-3 text-base font-bold text-[#2e6230]">
            <li>
              <a href="#">Kebijakan Privasi</a>
            </li>
          </ul>
        </div>
        <div>
          <h3 className="text-2xl font-black text-[#2e6230]">Lokasi Kantor</h3>
          <div className="mt-4 space-y-6 text-base font-medium leading-7 text-[#999]">
            <div>
              <p className="font-black text-[#2e6230]">
                Balai Desa Munggangsari
              </p>
              <p>
                H464+R3H, Kwayuhan, Munggangsari, Kec. Kaliangkrik, Kabupaten
                Magelang, Jawa Tengah 56153
              </p>
            </div>
            <div>
              <p className="font-black text-[#2e6230]">Balai Desa Mangli</p>
              <p>
                H4Q3+666, Mangli, Kec. Kaliangkrik, Kabupaten Magelang, Jawa
                Tengah 56153
              </p>
            </div>
          </div>
        </div>
      </div>
      <p className="mt-10 text-center text-xs font-medium text-[#2e6230]">
        Dikembangkan oleh Tim KKN-PPM UGM Kaliangkrik 2026
      </p>
    </footer>
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

function LogOutIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={className}>
      <path d="M14 8V5a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h7a2 2 0 0 0 2-2v-3" />
      <path d="M9 12h12" />
      <path d="m17 8 4 4-4 4" />
    </svg>
  );
}

function ChevronDoubleLeftIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" className={className}>
      <path d="m11 17-5-5 5-5" />
      <path d="m18 17-5-5 5-5" />
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
