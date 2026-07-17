import Image from "next/image";
import Link from "next/link";
import { getArticles } from "@/services/article.service";
import { getUmkm } from "@/services/umkm.service";
import { getWarungs } from "@/services/warung.service";
import type { Article, Umkm, VillageSlug, Warung } from "@/types/database";

type AdminDashboardProps = {
  village: VillageSlug;
};

type Activity = {
  id: string;
  name: string;
  category: string;
  status: "AKTIF" | "DRAFT";
  createdAt: string;
};

type DashboardData = {
  primaryCount: number;
  articleCount: number;
  activities: Activity[];
  error: string | null;
};

const adminConfig = {
  mangli: {
    villageName: "Mangli",
    adminName: "Admin Mangli",
    primaryLabel: "Total UMKM",
    manageLabel: "Kelola UMKM",
    primaryCategory: "UMKM",
    addLabel: "Tambah Data",
    manageSegment: "umkm",
  },
  munggangsari: {
    villageName: "Munggangsari",
    adminName: "Admin Munggangsari",
    primaryLabel: "Total Warung",
    manageLabel: "Kelola Warung",
    primaryCategory: "Warung",
    addLabel: "Tambah Data",
    manageSegment: "warung",
  },
} satisfies Record<
  VillageSlug,
  {
    villageName: string;
    adminName: string;
    primaryLabel: string;
    manageLabel: string;
    primaryCategory: string;
    addLabel: string;
    manageSegment: string;
  }
>;

