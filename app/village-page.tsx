import Image from "next/image";
import Link from "next/link";
import { AnimatedCounter } from "@/components/animations/AnimatedCounter";
import { FadeIn } from "@/components/animations/FadeIn";
import { StaggerContainer } from "@/components/animations/StaggerContainer";
import { StaggerItem } from "@/components/animations/StaggerItem";
import {
  PublicFooter,
  PublicHeader,
  VillageSwitch,
} from "@/components/layout/public-site-shell";
import { getWhatsAppUrl } from "@/lib/utils/whatsapp";
import { getVillageAssetUrl } from "@/services/storage.service";
import { getUmkm } from "@/services/umkm.service";
import { getWarungs } from "@/services/warung.service";
import type { Umkm, VillageSlug, Warung } from "@/types/database";

const stats = [
  { value: "120+", label: "UMKM Terdaftar", icon: StoreIcon, color: "#2e6b35" },
  { value: "15", label: "Wisata Menarik", icon: CompassIcon, color: "#ef8b00" },
  { value: "2", label: "Desa Bersatu", icon: HomeIcon, color: "#2e6b35" },
];

const values = [
  { title: "Transparan", text: "Informasi jelas & terbuka", icon: ChartIcon },
  { title: "Terpercaya", text: "UMKM terverifikasi", icon: ShieldIcon },
  { title: "Terhubung", text: "Pasar lebih luas", icon: ShareIcon },
];

const villageCards = [
  {
    title: "Pusat UMKM & Kerajinan",
    copy: "Temukan berbagai produk unggulan dari tangan terampil warga Mangli, mulai dari kerajinan anyaman hingga camilan tradisional yang sudah bersertifikat halal.",
    image: "/images/mangli.jpg",
    button: "Jelajahi Mangli",
    badge: "Desa Mangli",
    badgeColor: "bg-[#2e6b35]",
    href: "/mangli",
  },
  {
    title: "Wisata Kuliner & Warung",
    copy: "Nikmati keramahan warga Munggangsari melalui deretan warung kuliner autentik yang menyajikan hidangan khas pedesaan dengan pemandangan alam yang asri.",
    image: "/images/culinary.jpg",
    button: "Jelajahi Munggangsari",
    badge: "Desa Munggangsari",
    badgeColor: "bg-[#ef8b00]",
    href: "/munggangsari",
  },
];

const gallery = [
  "/images/mangli.jpg",
  "/images/culinary.jpg",
  "/images/chips.jpg",
  "/images/village.jpg",
  "/images/hero.jpg",
  "/images/forest.jpg",
];

const fallbackUmkmPreview: PreviewItem[] = [
  {
    id: "fallback-umkm-keripik-talas-1",
    title: "Keripik Talas",
    category: "Makanan & Minuman",
    description: "Camilan lokal desa.",
    village: "Desa Mangli",
    image: "/images/chips.jpg",
    whatsappUrl: null,
  },
  {
    id: "fallback-umkm-keripik-talas-2",
    title: "Keripik Talas",
    category: "Makanan & Minuman",
    description: "Camilan lokal desa.",
    village: "Desa Mangli",
    image: "/images/chips.jpg",
    whatsappUrl: null,
  },
  {
    id: "fallback-umkm-keripik-talas-3",
    title: "Keripik Talas",
    category: "Makanan & Minuman",
    description: "Camilan lokal desa.",
    village: "Desa Mangli",
    image: "/images/chips.jpg",
    whatsappUrl: null,
  },
];

const fallbackArticlePreview: ArticlePreview[] = [
  {
    id: "fallback-article-gula-aren-1",
    title: "Cara Pembuatan Gula Aren Berkualitas Tinggi",
    description:
      "Pembuatan Gula Aren Berkualitas melalui proses yang sudah turun temurun dilakukan di desa kami.",
    articleUrl: "#",
    date: "12 Mei 2026",
    village: "Desa Mangli",
  },
  {
    id: "fallback-article-gula-aren-2",
    title: "Cara Pembuatan Gula Aren Berkualitas Tinggi",
    description:
      "Pembuatan Gula Aren Berkualitas melalui proses yang sudah turun temurun dilakukan di desa kami.",
    articleUrl: "#",
    date: "12 Mei 2026",
    village: "Desa Mangli",
  },
  {
    id: "fallback-article-gula-aren-3",
    title: "Cara Pembuatan Gula Aren Berkualitas Tinggi",
    description:
      "Pembuatan Gula Aren Berkualitas melalui proses yang sudah turun temurun dilakukan di desa kami.",
    articleUrl: "#",
    date: "12 Mei 2026",
    village: "Desa Mangli",
  },
];

