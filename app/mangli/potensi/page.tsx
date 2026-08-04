import Image from "next/image";
import { FadeIn } from "@/components/animations/FadeIn";
import { StaggerContainer } from "@/components/animations/StaggerContainer";
import { StaggerItem } from "@/components/animations/StaggerItem";
import {
  PublicFooter,
  PublicHeader,
  VillageSwitch,
} from "@/components/layout/public-site-shell";

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

const heroImage = "/images/mangli-potensi-thumb.webp";

const fallbackArticles: PotensiArticle[] = [
  {
    id: "fallback-terasering-sawah-1",
    title: "Menjelajahi UMKM Desa Mangli",
    description:
      "Usaha Mikro, Kecil, dan Menengah (UMKM) merupakan salah satu sektor yang berperan penting dalam meningkatkan perekonomian masyarakat, khususnya di wilayah pedesaan. Artikel ini bertujuan untuk memperkenalkan potensi UMKM yang berkembang di Desa Mangli, Kecamatan Kaliangkrik, Kabupaten Magelang, serta mengidentifikasi tantangan yang dihadapi dalam pengembangannya. Penulisan artikel dilakukan menggunakan pendekatan deskriptif kualitatif melalui observasi lapangan dan wawancara dengan pelaku UMKM. Hasil pembahasan menunjukkan bahwa Desa Mangli memiliki tiga UMKM unggulan, yaitu Taburica, Teh Mangli, dan Krisang Melte Banana Nano. Produk-produk tersebut memanfaatkan hasil pertanian lokal sebagai bahan baku utama dan sebagian besar berkembang melalui pelatihan yang diselenggarakan oleh Dinas Perindustrian dan Perdagangan Kabupaten Magelang, sementara sebagian lainnya tumbuh dari inisiatif masyarakat. Meskipun memiliki potensi yang besar, para pelaku UMKM masih menghadapi berbagai kendala, seperti keterbatasan pemasaran, rendahnya pemanfaatan teknologi digital, keterbatasan bahan baku, biaya distribusi, serta kondisi masyarakat yang lebih memprioritaskan sektor pertanian sebagai mata pencaharian utama. Namun demikian, UMKM Desa Mangli tetap mampu menghasilkan produk berkualitas yang mencerminkan potensi lokal dan kearifan masyarakat setempat. Oleh karena itu, diperlukan dukungan berkelanjutan dari berbagai pihak, baik pemerintah maupun masyarakat, untuk memperluas pemasaran, meningkatkan kapasitas pelaku usaha, serta menjaga keberlanjutan UMKM sebagai salah satu penggerak ekonomi dan identitas Desa Mangli.",
    articleUrl: "https://medium.com/@artikelofmangli/menjelajahi-umkm-desa-mangli-06adcb117398",
    image: "/images/mangli-article/UMKM.jpeg",
    category: "UMKM",
  },
  {
    id: "fallback-terasering-sawah-2",
    title: "Mengenal Budaya Bertani di Desa Mangli",
    description:
      "Budaya bertani merupakan bagian dari kehidupan masyarakat agraris yang mencerminkan perpaduan antara pengetahuan, kebiasaan, nilai, dan kearifan lokal yang diwariskan secara turun-temurun. Artikel ini bertujuan untuk memperkenalkan budaya bertani masyarakat Desa Mangli, Kecamatan Kaliangkrik, Kabupaten Magelang, serta menggambarkan keterkaitan antara aktivitas pertanian dengan tradisi yang masih dilestarikan. Penulisan artikel menggunakan pendekatan deskriptif kualitatif melalui observasi lapangan dan wawancara dengan masyarakat setempat. Hasil pembahasan menunjukkan bahwa sebagian besar masyarakat Desa Mangli menggantungkan mata pencaharian pada sektor pertanian hortikultura yang didukung oleh kondisi alam lereng Gunung Sumbing yang subur dan beriklim sejuk. Aktivitas pertanian dilakukan secara manual dengan memanfaatkan pengetahuan yang diwariskan antargenerasi, mulai dari pembibitan, pemeliharaan, hingga panen. Di samping itu, masyarakat masih mempertahankan berbagai tradisi pertanian, seperti pembuatan jenang merah putih sebelum masa tanam dan pemberian sesajen menjelang panen sebagai bentuk rasa syukur, penghormatan kepada leluhur, serta penghormatan terhadap Dewi Sri sebagai simbol kesuburan. Meskipun menghadapi berbagai tantangan, seperti gangguan satwa liar dan keterbatasan dalam pengelolaan pertanian, masyarakat tetap menjaga praktik pertanian yang selaras dengan lingkungan dan nilai budaya setempat. Budaya bertani di Desa Mangli menunjukkan bahwa pertanian tidak hanya berperan sebagai sumber penghidupan, tetapi juga menjadi identitas budaya yang mengandung nilai sosial, spiritual, dan kearifan lokal yang perlu dilestarikan.",
    articleUrl: "https://medium.com/@artikelofmangli/mengenal-budaya-bertani-di-desa-mangli-586a14ef6f7b",
    image: "/images/mangli-article/Pertanian.jpeg",
    category: "Pertanian",
  },
  {
    id: "fallback-terasering-sawah-3",
    title: "Menjelajahi Pesona Terasering Sawah Mangli: Warisan Abadi Sang Petani",
    description:
      "Desa Mangli, Kecamatan Kaliangkrik, Kabupaten Magelang, tidak hanya dikenal karena keindahan alam dan potensi pertaniannya, tetapi juga memiliki kekayaan tradisi dan kesenian yang masih dilestarikan oleh masyarakat hingga saat ini. Artikel ini bertujuan untuk mendokumentasikan serta memperkenalkan berbagai tradisi dan kesenian yang menjadi identitas budaya masyarakat Desa Mangli sebagai bagian dari upaya pelestarian warisan budaya lokal. Metode yang digunakan dalam penyusunan artikel ini meliputi observasi lapangan, wawancara dengan masyarakat dan tokoh desa, serta studi literatur yang relevan. Hasil dokumentasi menunjukkan bahwa masyarakat Desa Mangli masih secara konsisten melaksanakan berbagai tradisi, seperti Kenduren, Merti Dusun, dan Wedus Kendit, yang mengandung nilai religius, gotong royong, rasa syukur, serta solidaritas sosial. Selain itu, berbagai kesenian tradisional, seperti Tari Angguk, Topeng Ireng, Jaranan, Kubro Siswo, dan Sandulan, juga masih aktif dipentaskan dalam berbagai kegiatan desa sebagai bentuk pelestarian budaya sekaligus media pewarisan nilai-nilai kepada generasi muda. Keberlangsungan tradisi dan kesenian tersebut menunjukkan tingginya kesadaran masyarakat dalam menjaga identitas budaya di tengah perkembangan zaman. Oleh karena itu, dokumentasi dan publikasi mengenai kekayaan budaya Desa Mangli diharapkan dapat meningkatkan apresiasi masyarakat terhadap warisan budaya lokal serta menjadi salah satu upaya untuk mendukung pelestarian budaya yang berkelanjutan.",
    articleUrl: "#",
    image: "/images/mangli-article/Tradisi.jpeg",
    category: "Tradisi",
  },
];