export default async function AdminDashboard({ village }: AdminDashboardProps) {
  const config = adminConfig[village];
  const dashboardData = await loadDashboardData(village);

  return (
    <main className="min-h-screen bg-white text-[#111111]">
      <div className="lg:grid lg:min-h-screen lg:grid-cols-[325px_1fr]">
        <aside className="flex border-b border-[#111] bg-white px-6 py-6 lg:min-h-screen lg:flex-col lg:border-b-0 lg:border-r">
          <div className="flex w-full items-center justify-between gap-6 lg:block">
            <div>
              <Logo size="large" />
            </div>
            <Link
              href="/admin/sign-in"
              className="inline-flex items-center gap-2 rounded-lg border border-[#d0d0d0] px-4 py-3 text-sm font-black text-[#2e6230] transition hover:bg-[#f3f8ef] lg:hidden"
            >
              <LogOutIcon className="h-5 w-5" />
              Keluar
            </Link>
          </div>

          <nav className="hidden space-y-3 lg:block lg:pt-14">
            <Link
              href={`/admin/${village}`}
              className="flex h-10 items-center gap-4 rounded-lg bg-[#dcf8d6] px-6 text-base font-black text-[#2e6230]"
            >
              <DashboardIcon className="h-5 w-5" />
              Dashboard
            </Link>
            <Link
              href={`/admin/${village}/${config.manageSegment}`}
              className="flex h-10 items-center gap-4 rounded-lg border border-[#d0d0d0] px-6 text-base font-black text-[#2e6230] transition hover:bg-[#f3f8ef]"
            >
              <StoreIcon className="h-5 w-5" />
              {config.manageLabel}
            </Link>
          </nav>

          <div className="mt-auto hidden space-y-5 pb-10 lg:block">
            <Link
              href={`/admin/${village}/${config.manageSegment}/tambah`}
              className="flex h-12 w-[210px] items-center justify-center gap-4 rounded-lg bg-[#33a4ff] text-base font-black text-white transition hover:bg-[#198de9]"
            >
              <PlusIcon className="h-5 w-5" />
              {config.addLabel}
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
                {config.adminName}
              </p>
              <UserIcon className="h-10 w-10 text-[#95ac00]" />
            </div>
          </header>

          <section
            id="dashboard"
            className="mx-auto max-w-5xl px-6 py-10 md:px-10"
          >
            {dashboardData.error && (
              <div className="mb-8 rounded-lg border border-[#d0d0d0] bg-[#fff7f7] px-5 py-4 text-sm font-bold text-[#9a2a2a]">
                {dashboardData.error}
              </div>
            )}

            <div className="grid gap-6 md:grid-cols-2">
              <StatCard
                icon={<StoreIcon className="h-11 w-11" />}
                label={config.primaryLabel}
                value={dashboardData.primaryCount}
              />
              <StatCard
                icon={<ArticleIcon className="h-11 w-11" />}
                label="Total Artikel Potensi"
                value={dashboardData.articleCount}
              />
            </div>

            <section
              id="kelola"
              className="mt-14 overflow-hidden rounded-lg border border-[#111]"
            >
              <div className="px-6 py-5">
                <h2 className="text-base font-black uppercase">
                  Aktivitas Terkini
                </h2>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full min-w-[720px] border-collapse text-left">
                  <thead className="bg-[#2f662d] text-white">
                    <tr>
                      <th className="px-7 py-4 text-xs font-black uppercase">
                        Data
                      </th>
                      <th className="px-7 py-4 text-xs font-black uppercase">
                        Kategori
                      </th>
                      <th className="px-7 py-4 text-xs font-black uppercase">
                        Status
                      </th>
                      <th className="px-7 py-4 text-xs font-black uppercase">
                        Waktu
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {dashboardData.activities.length > 0 ? (
                      dashboardData.activities.map((activity) => (
                        <tr
                          key={activity.id}
                          className="border-b border-[#a5a5a5] last:border-b-0"
                        >
                          <td className="px-7 py-5 text-sm font-black">
                            {activity.name}
                          </td>
                          <td className="px-7 py-5 text-sm">
                            {activity.category}
                          </td>
                          <td className="px-7 py-5 text-sm">
                            <StatusBadge status={activity.status} />
                          </td>
                          <td className="px-7 py-5 text-sm text-[#777]">
                            {formatRelativeTime(activity.createdAt)}
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td
                          colSpan={4}
                          className="px-7 py-12 text-center text-sm font-bold text-[#777]"
                        >
                          Belum ada aktivitas terbaru.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </section>
          </section>

          {/* <AdminFooter /> */}
        </div>
      </div>
    </main>
  );
}

async function loadDashboardData(village: VillageSlug): Promise<DashboardData> {
  try {
    const [umkm, warungs, articles] = await Promise.all([
      getUmkm({ villageSlug: village }),
      getWarungs({ villageSlug: village }),
      getArticles({ villageSlug: village }),
    ]);
    const primaryItems =
      village === "mangli"
        ? umkm.map((item) => mapUmkmActivity(item))
        : warungs.map((item) => mapWarungActivity(item));
    const articleItems = articles.map(mapArticleActivity);
    const activities = [...primaryItems, ...articleItems]
      .sort(
        (first, second) =>
          new Date(second.createdAt).getTime() -
          new Date(first.createdAt).getTime(),
      )
      .slice(0, 5);

    return {
      primaryCount: village === "mangli" ? umkm.length : warungs.length,
      articleCount: articles.length,
      activities,
      error: null,
    };
  } catch (error) {
    return {
      primaryCount: 0,
      articleCount: 0,
      activities: [],
      error:
        error instanceof Error
          ? error.message
          : "Data dashboard belum dapat dimuat saat ini.",
    };
  }
}

function mapUmkmActivity(item: Umkm): Activity {
  return {
    id: `umkm-${item.id}`,
    name: item.name,
    category: "UMKM",
    status: "AKTIF",
    createdAt: item.created_at,
  };
}

function mapWarungActivity(item: Warung): Activity {
  return {
    id: `warung-${item.id}`,
    name: item.name,
    category: "Warung",
    status: "AKTIF",
    createdAt: item.created_at,
  };
}

function mapArticleActivity(item: Article): Activity {
  return {
    id: `artikel-${item.id}`,
    name: item.title,
    category: "Artikel",
    status: "DRAFT",
    createdAt: item.created_at,
  };
}

function formatRelativeTime(value: string): string {
  const timestamp = new Date(value).getTime();
  const diffMs = Date.now() - timestamp;
  const diffMinutes = Math.max(0, Math.floor(diffMs / 60000));

  if (diffMinutes < 60) {
    return diffMinutes <= 1 ? "baru saja" : `${diffMinutes} menit lalu`;
  }

  const diffHours = Math.floor(diffMinutes / 60);

  if (diffHours < 24) {
    return `${diffHours} jam lalu`;
  }

  const diffDays = Math.floor(diffHours / 24);

  return `${diffDays} hari lalu`;
}

function StatCard({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: number;
}) {
  return (
    <article className="rounded-lg border border-[#111] px-6 py-8">
      <div className="text-[#2e6230]">{icon}</div>
      <h2 className="mt-7 text-2xl font-black">{label}</h2>
      <p className="mt-6 text-7xl font-black leading-none text-[#d47300]">
        {value}
      </p>
    </article>
  );
}

function StatusBadge({ status }: { status: Activity["status"] }) {
  const isActive = status === "AKTIF";

  return (
    <span
      className={`inline-flex rounded-md border px-2 py-1 text-[10px] font-black ${
        isActive
          ? "border-[#1f3f58] bg-[#69bdff] text-[#00121f]"
          : "border-[#c99253] bg-[#f3bf82] text-[#8d5e2e]"
      }`}
    >
      {status}
    </span>
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

function ArticleIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={className}>
      <rect x="5" y="3.5" width="14" height="17" rx="2" />
      <path d="M8.5 8h7" />
      <path d="M8.5 12h7" />
      <path d="M8.5 16h7" />
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
