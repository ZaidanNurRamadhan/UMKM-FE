import Image from "next/image";
import Link from "next/link";
import { AnimatedCounter } from "@/components/animations/AnimatedCounter";
import { AnimatedHeader } from "@/components/animations/AnimatedHeader";
import { FadeIn } from "@/components/animations/FadeIn";
import { StaggerContainer } from "@/components/animations/StaggerContainer";
import { StaggerItem } from "@/components/animations/StaggerItem";
import { getWhatsAppUrl } from "@/lib/whatsapp";
import { getArticles } from "@/services/article.service";
import { getVillageAssetUrl } from "@/services/storage.service";
import { getUmkm } from "@/services/umkm.service";
import { getWarungs } from "@/services/warung.service";
import type { Article, Umkm, VillageSlug, Warung } from "@/types/database";
import { ThemeToggle } from "./theme-toggle";

const stats = [
  { value: "120+", label: "UMKM Terdaftar", icon: StoreIcon },
  { value: "15", label: "Wisata Menarik", icon: CompassIcon },
  { value: "2", label: "Desa Bersatu", icon: HomeIcon },
];

const values = [
  { title: "Transparan", text: "Informasi jelas & terbuka", icon: ChartIcon },
  { title: "Terpercaya", text: "UMKM terverifikasi", icon: ShieldIcon },
  { title: "Terhubung", text: "Pasar lebih luas", icon: ShareIcon },
];

