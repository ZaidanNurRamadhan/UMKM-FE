import Image from "next/image";
import { FadeIn } from "@/components/animations/FadeIn";
import { StaggerContainer } from "@/components/animations/StaggerContainer";
import { StaggerItem } from "@/components/animations/StaggerItem";
import {
  PublicFooter,
  PublicHeader,
  VillageSwitch,
} from "@/components/layout/public-site-shell";
import { getArticles } from "@/services/article.service";
import type { Article } from "@/types/database";

export const dynamic = "force-dynamic";

type IconProps = {
  className?: string;
};

type PotensiArticle = {
  id: string;
  title: string;
  description: string;
  articleUrl: string;
  image: string;
  category: string;
};

type ArticleResult = {
  data: PotensiArticle[];
  error: string | null;
};

const heroImage = "/images/mangli-potensi.png";

const fallbackArticles: PotensiArticle[] = [
  {
    id: "fallback-terasering-sawah-1",
    title: "Menjelajahi Pesona Terasering Sawah Mangli: Warisan Abadi Sang Petani",
    description:
      "Desa Mangli dikenal dengan bentang alamnya yang memukau. Terasering sawah di sini bukan sekadar pemandangan indah, melainkan bukti ketangguhan sistem irigasi tradisional yang telah diwariskan turun-temurun.",
    articleUrl: "#",
    image: heroImage,
    category: "Agrowisata",
  },
  {
    id: "fallback-terasering-sawah-2",
    title: "Menjelajahi Pesona Terasering Sawah Mangli: Warisan Abadi Sang Petani",
    description:
      "Desa Mangli dikenal dengan bentang alamnya yang memukau. Terasering sawah di sini bukan sekadar pemandangan indah, melainkan bukti ketangguhan sistem irigasi tradisional yang telah diwariskan turun-temurun.",
    articleUrl: "#",
    image: heroImage,
    category: "Agrowisata",
  },
  {
    id: "fallback-terasering-sawah-3",
    title: "Menjelajahi Pesona Terasering Sawah Mangli: Warisan Abadi Sang Petani",
    description:
      "Desa Mangli dikenal dengan bentang alamnya yang memukau. Terasering sawah di sini bukan sekadar pemandangan indah, melainkan bukti ketangguhan sistem irigasi tradisional yang telah diwariskan turun-temurun.",
    articleUrl: "#",
    image: heroImage,
    category: "Agrowisata",
  },
  {
    id: "fallback-terasering-sawah-4",
    title: "Menjelajahi Pesona Terasering Sawah Mangli: Warisan Abadi Sang Petani",
    description:
      "Desa Mangli dikenal dengan bentang alamnya yang memukau. Terasering sawah di sini bukan sekadar pemandangan indah, melainkan bukti ketangguhan sistem irigasi tradisional yang telah diwariskan turun-temurun.",
    articleUrl: "#",
    image: heroImage,
    category: "Agrowisata",
  },
];