type VillagePageProps = {
  village?: "all" | VillageSlug;
};

type PreviewItem = {
  id: string;
  title: string;
  category: string;
  description: string;
  village: string;
  image: string;
  whatsappUrl: string | null;
};

type ArticlePreview = {
  id: string;
  title: string;
  description: string;
  articleUrl: string;
  date: string;
  village: string;
};

type DataResult<T> = {
  data: T[];
  error: string | null;
};

export default async function VillagePage({
  village = "all",
}: VillagePageProps) {
  const isAll = village === "all";
  const isMangli = village === "mangli";
  const titleVillage = isMangli ? "Mangli" : "Munggangsari";
  const villageSlug = isAll ? undefined : village;
  const shouldShowWarungs = isAll || !isMangli;
  const [umkmResult, warungResult, articleResult] = await Promise.all([
    loadUmkmPreview(villageSlug),
    shouldShowWarungs
      ? loadWarungPreview(villageSlug)
      : Promise.resolve({ data: [], error: null }),
    loadArticlePreview(),
  ]);

  return (
    <main className="min-h-screen overflow-hidden bg-[#f7f8f4] text-[#141d13] transition-colors dark:bg-[#10150f] dark:text-[#f5f7f2]">
      <PublicHeader village={village} />

      <section id="beranda" className="relative min-h-[560px] overflow-hidden bg-[#1e321f] text-white md:min-h-[680px]">
        <Image
          src="/images/hero.jpg"
          alt="Pemandangan desa di kaki gunung"
          fill
          priority
          loading="eager"
          className="object-cover"
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-[#152417]/38 md:bg-[#152417]/58" />
        <div className="absolute inset-0 bg-gradient-to-b from-black/8 via-black/18 to-black/34 md:bg-gradient-to-r md:from-black/58 md:via-black/24 md:to-transparent" />
        <div className="absolute left-0 right-0 top-3 z-10 flex justify-center px-6 md:hidden">
          <VillageSwitch village={village} />
        </div>
        <div className="relative flex min-h-[560px] flex-col justify-center px-6 pb-16 pt-24 md:min-h-[680px] md:px-[40px] md:py-28">
          <StaggerContainer className="mx-auto max-w-[310px] md:mx-0 md:max-w-3xl">
            <StaggerItem>
            <h1 className="max-w-full text-[2.05rem] font-black leading-[0.98] md:text-7xl">
              {isAll ? (
                <>
                  Katalog Potensi
                  <br />
                  Desa Mangli &
                  <br />
                  Munggangsari
                </>
              ) : (
                <>
                  Katalog Potensi
                  <br />
                  Desa
                  <br />
                  {titleVillage}
                </>
              )}
            </h1>
            </StaggerItem>
            <StaggerItem>
            <p className="mt-4 max-w-[310px] text-[0.72rem] font-medium leading-5 text-white/86 md:mt-10 md:max-w-xl md:text-lg md:leading-8">
              Membangun kemandirian ekonomi desa melalui integrasi teknologi
              dan kearifan lokal.
            </p>
            </StaggerItem>
            <div className="mx-auto mt-5 grid max-w-[286px] grid-cols-3 gap-3 md:mx-0 md:mt-9 md:flex md:max-w-none md:flex-wrap">
              {stats.map(({ value, label, icon: Icon, color }) => (
                <StaggerItem
                  key={label}
                  className="flex min-h-[70px] flex-col items-center justify-center gap-1 rounded-lg bg-white px-2 py-2 text-center text-[#141d13] shadow-lg shadow-black/18 md:min-w-[150px] md:flex-row md:justify-start md:gap-3 md:border md:border-white/12 md:bg-black/24 md:px-4 md:py-3 md:text-left md:text-white md:shadow-none md:backdrop-blur"
                >
                  <span style={{ color }}>
                    <Icon className="h-5 w-5 md:h-6 md:w-6" />
                  </span>
                  <div>
                    <p className="text-sm font-black leading-4 md:text-lg md:leading-5">
                      <AnimatedCounter value={value} />
                    </p>
                    <p className="text-[0.55rem] font-semibold leading-3 text-[#263225] md:text-xs md:text-white/78">
                      {label}
                    </p>
                  </div>
                </StaggerItem>
              ))}
            </div>
            <StaggerItem>
            <a
              href={isAll ? "#jelajahi" : "#potensi"}
              className="btn-motion focus-ring mx-auto mt-5 inline-flex h-11 w-full max-w-[286px] items-center justify-center gap-3 rounded-full bg-[#ef8b00] px-7 text-sm font-black text-white shadow-lg shadow-black/20 transition hover:bg-[#d97e00] md:mx-0 md:mt-12 md:h-14 md:w-auto md:rounded-lg md:text-base"
            >
              Eksplorasi Sekarang
              <ArrowRightIcon className="motion-arrow h-5 w-5" />
            </a>
            </StaggerItem>
          </StaggerContainer>
        </div>
        <svg
          aria-hidden="true"
          className="absolute bottom-[-1px] left-0 h-14 w-full text-white md:hidden dark:text-[#10150f]"
          viewBox="0 0 390 56"
          preserveAspectRatio="none"
        >
          <path
            fill="currentColor"
            d="M0 18C58 2 97-2 144 23c53 29 95 23 144-3 41-22 75-20 102 1v35H0V18Z"
          />
        </svg>
      </section>

      <section id="potensi" className="bg-white pb-12 pt-10 transition-colors min-[1025px]:bg-[#f0f1ee] min-[1025px]:py-32 dark:bg-[#10150f] min-[1025px]:dark:bg-[#151c14]">
        <div className="grid gap-7 px-6 md:px-[40px] min-[1025px]:grid-cols-[1fr_0.92fr] min-[1025px]:items-center min-[1025px]:gap-16">
          <FadeIn direction="left">
            <h2 className="max-w-2xl text-[1.72rem] font-black leading-[1.02] md:max-w-none md:text-center min-[1025px]:max-w-2xl min-[1025px]:text-left min-[1025px]:text-5xl">
              Gerbang Digital
              <br className="md:hidden min-[1025px]:block" />
              Untuk <span className="text-[#2e6b35] dark:text-[#8bc98c]">Masa Depan Desa</span>
            </h2>
            <div className="mt-3 max-w-2xl space-y-2 text-[0.72rem] font-medium leading-5 text-[#334135] min-[1025px]:mt-8 min-[1025px]:space-y-5 min-[1025px]:text-base min-[1025px]:leading-7 dark:text-[#d4decf]">
              <p>
                Inisiatif Desa Digital merupakan langkah strategis untuk
                menghubungkan potensi unik {isAll ? "Desa Mangli dan Munggangsari" : `Desa ${titleVillage}`} dengan pasar yang
                lebih luas. Melalui platform ini, kami mendigitalisasi produk
                UMKM, warisan budaya, dan layanan publik guna menciptakan
                ekosistem desa yang lebih tangguh dan modern.
              </p>
              <p>
                Kami percaya bahwa teknologi seharusnya mempermudah, bukan
                mengasingkan. Oleh karena itu, antarmuka ini dirancang agar
                ramah pengguna bagi segala usia, memastikan setiap warga dapat
                merasakan manfaat dari transparansi informasi dan kemudahan
                akses ekonomi.
              </p>
            </div>
            <StaggerContainer className="mt-10 hidden max-w-2xl gap-6 divide-x divide-[#bbc7b9] min-[1025px]:grid min-[1025px]:grid-cols-3 dark:divide-[#41523f]">
              {values.map(({ title, text, icon: Icon }) => (
                <StaggerItem key={title} className="feature-motion px-4 first:pl-0">
                  <Icon className="mb-3 h-7 w-7 text-[#2e6b35] dark:text-[#8bc98c]" />
                  <h3 className="text-2xl font-black leading-6">{title}</h3>
                  <p className="mt-1 text-xs font-semibold text-[#536052] dark:text-[#b2bdae]">
                    {text}
                  </p>
                </StaggerItem>
              ))}
            </StaggerContainer>
          </FadeIn>
          <FadeIn direction="right" className="relative mx-auto aspect-[0.86] w-full max-w-[560px] overflow-hidden rounded-[18px] min-[1025px]:hidden">
            <Image
              src="/images/digital.png"
              alt="Tim desa digital"
              fill
              className="object-cover"
              sizes="(max-width: 1024px) calc(100vw - 80px), 560px"
            />
          </FadeIn>
          <FadeIn direction="right" className="relative hidden aspect-[1.35] overflow-hidden rounded-lg min-[1025px]:block">
            <Image
              src="/images/community.jpg"
              alt="Kegiatan budaya masyarakat desa"
              fill
              className="object-cover"
              sizes="(min-width: 768px) 42vw, 100vw"
            />
          </FadeIn>
          <StaggerContainer className="grid grid-cols-3 divide-x divide-[#dfe7dc] pt-1 text-center min-[1025px]:hidden dark:divide-[#344233]">
            {values.map(({ title, text, icon: Icon }) => (
              <StaggerItem key={title} className="feature-motion px-2">
                <Icon className="mx-auto mb-1.5 h-5 w-5 text-[#2e6b35] dark:text-[#8bc98c]" />
                <h3 className="text-[0.74rem] font-black leading-4">{title}</h3>
                <p className="mt-0.5 text-[0.48rem] font-semibold leading-3 text-[#536052] dark:text-[#b2bdae]">
                  {text}
                </p>
              </StaggerItem>
            ))}
          </StaggerContainer>
        </div>
      </section>

      <section id="jelajahi" className="bg-white pb-14 pt-2 transition-colors md:py-24 dark:bg-[#10150f]">
        <div className="px-5 md:px-[40px]">
          <FadeIn>
          <p className="text-[0.66rem] font-black text-[#2e6b35] md:text-sm dark:text-[#8bc98c]">Jelajahi Desa</p>
          <h2 className="mt-2 text-[1.45rem] font-black leading-tight md:mt-4 md:text-5xl">
            Dua Desa, Beragam Cerita
          </h2>
          <p className="mt-4 hidden max-w-3xl text-base font-medium text-[#536052] md:block dark:text-[#b2bdae]">
            Jelajahi keunikan masing-masing desa melalui katalog produk dan
            artikel potensi yang telah kami kurasi.
          </p>
          </FadeIn>
          <StaggerContainer className="mt-5 grid grid-cols-2 gap-3 md:mt-10 md:gap-5">
            {villageCards.map((card) => (
              <StaggerItem
                key={card.title}
                className="village-card-motion group relative min-h-[148px] overflow-hidden rounded-lg bg-[#20351f] text-white md:min-h-[340px]"
              >
                <Image
                  src={card.image}
                  alt={card.title}
                  fill
                  className="object-cover transition duration-500 group-hover:scale-105"
                  sizes="(min-width: 768px) 50vw, 100vw"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/76 via-black/28 to-transparent transition duration-300 md:bg-gradient-to-r md:from-black/72 md:via-black/32 md:to-transparent md:group-hover:from-black/78 md:group-hover:via-black/38" />
                <div className="relative flex min-h-[148px] max-w-[520px] flex-col justify-end p-3 transition duration-300 group-hover:-translate-y-1 md:min-h-[340px] md:justify-center md:p-8">
                  <span className={`${card.badgeColor} mb-2 w-fit rounded-md px-2 py-1 text-[0.48rem] font-black md:mb-6 md:rounded-lg md:px-4 md:py-2 md:text-xs`}>
                    {card.badge}
                  </span>
                  <h3 className="text-[1.18rem] font-black leading-[1.04] md:text-5xl">
                    {card.title}
                  </h3>
                  <p className="mt-4 hidden text-sm font-semibold leading-6 text-white/84 md:block">
                    {card.copy}
                  </p>
                  <Link
                    href={card.href}
                    className="btn-motion focus-ring mt-3 inline-flex h-7 w-full items-center justify-center gap-2 rounded-full bg-white px-2 text-[0.48rem] font-black text-[#20351f] md:mt-6 md:h-10 md:w-fit md:gap-3 md:rounded-lg md:px-5 md:text-sm"
                  >
                    {card.button}
                    <ArrowRightIcon className="motion-arrow h-3 w-3 md:h-4 md:w-4" />
                  </Link>
                </div>
              </StaggerItem>
            ))}
          </StaggerContainer>
        </div>
      </section>

      <PreviewSection
        id="umkm"
        eyebrow="Produk UMKM Unggulan"
        heading="Produk Lokal Pilihan"
        ctaHref={isAll ? "#jelajahi" : `${isMangli ? "/mangli" : "/munggangsari"}/umkm`}
        ctaLabel="Lihat Semua Produk"
        emptyMessage="Belum ada data UMKM yang tersedia."
        result={umkmResult}
      />

      {shouldShowWarungs && (
        <div className={isAll ? "hidden md:block" : undefined}>
          <PreviewSection
            id="warung"
            eyebrow="Warung Kuliner Unggulan"
            heading="Warung Lokal Pilihan"
            ctaHref="/munggangsari/warung"
            ctaLabel="Lihat Semua Warung"
            emptyMessage="Belum ada data warung yang tersedia."
            result={warungResult}
          />
        </div>
      )}

      <section id="artikel" className="bg-white pb-14 transition-colors md:pb-24 dark:bg-[#10150f]">
        <div className="grid gap-12 px-5 md:grid-cols-[1fr_0.84fr] md:px-[40px]">
          <div className="md:border-r md:border-[#899483] md:pr-10 md:dark:border-[#4d5e49]">
            <div className="flex items-center justify-between md:hidden">
              <h2 className="text-sm font-black">Galeri Kehidupan Desa</h2>
              <a
                href="#"
                className="inline-flex items-center gap-1 text-[0.52rem] font-black text-[#2e6b35] dark:text-[#8bc98c]"
              >
                Lihat Selengkapnya
                <ArrowRightIcon className="h-3 w-3" />
              </a>
            </div>
            <FadeIn className="hidden md:block">
            <p className="text-sm font-black text-[#2e6b35] dark:text-[#8bc98c]">Galeri Desa</p>
            <h2 className="mt-4 text-4xl font-black md:text-5xl">
              Kehidupan & Keindahan Desa
            </h2>
            </FadeIn>
            <StaggerContainer className="mt-3 grid grid-cols-2 gap-3 md:mt-8 md:grid-cols-3">
              {gallery.map((src, index) => (
                <StaggerItem
                  key={src}
                  className="gallery-thumb-motion relative aspect-[1.45] overflow-hidden rounded-lg bg-[#e8ece4] dark:bg-[#172017]"
                >
                  <Image
                    src={src}
                    alt={`Galeri potensi desa ${index + 1}`}
                    fill
                    className="object-cover"
                    sizes="(min-width: 768px) 18vw, 33vw"
                  />
                </StaggerItem>
              ))}
            </StaggerContainer>
            <a
              href="#"
              className="btn-motion focus-ring mt-8 hidden h-11 items-center gap-3 rounded-lg border border-[#2e6b35] px-6 text-sm font-black text-[#2e6b35] transition hover:bg-[#edf3eb] md:inline-flex dark:border-[#8bc98c] dark:text-[#8bc98c] dark:hover:bg-white/10"
            >
              Lihat Galeri Selengkapnya
              <ArrowRightIcon className="motion-arrow h-4 w-4" />
            </a>
          </div>
          <div>
            <div className="flex items-end justify-between gap-4 md:hidden">
              <div>
                <p className="text-[0.55rem] font-black uppercase text-[#2e6b35] dark:text-[#8bc98c]">
                  Artikel Terbaru
                </p>
                <h2 className="mt-2 text-[1.35rem] font-black leading-tight">
                  Cerita & Inspirasi Desa
                </h2>
              </div>
              <a
                href="#"
                className="mb-1 inline-flex shrink-0 items-center gap-1 text-[0.52rem] font-black text-[#2e6b35] dark:text-[#8bc98c]"
              >
                Lihat Semua Artikel
                <ArrowRightIcon className="h-3 w-3" />
              </a>
            </div>
            <FadeIn className="hidden md:block">
            <p className="text-sm font-black uppercase text-[#2e6b35] dark:text-[#8bc98c]">
              Artikel Terbaru
            </p>
            <h2 className="mt-4 text-4xl font-black md:text-5xl">
              Cerita & Inspirasi Desa
            </h2>
            </FadeIn>
            {articleResult.error ? (
              <DataMessage message={articleResult.error} />
            ) : articleResult.data.length === 0 ? (
              <DataMessage message="Belum ada artikel yang tersedia." />
            ) : (
              <StaggerContainer className="mt-4 space-y-4 md:mt-8 md:space-y-6">
                {articleResult.data.map((article) => (
                  <StaggerItem
                    key={article.id}
                    className="article-item-motion grid grid-cols-[118px_1fr] gap-3 md:grid-cols-[150px_1fr] md:gap-5"
                  >
                    <div className="relative aspect-[1.55] overflow-hidden rounded-lg bg-[#e8ece4] dark:bg-[#172017]">
                      <Image
                        src="/images/gula-aren.jpg"
                        alt={article.title}
                        fill
                        className="object-cover"
                        sizes="150px"
                      />
                    </div>
                    <div>
                      <a
                        href={article.articleUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-[0.64rem] font-black leading-3 transition-colors hover:text-[#2e6b35] md:text-lg md:leading-6 dark:hover:text-[#8bc98c]"
                      >
                        {article.title}
                      </a>
                      <p className="mt-1 text-[0.48rem] font-bold text-[#7d8a78] md:mt-2 md:text-xs dark:text-[#b2bdae]">
                        {article.date} - {article.village}
                      </p>
                      <p className="mt-1 line-clamp-2 text-[0.48rem] font-medium leading-3 text-[#8a9586] md:mt-3 md:text-sm md:leading-6 dark:text-[#b2bdae]">
                        {article.description}
                      </p>
                      <a
                        href={article.articleUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="mt-3 hidden text-sm font-black text-[#2e6b35] transition hover:underline md:inline-flex dark:text-[#8bc98c]"
                      >
                        Baca Artikel
                      </a>
                    </div>
                  </StaggerItem>
                ))}
              </StaggerContainer>
            )}
            <a
              href="#"
              className="btn-motion focus-ring mt-8 hidden h-11 items-center gap-3 rounded-lg border border-[#2e6b35] px-6 text-sm font-black text-[#2e6b35] transition hover:bg-[#edf3eb] md:inline-flex dark:border-[#8bc98c] dark:text-[#8bc98c] dark:hover:bg-white/10"
            >
              Lihat Semua Artikel
              <ArrowRightIcon className="motion-arrow h-4 w-4" />
            </a>
          </div>
        </div>
      </section>

      <section className="relative overflow-hidden bg-[#23672d] py-8 text-white md:py-16 dark:bg-[#1c4d25]">
        <div className="absolute inset-0 opacity-10 [background-image:linear-gradient(135deg,#ffffff_1px,transparent_1px)] [background-size:18px_18px]" />
        <FadeIn className="relative mx-auto flex max-w-4xl flex-col items-center gap-4 px-6 text-center md:grid md:grid-cols-[1fr_auto] md:gap-10 md:px-10 md:text-left">
          <div>
            <h2 className="text-[1.65rem] font-black leading-[1.04] md:text-5xl">
              Dapatkan Update
              <br />
              Potensi Terbaru
            </h2>
            <p className="mx-auto mt-2 max-w-[300px] text-[0.58rem] font-semibold leading-4 text-white/82 md:mx-0 md:mt-5 md:max-w-xl md:text-base md:leading-7">
              Jadilah yang pertama mengetahui rilis produk UMKM baru, festival
              desa, dan promo khusus langsung di WhatsApp atau Email Anda.
            </p>
          </div>
          <a
            href="#umkm"
            className="btn-motion focus-ring inline-flex h-10 items-center justify-center gap-2 rounded-full bg-white px-5 text-xs font-black text-[#23672d] shadow-lg shadow-black/16 transition hover:bg-white/90 md:h-14 md:rounded-lg md:border md:border-white md:bg-transparent md:px-6 md:text-sm md:text-white md:shadow-none md:hover:bg-white/10"
          >
            <WhatsAppIcon className="h-4 w-4 md:hidden" />
            <ArrowRightIcon className="motion-arrow hidden h-5 w-5 md:block" />
            Ikuti WhatsApp Channel
          </a>
        </FadeIn>
      </section>

      <FadeIn>
        <PublicFooter />
      </FadeIn>
    </main>
  );
}

function PreviewSection({
  id,
  eyebrow,
  heading,
  ctaHref,
  ctaLabel,
  emptyMessage,
  result,
}: {
  id: string;
  eyebrow: string;
  heading: string;
  ctaHref: string;
  ctaLabel: string;
  emptyMessage: string;
  result: DataResult<PreviewItem>;
}) {
  const displayData =
    result.data.length > 0 && result.data.length < 3
      ? Array.from({ length: 3 }, (_, index) => result.data[index % result.data.length])
      : result.data;

  return (
    <section id={id} className="bg-white pb-14 transition-colors md:pb-24 dark:bg-[#10150f]">
      <div className="px-5 md:px-[40px]">
        <div className="flex items-end justify-between gap-4">
          <FadeIn>
            <div>
              <p className="text-[0.55rem] font-black text-[#2e6b35] md:text-sm dark:text-[#8bc98c]">
                {eyebrow}
              </p>
              <h2 className="mt-2 text-[1.45rem] font-black leading-tight md:mt-4 md:text-5xl">
                {heading}
              </h2>
            </div>
          </FadeIn>
          <a
            href={ctaHref}
            className="btn-motion focus-ring mb-1 inline-flex h-auto w-fit shrink-0 items-center gap-1 rounded-none border-0 px-0 text-[0.55rem] font-black text-[#2e6b35] transition hover:underline md:h-11 md:gap-3 md:rounded-lg md:border md:border-[#2e6b35] md:px-6 md:text-sm md:hover:bg-[#edf3eb] md:hover:no-underline dark:border-[#8bc98c] dark:text-[#8bc98c] dark:hover:bg-white/10"
          >
            {ctaLabel}
            <ArrowRightIcon className="motion-arrow h-3 w-3 md:h-4 md:w-4" />
          </a>
        </div>
        <div className="relative mt-4 md:mt-8">
          <button
            aria-label="Produk sebelumnya"
            className="absolute left-[-18px] top-1/2 z-10 hidden h-11 w-11 -translate-y-1/2 place-items-center rounded-full border border-[#d5ddd1] bg-white text-[#536052] shadow-md lg:grid dark:border-[#3b4a38] dark:bg-[#172017] dark:text-[#d4decf]"
          >
            <ChevronLeftIcon className="h-5 w-5" />
          </button>
          {result.error ? (
            <DataMessage message={result.error} />
          ) : result.data.length === 0 ? (
            <DataMessage message={emptyMessage} />
          ) : (
            <>
            <StaggerContainer className="grid grid-cols-3 gap-3 md:grid-cols-2 md:gap-5 lg:grid-cols-4">
              {displayData.map((product, index) => (
                <StaggerItem
                  key={`${product.id}-${index}`}
                  className={[
                    index >= result.data.length ? "md:hidden" : "",
                    index > 2 ? "hidden lg:block" : "",
                  ]
                    .filter(Boolean)
                    .join(" ") || undefined}
                >
                  <article className="product-card-motion overflow-hidden rounded-lg border border-[#d5ddd1] bg-white shadow-sm transition-colors dark:border-[#334330] dark:bg-[#172017]">
                    <div className="relative aspect-[1.05] overflow-hidden md:aspect-[1.2]">
                      <Image
                        src={product.image}
                        alt={product.title}
                        fill
                        className="object-cover"
                        sizes="(min-width: 1024px) 25vw, (min-width: 640px) 50vw, 100vw"
                      />
                    </div>
                    <div className="p-2 md:p-4">
                      <span className="rounded border border-[#dce4d8] px-1.5 py-0.5 text-[0.42rem] font-bold text-[#7d8a78] md:rounded-md md:px-2 md:py-1 md:text-xs dark:border-[#3b4a38] dark:text-[#b2bdae]">
                        {product.category}
                      </span>
                      <h3 className="mt-2 min-h-8 text-[0.62rem] font-black leading-3 md:mt-3 md:min-h-12 md:text-base md:leading-6">
                        {product.title}
                      </h3>
                      <div className="mt-4 flex items-center justify-between md:mt-8">
                        <p className="flex min-w-0 items-center gap-1 truncate text-[0.5rem] font-bold text-[#7d8a78] md:text-sm dark:text-[#b2bdae]">
                          <PinIcon className="h-3 w-3 shrink-0 text-[#273226] md:h-4 md:w-4 dark:text-[#e6efe3]" />
                          {product.village}
                        </p>
                        {product.whatsappUrl && (
                          <a
                            href={product.whatsappUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            aria-label={`Hubungi penjual ${product.title}`}
                            className="focus-ring grid h-5 w-5 shrink-0 place-items-center rounded-full bg-[#1dc95b] text-white transition hover:scale-110 md:h-8 md:w-8"
                          >
                            <WhatsAppIcon className="h-3.5 w-3.5 md:h-5 md:w-5" />
                          </a>
                        )}
                      </div>
                    </div>
                  </article>
                </StaggerItem>
              ))}
            </StaggerContainer>
            <div className="mt-3 flex justify-center gap-1.5 md:hidden" aria-hidden="true">
              <span className="h-2 w-2 rounded-full bg-[#2e6b35]" />
              <span className="h-2 w-2 rounded-full bg-[#d6ddd2]" />
              <span className="h-2 w-2 rounded-full bg-[#d6ddd2]" />
            </div>
            </>
          )}
          <button
            aria-label="Produk berikutnya"
            className="absolute right-[-18px] top-1/2 z-10 hidden h-11 w-11 -translate-y-1/2 place-items-center rounded-full border border-[#d5ddd1] bg-white text-[#536052] shadow-md lg:grid dark:border-[#3b4a38] dark:bg-[#172017] dark:text-[#d4decf]"
          >
            <ChevronRightIcon className="h-5 w-5" />
          </button>
        </div>
      </div>
    </section>
  );
}

async function loadUmkmPreview(
  villageSlug?: VillageSlug,
): Promise<DataResult<PreviewItem>> {
  try {
    const umkm = await getUmkm({ villageSlug, limit: 4 });
    const data = fillPreviewItems(umkm.map(mapUmkmPreview), fallbackUmkmPreview);

    return {
      data,
      error: null,
    };
  } catch (error) {
    return {
      data: [],
      error:
        error instanceof Error
          ? error.message
          : "Data UMKM belum dapat dimuat saat ini.",
    };
  }
}

async function loadWarungPreview(
  villageSlug?: VillageSlug,
): Promise<DataResult<PreviewItem>> {
  try {
    const warungs = await getWarungs({ villageSlug, limit: 4 });

    return {
      data: warungs.map(mapWarungPreview),
      error: null,
    };
  } catch (error) {
    return {
      data: [],
      error:
        error instanceof Error
          ? error.message
          : "Data warung belum dapat dimuat saat ini.",
    };
  }
}

async function loadArticlePreview(): Promise<DataResult<ArticlePreview>> {
  return {
    data: fallbackArticlePreview,
    error: null,
  };
}

function mapUmkmPreview(umkm: Umkm): PreviewItem {
  return {
    id: umkm.id,
    title: umkm.name,
    category: "Makanan & Minuman",
    description: umkm.description,
    village: `Desa ${umkm.villages?.name ?? "Mangli"}`,
    image: getVillageAssetUrl(umkm.photo_path) ?? "/images/chips.jpg",
    whatsappUrl: getWhatsAppUrl(umkm.whatsapp_number, umkm.name),
  };
}

function mapWarungPreview(warung: Warung): PreviewItem {
  return {
    id: warung.id,
    title: warung.name,
    category: "Warung Kuliner",
    description: warung.owner_name ?? warung.address ?? "Warung lokal desa.",
    village: `Desa ${warung.villages?.name ?? "Munggangsari"}`,
    image: getVillageAssetUrl(warung.photo_path) ?? "/images/culinary.jpg",
    whatsappUrl: getWhatsAppUrl(warung.whatsapp_number, warung.name),
  };
}

function fillPreviewItems<T>(items: T[], fallback: T[], minimum = 3): T[] {
  if (items.length >= minimum) {
    return items;
  }

  return [...items, ...fallback].slice(0, minimum);
}

function DataMessage({ message }: { message: string }) {
  return (
    <div className="rounded-lg border border-[#d5ddd1] bg-[#f7f8f4] px-6 py-8 text-center text-base font-bold leading-7 text-[#536052] dark:border-[#344233] dark:bg-[#172017] dark:text-[#d4decf]">
      {message}
    </div>
  );
}

type IconProps = { className?: string };

function ArrowRightIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" className={className}>
      <path d="M5 12h14" />
      <path d="m13 6 6 6-6 6" />
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

function CompassIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={className}>
      <circle cx="12" cy="12" r="9" />
      <path d="m15.5 8.5-2.2 4.8-4.8 2.2 2.2-4.8 4.8-2.2Z" />
    </svg>
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

function ChartIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={className}>
      <path d="M4 19V9" />
      <path d="M10 19V5" />
      <path d="M16 19v-8" />
      <path d="M22 19H2" />
    </svg>
  );
}

function ShieldIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={className}>
      <path d="M12 3 5 6v5c0 4.5 2.8 8.3 7 10 4.2-1.7 7-5.5 7-10V6l-7-3Z" />
      <path d="m9 12 2 2 4-5" />
    </svg>
  );
}

function ShareIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={className}>
      <circle cx="18" cy="5" r="3" />
      <circle cx="6" cy="12" r="3" />
      <circle cx="18" cy="19" r="3" />
      <path d="m8.6 10.6 6.8-4.2" />
      <path d="m8.6 13.4 6.8 4.2" />
    </svg>
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