export default async function MangliPotensiPage() {
  const articleResult = loadPotensiArticles();

  return (
    <main className="min-h-screen overflow-x-hidden bg-white text-[#111711] transition-colors dark:bg-[#10150f] dark:text-[#f5f7f2]">
      <PublicHeader village="mangli" mode="potensi" />

      <section className="relative min-h-[420px] overflow-hidden bg-[#142415] text-white md:min-h-[620px]">
        <Image
          src={heroImage}
          alt="Pemandangan potensi wisata Desa Mangli"
          fill
          priority
          unoptimized
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
                        unoptimized
                        className="object-cover"
                        sizes="(min-width: 768px) 42vw, 100vw"
                      />
                    </div>
                    <div className="flex flex-col px-1 pb-3 md:px-0 md:py-3">
                      <span className="w-fit rounded-full bg-[#bdeec0] px-3 py-1 text-[0.62rem] font-black uppercase text-[#2e6b35] md:text-xs">
                        {article.category}
                      </span>
                      <p className="mt-3 line-clamp-3 xl:line-clamp-9 text-sm font-semibold leading-6 text-[#6f7b70] md:max-w-2xl md:text-base md:leading-7 dark:text-[#c5d0c1]">
                        {article.description}
                      </p>
                      <a
                        href={article.articleUrl}
                        target={article.articleUrl === "#" ? undefined : "_blank"}
                        rel={article.articleUrl === "#" ? undefined : "noopener noreferrer"}
                        className="btn-motion focus-ring mt-5 inline-flex h-9 w-fit items-center gap-3 rounded-lg bg-[#2e6b35] px-6 text-xs font-black text-white transition hover:bg-[#25572b]"
                      >
                        Baca Artikel
                        <ArrowRightIcon className="motion-arrow h-4 w-4" />
                      </a>
                    </div>
                  </article>
                </StaggerItem>
              ))}
            </StaggerContainer>
          )}
        </div>
      </section>

      <section className="relative overflow-hidden bg-[#23672d] py-12 text-white md:py-16 dark:bg-[#1c4d25]">
        <div className="absolute inset-0 opacity-10 [background-image:linear-gradient(135deg,#ffffff_1px,transparent_1px)] [background-size:18px_18px]" />
        <FadeIn className="relative mx-auto flex max-w-3xl flex-col items-center gap-6 px-6 text-center">
          <a
            href="https://medium.com/@artikelofmangli"
            className="btn-motion focus-ring inline-flex h-12 items-center justify-center gap-3 rounded-xl border border-white px-7 text-sm font-black text-white transition hover:bg-white/10"
          >
            Ikuti Komunitas Artikel Desa Mangli
            <ArrowRightIcon className="motion-arrow h-5 w-5" />
          </a>
          <p className="max-w-xl text-sm font-semibold leading-6 text-white/78">
            Jelajahi setiap cerita, temukan setiap potensi, dan kenali Desa Mangli lebih dekat melalui artikel pilihan.
          </p>
        </FadeIn>
      </section>

      <FadeIn>
        <PublicFooter />
      </FadeIn>
    </main>
  );
}

function loadPotensiArticles(): ArticleResult {
  return {
    data: fallbackArticles,
    error: null,
  };
}

function DataMessage({ message }: { message: string }) {
  return (
    <div className="rounded-lg border border-[#d5ddd1] bg-[#f7f8f4] px-6 py-8 text-center text-base font-bold leading-7 text-[#536052] dark:border-[#344233] dark:bg-[#172017] dark:text-[#d4decf]">
      {message}
    </div>
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