const villageCards = [
  {
    title: "Wisata Kuliner & Warung",
    copy: "Nikmati keramahan warga Munggangsari melalui deretan warung kuliner autentik yang menyajikan hidangan khas pedesaan dengan pemandangan alam yang asri.",
    image: "/images/culinary.jpg",
    button: "Jelajahi Munggangsari",
    badge: "Desa Munggangsari",
    badgeColor: "bg-[#ef8b00]",
    href: "/munggangsari",
  },
  {
    title: "Pusat UMKM & Kerajinan",
    copy: "Temukan berbagai produk unggulan dari tangan terampil warga Mangli, mulai dari kerajinan anyaman hingga camilan tradisional yang sudah bersertifikat halal.",
    image: "/images/mangli.jpg",
    button: "Jelajahi Mangli",
    badge: "Desa Mangli",
    badgeColor: "bg-[#2e6b35]",
    href: "/mangli",
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
    loadArticlePreview(villageSlug),
  ]);

  return (
    <main className="min-h-screen overflow-hidden bg-[#f7f8f4] text-[#141d13] transition-colors dark:bg-[#10150f] dark:text-[#f5f7f2]">
      <Header village={village} />

      <section id="beranda" className="relative min-h-[680px] overflow-hidden bg-[#1e321f] text-white">
        <Image
          src="/images/hero.jpg"
          alt="Pemandangan desa di kaki gunung"
          fill
          priority
          loading="eager"
          className="object-cover"
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-[#152417]/58" />
        <div className="absolute inset-0 bg-gradient-to-r from-black/58 via-black/24 to-transparent" />
        <div className="relative mx-auto flex min-h-[680px] max-w-7xl flex-col justify-center px-6 py-28 md:px-10">
          <StaggerContainer className="max-w-3xl">
            <StaggerItem>
            <h1 className="max-w-full text-5xl font-black leading-[0.96] sm:text-6xl md:text-7xl">
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
            <p className="mt-10 max-w-xl text-lg font-medium leading-8 text-white/86">
              Membangun kemandirian ekonomi desa melalui integrasi teknologi
              dan kearifan lokal.
            </p>
            </StaggerItem>
            <div className="mt-9 flex flex-wrap gap-3">
              {stats.map(({ value, label, icon: Icon }) => (
                <StaggerItem
                  key={label}
                  className="flex min-w-[150px] items-center gap-3 rounded-lg border border-white/12 bg-black/24 px-4 py-3 backdrop-blur"
                >
                  <Icon className="h-6 w-6 text-[#ef8b00]" />
                  <div>
                    <p className="text-lg font-black leading-5">
                      <AnimatedCounter value={value} />
                    </p>
                    <p className="text-xs font-semibold text-white/78">
                      {label}
                    </p>
                  </div>
                </StaggerItem>
              ))}
            </div>
            <StaggerItem>
            <a
              href={isAll ? "#jelajahi" : "#potensi"}
              className="btn-motion focus-ring mt-12 inline-flex h-14 items-center gap-3 rounded-lg bg-[#ef8b00] px-7 text-base font-black text-white shadow-lg shadow-black/20 transition hover:bg-[#d97e00]"
            >
              Eksplorasi Sekarang
              <ArrowRightIcon className="motion-arrow h-5 w-5" />
            </a>
            </StaggerItem>
          </StaggerContainer>
        </div>
      </section>

      <section id="potensi" className="bg-[#f0f1ee] py-24 transition-colors md:py-32 dark:bg-[#151c14]">
        <div className="mx-auto grid max-w-7xl items-center gap-16 px-6 md:grid-cols-[1fr_0.92fr] md:px-10">
          <FadeIn direction="left">
            <h2 className="max-w-2xl text-4xl font-black leading-[1.05] md:text-5xl">
              Gerbang Digital
              <br />
              Untuk <span className="text-[#2e6b35] dark:text-[#8bc98c]">Masa Depan Desa</span>
            </h2>
            <div className="mt-8 max-w-2xl space-y-5 text-base font-medium leading-7 text-[#334135] dark:text-[#d4decf]">
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
            <StaggerContainer className="mt-10 grid max-w-2xl gap-6 sm:grid-cols-3 sm:divide-x sm:divide-[#bbc7b9] sm:dark:divide-[#41523f]">
              {values.map(({ title, text, icon: Icon }) => (
                <StaggerItem key={title} className="feature-motion sm:px-4 sm:first:pl-0">
                  <Icon className="mb-3 h-7 w-7 text-[#2e6b35] dark:text-[#8bc98c]" />
                  <h3 className="text-2xl font-black leading-6">{title}</h3>
                  <p className="mt-1 text-xs font-semibold text-[#536052] dark:text-[#b2bdae]">
                    {text}
                  </p>
                </StaggerItem>
              ))}
            </StaggerContainer>
          </FadeIn>
          <FadeIn direction="right" className="relative aspect-[1.35] overflow-hidden rounded-lg">
            <Image
              src="/images/community.jpg"
              alt="Kegiatan budaya masyarakat desa"
              fill
              className="object-cover"
              sizes="(min-width: 768px) 42vw, 100vw"
            />
          </FadeIn>
        </div>
      </section>

      <section id="jelajahi" className="bg-white py-24 transition-colors dark:bg-[#10150f]">
        <div className="mx-auto max-w-7xl px-6 md:px-10">
          <FadeIn>
          <p className="text-sm font-black text-[#2e6b35] dark:text-[#8bc98c]">Jelajahi Desa</p>
          <h2 className="mt-4 text-4xl font-black md:text-5xl">
            Dua Desa, Beragam Cerita
          </h2>
          <p className="mt-4 max-w-3xl text-base font-medium text-[#536052] dark:text-[#b2bdae]">
            Jelajahi keunikan masing-masing desa melalui katalog produk dan
            artikel potensi yang telah kami kurasi.
          </p>
          </FadeIn>
          <StaggerContainer className="mt-10 grid gap-5 md:grid-cols-2">
            {villageCards.map((card) => (
              <StaggerItem
                key={card.title}
                className="village-card-motion group relative min-h-[340px] overflow-hidden rounded-lg bg-[#20351f] text-white"
              >
                <Image
                  src={card.image}
                  alt={card.title}
                  fill
                  className="object-cover transition duration-500 group-hover:scale-105"
                  sizes="(min-width: 768px) 50vw, 100vw"
                />
                <div className="absolute inset-0 bg-gradient-to-r from-black/72 via-black/32 to-transparent transition duration-300 group-hover:from-black/78 group-hover:via-black/38" />
                <div className="relative flex min-h-[340px] max-w-[520px] flex-col justify-center p-8 transition duration-300 group-hover:-translate-y-1">
                  <span className={`${card.badgeColor} mb-6 w-fit rounded-lg px-4 py-2 text-xs font-black`}>
                    {card.badge}
                  </span>
                  <h3 className="text-4xl font-black leading-none md:text-5xl">
                    {card.title}
                  </h3>
                  <p className="mt-4 text-sm font-semibold leading-6 text-white/84">
                    {card.copy}
                  </p>
                  <Link
                    href={card.href}
                    className="btn-motion focus-ring mt-6 inline-flex h-10 w-fit items-center gap-3 rounded-lg bg-white px-5 text-sm font-black text-[#20351f]"
                  >
                    {card.button}
                    <ArrowRightIcon className="motion-arrow h-4 w-4" />
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
        <PreviewSection
          id="warung"
          eyebrow="Warung Kuliner Unggulan"
          heading="Warung Lokal Pilihan"
          ctaHref="/munggangsari/warung"
          ctaLabel="Lihat Semua Warung"
          emptyMessage="Belum ada data warung yang tersedia."
          result={warungResult}
        />
      )}

      <section id="artikel" className="bg-white pb-24 transition-colors dark:bg-[#10150f]">
        <div className="mx-auto grid max-w-7xl gap-12 px-6 md:grid-cols-[1fr_0.84fr] md:px-10">
          <div className="md:border-r md:border-[#899483] md:pr-10 md:dark:border-[#4d5e49]">
            <FadeIn>
            <p className="text-sm font-black text-[#2e6b35] dark:text-[#8bc98c]">Galeri Desa</p>
            <h2 className="mt-4 text-4xl font-black md:text-5xl">
              Kehidupan & Keindahan Desa
            </h2>
            </FadeIn>
            <StaggerContainer className="mt-8 grid grid-cols-3 gap-3">
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
              className="btn-motion focus-ring mt-8 inline-flex h-11 items-center gap-3 rounded-lg border border-[#2e6b35] px-6 text-sm font-black text-[#2e6b35] transition hover:bg-[#edf3eb] dark:border-[#8bc98c] dark:text-[#8bc98c] dark:hover:bg-white/10"
            >
              Lihat Galeri Selengkapnya
              <ArrowRightIcon className="motion-arrow h-4 w-4" />
            </a>
          </div>
          <div>
            <FadeIn>
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
              <StaggerContainer className="mt-8 space-y-6">
                {articleResult.data.map((article) => (
                  <StaggerItem
                    key={article.id}
                    className="article-item-motion grid gap-5 sm:grid-cols-[150px_1fr]"
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
                        className="text-lg font-black leading-6 transition-colors hover:text-[#2e6b35] dark:hover:text-[#8bc98c]"
                      >
                        {article.title}
                      </a>
                      <p className="mt-2 text-xs font-bold text-[#7d8a78] dark:text-[#b2bdae]">
                        {article.date} - {article.village}
                      </p>
                      <p className="mt-3 text-sm font-medium leading-6 text-[#8a9586] dark:text-[#b2bdae]">
                        {article.description}
                      </p>
                      <a
                        href={article.articleUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="mt-3 inline-flex text-sm font-black text-[#2e6b35] transition hover:underline dark:text-[#8bc98c]"
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
              className="btn-motion focus-ring mt-8 inline-flex h-11 items-center gap-3 rounded-lg border border-[#2e6b35] px-6 text-sm font-black text-[#2e6b35] transition hover:bg-[#edf3eb] dark:border-[#8bc98c] dark:text-[#8bc98c] dark:hover:bg-white/10"
            >
              Lihat Semua Artikel
              <ArrowRightIcon className="motion-arrow h-4 w-4" />
            </a>
          </div>
        </div>
      </section>

      <section className="relative overflow-hidden bg-[#23672d] py-16 text-white dark:bg-[#1c4d25]">
        <div className="absolute inset-0 opacity-20 [background-image:radial-gradient(circle_at_20%_20%,#ffffff_0,transparent_24%),radial-gradient(circle_at_80%_70%,#ffffff_0,transparent_22%)]" />
        <FadeIn className="relative mx-auto grid max-w-4xl items-center gap-10 px-6 md:grid-cols-[1fr_auto] md:px-10">
          <div>
            <h2 className="text-4xl font-black leading-[1.05] md:text-5xl">
              Dapatkan Update
              <br />
              Potensi Terbaru
            </h2>
            <p className="mt-5 max-w-xl text-base font-semibold leading-7 text-white/82">
              Jadilah yang pertama mengetahui rilis produk UMKM baru, festival
              desa, dan promo khusus langsung di WhatsApp atau Email Anda.
            </p>
          </div>
          <a
            href="#umkm"
            className="btn-motion focus-ring inline-flex h-14 items-center justify-center gap-3 rounded-lg border border-white px-6 text-sm font-black text-white transition hover:bg-white/10"
          >
            <ArrowRightIcon className="motion-arrow h-5 w-5" />
            Lihat Produk Terbaru
          </a>
        </FadeIn>
      </section>

      <FadeIn>
        <Footer />
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
  return (
    <section id={id} className="bg-white pb-24 transition-colors dark:bg-[#10150f]">
      <div className="mx-auto max-w-7xl px-6 md:px-10">
        <div className="flex flex-col justify-between gap-5 md:flex-row md:items-end">
          <FadeIn>
            <div>
              <p className="text-sm font-black text-[#2e6b35] dark:text-[#8bc98c]">
                {eyebrow}
              </p>
              <h2 className="mt-4 text-4xl font-black md:text-5xl">
                {heading}
              </h2>
            </div>
          </FadeIn>
          <a
            href={ctaHref}
            className="btn-motion focus-ring inline-flex h-11 w-fit items-center gap-3 rounded-lg border border-[#2e6b35] px-6 text-sm font-black text-[#2e6b35] transition hover:bg-[#edf3eb] dark:border-[#8bc98c] dark:text-[#8bc98c] dark:hover:bg-white/10"
          >
            {ctaLabel}
            <ArrowRightIcon className="motion-arrow h-4 w-4" />
          </a>
        </div>
        <div className="relative mt-8">
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
            <StaggerContainer className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
              {result.data.map((product) => (
                <StaggerItem key={product.id}>
                  <article className="product-card-motion overflow-hidden rounded-lg border border-[#d5ddd1] bg-white shadow-sm transition-colors dark:border-[#334330] dark:bg-[#172017]">
                    <div className="relative aspect-[1.2] overflow-hidden">
                      <Image
                        src={product.image}
                        alt={product.title}
                        fill
                        className="object-cover"
                        sizes="(min-width: 1024px) 25vw, (min-width: 640px) 50vw, 100vw"
                      />
                    </div>
                    <div className="p-4">
                      <span className="rounded-md border border-[#dce4d8] px-2 py-1 text-xs font-bold text-[#7d8a78] dark:border-[#3b4a38] dark:text-[#b2bdae]">
                        {product.category}
                      </span>
                      <h3 className="mt-3 min-h-12 text-base font-black leading-6">
                        {product.title}
                      </h3>
                      <div className="mt-8 flex items-center justify-between">
                        <p className="flex items-center gap-1 text-sm font-bold text-[#7d8a78] dark:text-[#b2bdae]">
                          <PinIcon className="h-4 w-4 text-[#273226] dark:text-[#e6efe3]" />
                          {product.village}
                        </p>
                        {product.whatsappUrl && (
                          <a
                            href={product.whatsappUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            aria-label={`Hubungi penjual ${product.title}`}
                            className="focus-ring grid h-8 w-8 place-items-center rounded-full bg-[#1dc95b] text-white transition hover:scale-110"
                          >
                            <WhatsAppIcon className="h-5 w-5" />
                          </a>
                        )}
                      </div>
                    </div>
                  </article>
                </StaggerItem>
              ))}
            </StaggerContainer>
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

    return {
      data: umkm.map(mapUmkmPreview),
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

async function loadArticlePreview(
  villageSlug?: VillageSlug,
): Promise<DataResult<ArticlePreview>> {
  try {
    const articles = await getArticles({ villageSlug, limit: 3 });

    return {
      data: articles.map(mapArticlePreview),
      error: null,
    };
  } catch (error) {
    return {
      data: [],
      error:
        error instanceof Error
          ? error.message
          : "Data artikel belum dapat dimuat saat ini.",
    };
  }
}

function mapUmkmPreview(umkm: Umkm): PreviewItem {
  return {
    id: umkm.id,
    title: umkm.name,
    category: "Produk Desa",
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

function mapArticlePreview(article: Article): ArticlePreview {
  return {
    id: article.id,
    title: article.title,
    description: article.description,
    articleUrl: article.article_url,
    date: formatDate(article.created_at),
    village: `Desa ${article.villages?.name ?? "Mangli"}`,
  };
}

function formatDate(value: string): string {
  return new Intl.DateTimeFormat("id-ID", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  }).format(new Date(value));
}

function DataMessage({ message }: { message: string }) {
  return (
    <div className="rounded-lg border border-[#d5ddd1] bg-[#f7f8f4] px-6 py-8 text-center text-base font-bold leading-7 text-[#536052] dark:border-[#344233] dark:bg-[#172017] dark:text-[#d4decf]">
      {message}
    </div>
  );
}

function Header({ village }: Required<VillagePageProps>) {
  const isAll = village === "all";
  const isMangli = village === "mangli";

  return (
    <AnimatedHeader>
      <div className="mx-auto flex h-24 items-center justify-between gap-6 px-6 md:px-10">
        <Logo />
        {isAll ? (
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
            <a
              href="#beranda"
              className="text-base font-black text-[#2e6b35] underline-offset-8 transition hover:underline dark:text-[#a9d8aa]"
            >
              Beranda
            </a>
            <Link
              href={isMangli ? "/mangli/umkm" : "/munggangsari/warung"}
              className="text-base font-black text-[#2e6b35] underline-offset-8 transition hover:underline dark:text-[#a9d8aa]"
            >
              {isMangli ? "UMKM" : "Warung"}
            </Link>
            <a
              href="#artikel"
              className="text-base font-black text-[#2e6b35] underline-offset-8 transition hover:underline dark:text-[#a9d8aa]"
            >
              Artikel
            </a>
            <a
              href="#potensi"
              className="text-base font-black text-[#2e6b35] underline-offset-8 transition hover:underline dark:text-[#a9d8aa]"
            >
              Potensi
            </a>
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
            className="inline-flex rounded-lg border border-[#ef8b00] px-4 py-2 text-sm font-black text-[#ef8b00] transition hover:bg-[#fff4e4] dark:hover:bg-white/10 md:px-5"
          >
            Sign In
          </Link>
          <ThemeToggle />
        </div>
      </div>
    </AnimatedHeader>
  );
}

function Footer() {
  return (
    <footer className="bg-white pt-12 transition-colors dark:bg-[#10150f]">
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
          <h3 className="text-xl font-black text-[#2e6b35] dark:text-[#8bc98c]">Tautan Cepat</h3>
          <ul className="mt-5 space-y-3 text-sm font-bold text-[#2e6b35] dark:text-[#a9d8aa]">
            <li>
              <a href="#potensi" className="footer-link">Tentang Kami</a>
            </li>
            <li>
              <a href="#umkm" className="footer-link">Kontak</a>
            </li>
          </ul>
        </div>
        <div>
          <h3 className="text-xl font-black text-[#2e6b35] dark:text-[#8bc98c]">Informasi</h3>
          <ul className="mt-5 space-y-3 text-sm font-bold text-[#2e6b35] dark:text-[#a9d8aa]">
            <li>
              <a href="#" className="footer-link">Kebijakan Privasi</a>
            </li>
          </ul>
        </div>
        <div>
          <h3 className="text-xl font-black text-[#2e6b35] dark:text-[#8bc98c]">Lokasi Kantor</h3>
          <div className="mt-5 space-y-7 text-sm font-semibold leading-6 text-[#9aa39a] dark:text-[#b2bdae]">
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
      <div className="border-t border-[#edf0eb] py-6 text-center text-xs font-bold text-[#2e6b35] dark:border-[#273425] dark:text-[#8bc98c]">
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
        className="h-12 w-auto"
      />
      <div className="leading-none">
        <p className="text-xl font-black text-[#2e6b35] dark:text-[#a9d8aa]">
          Mangli
          <br />
          Munggangsari
        </p>
        <p className="mt-1 text-[11px] font-black text-[#ef8b00]">
          Katalog Potensi Desa
        </p>
      </div>
    </Link>
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