export default async function MangliPotensiPage() {
  const articleResult = await loadPotensiArticles();

  return (
    <main className="min-h-screen overflow-x-hidden bg-white text-[#111711] transition-colors dark:bg-[#10150f] dark:text-[#f5f7f2]">
      <PublicHeader village="mangli" mode="potensi" />

      <section className="relative min-h-[420px] overflow-hidden bg-[#142415] text-white md:min-h-[620px]">
        <Image
          src={heroImage}
          alt="Pemandangan potensi wisata Desa Mangli"
          fill
          priority
          className="object-cover"
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-[#07120c]/54" />
        <div className="absolute inset-0 bg-gradient-to-b from-black/10 via-black/20 to-black/44 md:bg-gradient-to-r md:from-black/72 md:via-black/36 md:to-black/8" />
        <div className="absolute left-0 right-0 top-3 z-10 flex justify-center px-6 md:hidden">
          <VillageSwitch village="mangli" />
        </div>
        <div className="relative flex min-h-[420px] flex-col justify-center px-6 pt-12 md:min-h-[620px] md:px-[40px] md:pt-0">
          <FadeIn className="max-w-[330px] md:max-w-3xl">
            <h1 className="text-[2.25rem] font-black leading-[0.98] md:text-6xl lg:text-7xl">
              Potensi & Cerita
              <br />
              Desa Mangli
            </h1>
            <p className="mt-5 max-w-[320px] text-[0.74rem] font-semibold leading-5 text-white/86 md:mt-8 md:max-w-2xl md:text-lg md:leading-8">
              Menyingkap keindahan alam dan kearifan lokal di kaki lereng
              pegunungan, tempat tradisi dan inovasi berpadu harmonis.
            </p>
          </FadeIn>
        </div>
      </section>

      <section className="bg-white py-14 md:py-20 dark:bg-[#10150f]">
        <div className="px-5 md:px-[40px]">
          {articleResult.error ? (
            <DataMessage message={articleResult.error} />
          ) : (
            <StaggerContainer className="space-y-8">
              {articleResult.data.map((article) => (
                <StaggerItem key={article.id}>
                  <article className="grid gap-4 overflow-hidden rounded-2xl border border-[#dce4d8] bg-white p-3 shadow-[0_5px_0_rgb(20_29_19/0.25)] md:grid-cols-[0.72fr_1fr] md:gap-5 dark:border-[#354532] dark:bg-[#172017] dark:shadow-black/40">
                    <div className="relative aspect-[1.55] overflow-hidden rounded-xl bg-[#e8ece4]">
                      <Image
                        src={article.image}
                        alt={article.title}
                        fill
                        className="object-cover"
                        sizes="(min-width: 768px) 42vw, 100vw"
                      />
                    </div>
                    <div className="flex flex-col px-1 pb-3 md:px-0 md:py-3">
                      <span className="w-fit rounded-full bg-[#bdeec0] px-3 py-1 text-[0.62rem] font-black uppercase text-[#2e6b35] md:text-xs">
                        {article.category}
                      </span>
                      <h2 className="mt-3 text-lg font-black uppercase leading-tight text-[#2e6b35] md:text-2xl lg:text-3xl dark:text-[#8bc98c]">
                        {article.title}
                      </h2>
                      <p className="mt-3 line-clamp-4 text-sm font-semibold leading-6 text-[#6f7b70] md:max-w-2xl md:text-base md:leading-7 dark:text-[#c5d0c1]">
                        {article.description}
                      </p>
                      <a
                        href={article.articleUrl}
                        target={article.articleUrl === "#" ? undefined : "_blank"}
                        rel={article.articleUrl === "#" ? undefined : "noopener noreferrer"}
                        className="btn-motion focus-ring mt-5 inline-flex h-9 w-fit items-center gap-3 rounded-lg bg-[#2e6b35] px-6 text-xs font-black text-white transition hover:bg-[#25572b]"
                      >
                        Lihat Semua Artikel
                        <ArrowRightIcon className="motion-arrow h-4 w-4" />
                      </a>
                    </div>
                  </article>
                </StaggerItem>
              ))}
            </StaggerContainer>
          )}
          <Pagination />
        </div>
      </section>

      <section className="relative overflow-hidden bg-[#23672d] py-12 text-white md:py-16 dark:bg-[#1c4d25]">
        <div className="absolute inset-0 opacity-10 [background-image:linear-gradient(135deg,#ffffff_1px,transparent_1px)] [background-size:18px_18px]" />
        <FadeIn className="relative mx-auto flex max-w-3xl flex-col items-center gap-6 px-6 text-center">
          <a
            href="#"
            className="btn-motion focus-ring inline-flex h-12 items-center justify-center gap-3 rounded-xl border border-white px-7 text-sm font-black text-white transition hover:bg-white/10"
          >
            Ikuti Komunitas Artikel Desa Mangli
            <ArrowRightIcon className="motion-arrow h-5 w-5" />
          </a>
          <p className="max-w-xl text-sm font-semibold leading-6 text-white/78">
            Jadilah yang pertama mengetahui rilis produk UMKM baru, festival
            desa, dan promo khusus langsung.
          </p>
        </FadeIn>
      </section>

      <FadeIn>
        <PublicFooter route="/mangli" />
      </FadeIn>
    </main>
  );
}

async function loadPotensiArticles(): Promise<ArticleResult> {
  try {
    const articles = await getArticles({ villageSlug: "mangli", limit: 4 });

    return {
      data: fillArticles(articles.map(mapArticle)),
      error: null,
    };
  } catch (error) {
    return {
      data: fallbackArticles,
      error:
        error instanceof Error
          ? error.message
          : "Data artikel belum dapat dimuat saat ini.",
    };
  }
}

function mapArticle(article: Article): PotensiArticle {
  return {
    id: article.id,
    title: article.title,
    description: article.description,
    articleUrl: article.article_url,
    image: heroImage,
    category: "Agrowisata",
  };
}

function fillArticles(articles: PotensiArticle[]): PotensiArticle[] {
  if (articles.length >= 4) {
    return articles;
  }

  return [...articles, ...fallbackArticles].slice(0, 4);
}

function DataMessage({ message }: { message: string }) {
  return (
    <div className="rounded-lg border border-[#d5ddd1] bg-[#f7f8f4] px-6 py-8 text-center text-base font-bold leading-7 text-[#536052] dark:border-[#344233] dark:bg-[#172017] dark:text-[#d4decf]">
      {message}
    </div>
  );
}

function Pagination() {
  return (
    <nav
      className="mt-8 flex items-center justify-center gap-2 text-sm font-bold text-[#2e6b35]"
      aria-label="Navigasi halaman potensi"
    >
      <button className="grid h-9 w-9 place-items-center rounded-lg border border-[#d5ddd1] bg-white shadow-sm" aria-label="Halaman sebelumnya">
        <ChevronLeftIcon className="h-5 w-5" />
      </button>
      <button className="grid h-9 w-9 place-items-center rounded-lg bg-[#2e6b35] text-white">1</button>
      <button className="grid h-9 w-9 place-items-center rounded-lg border border-[#d5ddd1] bg-white shadow-sm">2</button>
      <button className="grid h-9 w-9 place-items-center rounded-lg border border-[#d5ddd1] bg-white shadow-sm">3</button>
      <span className="px-1 text-[#7d8a78]">...</span>
      <button className="grid h-9 w-9 place-items-center rounded-lg border border-[#d5ddd1] bg-white shadow-sm">10</button>
      <button className="grid h-9 w-9 place-items-center rounded-lg border border-[#d5ddd1] bg-white shadow-sm" aria-label="Halaman berikutnya">
        <ChevronRightIcon className="h-5 w-5" />
      </button>
    </nav>
  );
}

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
