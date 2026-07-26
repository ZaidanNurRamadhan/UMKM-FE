"use client";

import Image from "next/image";
import { useEffect, useMemo, useState } from "react";
import { FadeIn } from "@/components/animations/FadeIn";
import { PublicHeader, VillageSwitch, PublicFooter } from "@/components/layout/public-site-shell";

type ArchiveImage = {
  src: string;
  caption: string;
};

type ArticleBlock =
  | { type: "paragraph"; text: string }
  | { type: "images"; indexes: number[]; layout?: "single" | "pair" | "gallery" };

type ArticleSection = {
  id: string;
  heading: string;
  blocks: ArticleBlock[];
};

const imageBase = "/images/munggangsari-waterfall";

const archiveImages: ArchiveImage[] = [
  {
    src: `${imageBase}/air-terjun-munggangsari-01.webp`,
    caption:
      "Gambar 1. Potret terkini Curug Si Kembang (Sumber: Dokumentasi Pribadi)",
  },
  {
    src: `${imageBase}/air-terjun-munggangsari-02.webp`,
    caption:
      "Gambar 2. Potret Terkini Curug Si Kembang (Sumber: Dokumentasi Pribadi)",
  },
  {
    src: `${imageBase}/air-terjun-munggangsari-03.webp`,
    caption:
      "Gambar 3. Potret Curug Si Kembang dengan sampah yang berserakan di sekitarnya (Sumber: Dokumentasi Pribadi)",
  },
  {
    src: `${imageBase}/air-terjun-munggangsari-04.webp`,
    caption:
      "Gambar 4. Potret sampah di Curug Si Kembang (Sumber: Dokumentasi Pribadi)",
  },
  {
    src: `${imageBase}/air-terjun-munggangsari-05.webp`,
    caption:
      "Gambar 5. Potret sampah di sepanjang aliran air terjun (Sumber: Dokumentasi Pribadi)",
  },
  {
    src: `${imageBase}/air-terjun-munggangsari-06.webp`,
    caption:
      "Gambar 6. Potret aliran air terjun yang semakin mengecil, dilihat dari kosongnya bebatuan basah di kanan kiri aliran (batu yang biasa dialiri air, tidak teraliri) (Sumber: Dokumentasi Pribadi)",
  },
  {
    src: `${imageBase}/air-terjun-munggangsari-07.webp`,
    caption:
      "Gambar 7. Potret akses jalan yang terhalang reruntuhan bambu (Sumber: Dokumentasi Pribadi)",
  },
  {
    src: `${imageBase}/air-terjun-munggangsari-08.webp`,
    caption:
      "Gambar 8. Potret akses jalan untuk melihat Curug Si Gentong, Curug Silawe, dan Curug Si Prengus yang terhalang reruntuhan bambu (Sumber: Dokumentasi Pribadi)",
  },
  {
    src: `${imageBase}/air-terjun-munggangsari-09.webp`,
    caption:
      "Gambar 9. Akses jalan menuju Curug Si Gentong, Curug Silawe, dan Curug Si Prengus (Sumber: Dokumentasi Pribadi)",
  },
  {
    src: `${imageBase}/air-terjun-munggangsari-10.webp`,
    caption:
      "Gambar 10. Akses jalan untuk melihat Curug Si Pregus, di sisi kiri jalan adalah jurang (Sumber: Dokumentasi Pribadi)",
  },
  {
    src: `${imageBase}/air-terjun-munggangsari-11.webp`,
    caption:
      "Gambar 11. Jalan menuju Curug Si Gentong, Curug Siawe, dan Curug Si Prengus melalui pipa air (Sumber: Dokumentasi Pribadi)",
  },
  {
    src: `${imageBase}/air-terjun-munggangsari-12.webp`,
    caption:
      "Gambar 12 & 13. Kiri merupakan Curug Si Kembang pada zaman dulu (sumber: arsip warga setempat) dan kanan adalah potret Si Kembang saat ini (sumber: dokumentasi pribadi)",
  },
  {
    src: `${imageBase}/air-terjun-munggangsari-13.webp`,
    caption:
      "Gambar 12 & 13. Kiri merupakan Curug Si Kembang pada zaman dulu (sumber: arsip warga setempat) dan kanan adalah potret Si Kembang saat ini (sumber: dokumentasi pribadi)",
  },
  {
    src: `${imageBase}/air-terjun-munggangsari-14.webp`,
    caption:
      "Gambar 14, 15, & 16. Kiri merupakan foto jembatan di Curug Si Kembang pada masa dulu (sumber: arsip warga setempat) dan kanan merupakan foto jembatan di Curug Si Kembang saat ini (sumber: dokumentasi pribadi)",
  },
  {
    src: `${imageBase}/air-terjun-munggangsari-15.webp`,
    caption:
      "Gambar 14, 15, & 16. Kiri merupakan foto jembatan di Curug Si Kembang pada masa dulu (sumber: arsip warga setempat) dan kanan merupakan foto jembatan di Curug Si Kembang saat ini (sumber: dokumentasi pribadi)",
  },
  {
    src: `${imageBase}/air-terjun-munggangsari-16.webp`,
    caption:
      "Gambar 14, 15, & 16. Kiri merupakan foto jembatan di Curug Si Kembang pada masa dulu (sumber: arsip warga setempat) dan kanan merupakan foto jembatan di Curug Si Kembang saat ini (sumber: dokumentasi pribadi)",
  },
  {
    src: `${imageBase}/air-terjun-munggangsari-17.webp`,
    caption:
      "Gambar 17 & 18. Potret Curug Si Gentong, Curug Siawe, dan Curug Si Prengus jaman dulu. Saat ini akses menuju air terjun tersebut sudah tidak ada karena longsor dan runtuhan bambu (sumber: arsip warga setempat)",
  },
  {
    src: `${imageBase}/air-terjun-munggangsari-18.webp`,
    caption:
      "Gambar 17 & 18. Potret Curug Si Gentong, Curug Siawe, dan Curug Si Prengus jaman dulu. Saat ini akses menuju air terjun tersebut sudah tidak ada karena longsor dan runtuhan bambu (sumber: arsip warga setempat)",
  },
];

const sections: ArticleSection[] = [
  {
    id: "potensi-alam-air-terjun-di-desa-munggangsari",
    heading: "Potensi Alam Air Terjun di Desa Munggangsari",
    blocks: [
      {
        type: "paragraph",
        text: "Pada ketinggian lebih dari 1200 mdpl di lereng Gunung Sumbing, sebuah desa berdiri dengan beragam kekayaan alam dan budayanya. Desa Munggangsari, desa yang terletak di Kecamatan Kaliangkrik, Kabupaten Magelang ini menyimpan keindahan alam luar biasa. Kondisi geografis membuat desa ini dikaruniai tanah subur, udara sejuk, dan beragam jenis flora. Tidak hanya hamparan ladang hortikultura, desa ini juga menyimpan potensi alam luar biasa lainnya yang tidak kalah indah. Potensi itu berupa adanya enam air terjun, dua goa, dan satu sumber mata air Gunung Sumbing di desa ini. Suatu karunia Tuhan luar biasa untuk Desa Munggangsari karena masyarakat tidak hanya dapat menikmati keindahan alam, tetapi juga dapat memanfaatkan dan mengembangkannya menjadi satu sarana pendongkrak perekonomian desa.",
      },
      {
        type: "paragraph",
        text: "Desa Munggangsari terdiri dari tiga dusun, yakni Dusun Munggangsari, Dusun Kwayuhan, dan Dusun Derepan. Kesembilan potensi alam yang telah disebut sebelumnya, terletak di Dusun Munggangsari. Kesembilan potensi itu diantaranya enam air terjun, dua goa, dan satu sumber mata air. Uniknya, setiap potensi alam memiliki kisahnya masing-masing dan dipercayai oleh masyarakat setempat. Kebanyakan nama dari air terjun dan goa itu juga diambil dari intisari kisah mereka. Menurut kesaksian salah satu warga bernama Sunaryo (Mantan Ketua Pengelola Air Terjun), setiap air terjun dan goa yang ada memiliki kisah dengan dua versi berbeda. Satu kisah merupakan cerita yang dapat dikonsumsi publik dan kisah lainnya merupakan cerita yang hanya diketahui masyarakat setempat.",
      },
    ],
  },
  {
    id: "macam-macam-air-terjun-di-desa-munggangsari",
    heading: "Macam-Macam Air Terjun di Desa Munggangsari",
    blocks: [
      {
        type: "paragraph",
        text: "Air terjun atau curug–begitu masyarakat setempat menyebutnya– di Dusun Munggangsari terbagi menjadi dua aliran. Lima air terjun berada di satu aliran yang sama dan satu air terjun lainnya berada di rangkaian aliran lain yang sama dengan sumber mata air Gunung Sumbing. Adapun air terjun di Dusun Munggangsari terdiri dari Curug Si Gentong, Curug Waton, Curug Si Prengus, Curug Si Kembang, Curug Silawe, dan Curug Sriwedari. Selanjutnya, dua goa di Dusun Munggangsari terdiri dari Goa Sriti dan Goa Jaran. Adapun sumber mata air di dusun ini, disebut sebagai sumber mata air ajaib karena dipercayai oleh masyarakat setempat, air di sumber ini dapat menyembuhkan beberapa penyakit.",
      },
      {
        type: "paragraph",
        text: "Curug Si Kembang dijuluki ‘kembang’ karena air yang terjun menyebar dan membentuk bunga (kembang) ketika jatuh dari atas tebing. Namun, air terjun ini kerap pula dijuluki sebagai Curug Si Jago karena terdapat tempat pertapaan seorang dari keraton yang bernama Ki Sawunggalih. Kisahnya Ki Sawunggalih bertapa di tempat ini terlalu lama dan menghilang tanpa diketahui orang. Ki Sawunggalih tidak terlihat kepergiannya dan tidak ada jasadnya pula. Maka sebenarnya, Si Kembang adalah nama air terjunnya dan Si Jago adalah nama tempat pertapaan Ki Sawunggalih.",
      },
      { type: "images", indexes: [0, 1], layout: "pair" },
      {
        type: "paragraph",
        text: "Selanjutnya terdapat Curug Silawe yang pada dasarnya diambil dari kata selawe dalam bahasa jawa yang berarti 25 (dua puluh lima). Sebelum tertutupi oleh lumut atau rerumputan, terdapat retakan tebing yang sekilas terlihat menyerupai angka 25. Konon terdapat benda-benda pusaka di air terjun tersebut. Dahulu pula terdapat semacam angsa yang banyak bertelur di air terjun tersebut. Baik angsa maupun telurnya sama-sama menyerupai emas. Curug Silawe pada dasarnya bersebelahan dengan dua air terjun lainnya, yakni Curug Si Gentong dan Curug Si Prengus. Jadi, ketiga air terjun ini bersebelahan atau terjun di ketinggian yang kurang lebih sama. Curug Si Gentong dinamai demikian karena di atas air terjun ini, atau tepatnya sebelum air terjun ke bawah, terdapat semacam gentong yang terletak di bebatuan atau watu kemloso. Sebelum ada bencana alam, gentong di air terjun ini dapat menenggelamkan satu potong bambu yang tingginya lebih dari 3 meter. Namun, setelah adanya bencana alam dan tertimbun bebatuan, kedalaman gentong hanya mencapai 2 - 3 meter saja. Adapun Curug Si Prengus dipercayai bahwa penghuninya buang kotoran di tempat itu dan tidak mau pergi sehingga tercium bau prengus. Akan tetapi, bau ini hanya muncul terkadang. Masyarakat percaya bahwa tanda penghuni air terjun buang kotoran adalah ketika tercium bau prengus atau bau menyengat. Satu air terjun lain yang masih berada di satu aliran adalah Curug Waton. Air terjun dinamai demikian karena tebing air terjun merupakan bebatuan yang sangat besar dan disebut oleh masyarakat setempat sebagai watu kemloso.",
      },
      {
        type: "paragraph",
        text: "Curug Sriwedari menjadi air terjun terakhir yang berada di aliran berbeda, akan tetapi satu rangkaian aliran dengan sumber mata air ajaib. Air terjun ini disebut Sriwedari karena terdapat penghuni tertua yang menyerupai wanita dan disebut oleh masyarakat dengan nama Sriwedari. Adapun sumber mata air Gunung Sumbing di Dusun Munggangsari, disebut ajaib karena beberapa hal. Pertama bahwa faktanya air pada sumber mata air ini muncul dari atas, bukan dari bawah tanah. Padahal sumber mata air ini dikelilingi oleh tanah gundul untuk pertanian. Kedua bahwa mata air ini diyakini dapat menyembuhkan penyakit, diantaranya asma dan gatal-gatal. Penyakit asma sembuh dengan memakan mentah-mentah berudu di mata air ini yang tubuhnya bening atau transparan dan terlihat organ dalam perutnya. Selain asma, air pada mata air ini dipercaya dapat menyembuhkan gatal-gatal kulit dengan cara mandi di sana. Secara ilmiah, disampaikan oleh Bapak Sunaryo (Mantan Ketua Pengelola Air Terjun) bahwa pada kedalaman air ini terdapat logam. Maka, pada dasarnya air ini bersih dan mengandung logam sehingga dapat mematikan kuman.",
      },
    ],
  },
  {
    id: "macam-macam-goa-di-desa-munggangsari",
    heading: "Macam-Macam Goa di Desa Munggangsari",
    blocks: [
      {
        type: "paragraph",
        text: "Potensi alam lainnya adalah Goa Sriti dan Goa Jaran. Goa Sriti digunakan sebagai tempat pertapaan. Tanda bahwa pertapaan dan permintaan seseorang diterima dan dikabulkan adalah ia bisa keluar goa di desa lain meskipun pada mulanya masuk melalui pintu goa di Desa Munggangsari. Pada goa ini, dipercaya terdapat ular yang melilit pusaka di dalamnya. Ketika seseorang melakukan pertapaan dan perjalanan masuk hingga keluar goa, mereka membedakan waktu siang dan malam melalui suara getaran atap goa. Apabila terdapat suara ‘dung!’ ‘dung!’ ‘dung!’ yang berasal dari atap goa, itu artinya siang karena suara tersebut menandakan adanya manusia yang melewati atas goa. Sementara itu, waktu malam ditandai dengan adanya suara percikan air saja tanpa ada suara getaran dari atap goa. Adapun Goa Jaran dinamai demikian karena goa ini berupa batu besar yang membentuk seperti punggung kuda. Goa ini juga beberapa kali dijadikan tempat pertapaan dan cukup untuk 5 - 6 orang berteduh. Akan tetapi setelah tertimbun bebatuan kecil, goa ini tinggal nama saja dan tidak dapat digunakan berteduh lagi.",
      },
    ],
  },
  {
    id: "problematika-pengembangan-wisata",
    heading: "Problematika Pengembangan Wisata",
    blocks: [
      {
        type: "paragraph",
        text: "Potensi alam yang melimpah tersebut sayangnya belum dimanfaatkan dengan baik hingga saat ini. Pada mulanya air terjun sempat dikembangkan menjadi objek wisata. Namun, karena sejumlah problematika, air terjun kemudian ditinggalkan dan tidak diurus kembali. Berbicara mengenai sejarah pengelolaannya, Desa Munggangsari sudah sempat membentuk dan mengembangkan Kelompok Sadar Wisata untuk mengelola air terjun tersebut. Perlu diketahui bahwa Curug Si Kembang dan Silawe berada di antara Desa Munggangsari dan Desa Ngargosoko. Pada sejarahnya, telah dibuka akses jalan yang melewati tanah milik Desa Munggangsari untuk menuju ke air terjunnya. Selain memperhatikan sumber daya manusia dan akses jalan, sempat dibuat pula fasilitas loket untuk masuk ke wisata. Menurut pernyataan Bapak Sunaryo (Mantan Ketua Pengelola Air Terjun), wisata air terjun sempat ramai pengunjung. Dalam waktu bersamaan, kunjungan ke wisata air terjun ini menambah pendapatan petani karena hasil panen mereka dibeli oleh pengunjung.",
      },
      {
        type: "paragraph",
        text: "Namun, dalam perjalanan pengembangannya, wisata air terjun di desa ini mengalami sejumlah kendala sampai pada akhirnya tidak terurus hingga sekarang. Kelompok Sadar Wisata yang sempat dibentuk sudah tidak aktif sejak lama, tidak ada loket masuk, dan tidak ada lagi wisatawan yang berkunjung. Aksesibilitas menuju air terjun semakin terbatas karena tertimbun tanah serta reruntuhan bambu karena bencana alam longsor. Hingga saat ini, hanya ada satu air terjun yang masih dapat diakses, yakni Curug Si Kembang. Selain itu, sungai yang menjadi hulu air terjun telah dipenuhi oleh sampah rumah tangga yang dibuang masyarakat. Pada saat aliran air deras, maka sampah-sampah tersebut ikut mengalir ke air terjun. Pada akhirnya, air terjun tercemari sampah. Jenis sampah yang mencemari sungai dan air terjun di desa ini berupa plastik, kain, dan sampah rumah tangga lainnya. Dampak bagi ekologis berupa tercemarnya lingkungan, termasuk air terjun yang seharusnya dapat dikembangkan menjadi wisata asri, mengurangi estetika, dan menyebabkan bau tidak sedap.",
      },
      { type: "images", indexes: [2, 3], layout: "pair" },
      { type: "images", indexes: [4], layout: "single" },
      {
        type: "paragraph",
        text: "Selain masalah sampah, air di hulu aliran sungai cenderung diambil oleh masyarakat untuk mengairi ladang dan keperluan sehari-hari. Sejumlah polemik tersebut kemudian menyebabkan berkurangnya volume air terjun. Pada akhirnya, air yang jatuh ke bawah menjadi air terjun tidak seindah saat dulu. Kondisi terkini, air terjun akan kering ketika mendekati musim kemarau dan hanya tersisa tebing saja.",
      },
      { type: "images", indexes: [5], layout: "single" },
      {
        type: "paragraph",
        text: "Pada dasarnya esensi dari air terjun adalah air itu sendiri. Apabila debit air semakin berkurang bahkan habis ketika musim kemarau, maka nilai jual dari air terjun tersebut pun hilang. Masalah debit air ini barangkali berasal dari polemik sampah yang belum ditemukan pemecahan masalahnya di Desa Munggangsari. Selain itu juga karena pemanfaatan atau pengambilan air langsung dari tuk atau hulu aliran sungai oleh masyarakat. Problematika ini perlu diselesaikan terlebih dahulu sebelum wisata air terjun kembali dihidupkan. Namun, masih ada problematika lain yang mana satu-satunya air terjun yang dapat diakses hanya Curug Si Kembang. Akses untuk ke air terjun lain hilang karena bencana alam longsor dan robohnya bambu-bambu secara tidak beraturan. Kurangnya sumber daya manusia dan kurangnya dana menjadi prioritas lain yang perlu dipikirkan solusinya.",
      },
      { type: "images", indexes: [6, 7], layout: "pair" },
      { type: "images", indexes: [8, 9, 10], layout: "gallery" },
    ],
  },
  {
    id: "rekomendasi-pemecahan-masalah-wisata",
    heading: "Rekomendasi Pemecahan Masalah Wisata",
    blocks: [
      {
        type: "paragraph",
        text: "Dalam rangka mendukung pengembangan kembali pariwisata air terjun, perlu adanya pemecahan masalah dari hulu. Pencemaran air terjun dan kurangnya debit air adalah dampak dari pembuangan sampah sembarangan oleh masyarakat. Tidak terkelolanya sampah merupakan polemik hulu yang perlu dipecahkan lebih dulu sebelum mengambil langkah untuk pengembangan wisata air terjun. Maka, pada dasarnya perlu dipikirkan solusi pengelolaan sampah di Desa Munggangsari. Bersamaan ini, penulis juga merekomendasikan untuk dilakukan revitalisasi alam menjadi hijau kembali. Revitalisasi ini memerlukan sinergi dari seluruh pihak, baik masyarakat dan perangkat desa hingga pemerintah pusat. Revitalisasi alam termasuk pula di dalamnya air terjun. Baru setelahnya dapat dipertimbangkan untuk mengembangkan lokasi air terjun agar lebih layak diakses dan dikunjungi sebagai tempat wisata. Poin terpenting dalam pengembangan dan peningkatan wisata air terjun ini adalah sumber daya manusia. Kelompok Sadar Wisata sangat perlu untuk dibentuk agar perkembangan air terjun dapat terawasi. Selain itu, perlu adanya dukungan dari Perangkat Desa dan pemerintah Kabupaten serta Provinsi untuk mengembangkan potensi alam luar biasa dari Desa Munggangsari. Berikut ini perbandingan air terjun pada masa kini dan jaman dulu.",
      },
    ],
  },
];

const tocItems = sections.map(({ id, heading }) => ({ id, heading }));

export function MunggangsariArchiveClient() {
  const [activeSection, setActiveSection] = useState(tocItems[0].id);
  const [activeImage, setActiveImage] = useState<number | null>(null);
  const currentImage = useMemo(
    () => (activeImage === null ? null : archiveImages[activeImage]),
    [activeImage],
  );

  useEffect(() => {
    const sectionNodes = tocItems
      .map((item) => document.getElementById(item.id))
      .filter((node): node is HTMLElement => Boolean(node));

    const observer = new IntersectionObserver(
      (entries) => {
        const visibleEntry = entries
          .filter((entry) => entry.isIntersecting)
          .sort((first, second) => first.boundingClientRect.top - second.boundingClientRect.top)[0];

        if (visibleEntry?.target.id) {
          setActiveSection(visibleEntry.target.id);
        }
      },
      { rootMargin: "-24% 0px -58% 0px", threshold: [0, 0.2, 0.5] },
    );

    sectionNodes.forEach((node) => observer.observe(node));

    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (activeImage === null) {
      return;
    }

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setActiveImage(null);
      }

      if (event.key === "ArrowLeft") {
        setActiveImage((current) =>
          current === null
            ? current
            : (current - 1 + archiveImages.length) % archiveImages.length,
        );
      }

      if (event.key === "ArrowRight") {
        setActiveImage((current) =>
          current === null ? current : (current + 1) % archiveImages.length,
        );
      }
    }

    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [activeImage]);

  function openImage(index: number) {
    setActiveImage(index);
  }

  function moveLightbox(direction: -1 | 1) {
    setActiveImage((current) =>
      current === null
        ? current
        : (current + direction + archiveImages.length) % archiveImages.length,
    );
  }

  return (
    <main className="min-h-screen scroll-smooth bg-[#f3f1eb] text-[#211e18] selection:bg-[#8f6a3c] selection:text-white dark:bg-[#12130f] dark:text-[#f4efe5]">
      <PublicHeader village="munggangsari" mode="potensi" />

      <section className="relative min-h-[calc(100vh-4rem)] overflow-hidden bg-[#10130f] text-white lg:min-h-[calc(100vh-6rem)]">
        <Image
          src={archiveImages[0].src}
          alt={archiveImages[0].caption}
          fill
          priority
          className="scale-105 object-cover"
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-[#080907]/58" />
        <div className="absolute inset-0 bg-gradient-to-b from-black/10 via-black/26 to-black/78 md:bg-gradient-to-r md:from-black/78 md:via-black/46 md:to-black/10" />
        <div className="absolute left-0 right-0 top-3 z-10 flex justify-center px-6 md:hidden">
          <VillageSwitch village="munggangsari" />
        </div>
        <div className="relative flex min-h-[calc(100vh-4rem)] flex-col justify-end px-6 pb-14 pt-28 md:px-[40px] lg:min-h-[calc(100vh-6rem)] lg:pb-20">
          <div className="max-w-[820px]">
            <p className="w-fit rounded-full border border-white/24 bg-white/10 px-4 py-2 text-[0.68rem] font-black uppercase tracking-[0.2em] text-white/82 backdrop-blur">
              Potensi Alam Air Terjun di Desa Munggangsari
            </p>
            <h1 className="mt-5 text-[2.75rem] font-black leading-[0.92] tracking-tight md:text-7xl lg:text-8xl">
              Potensi Alam Air Terjun di Desa Munggangsari
            </h1>
            <p className="mt-6 max-w-2xl text-sm font-semibold leading-7 text-white/82 md:text-lg md:leading-9">
              Pada ketinggian lebih dari 1200 mdpl di lereng Gunung Sumbing, sebuah desa berdiri dengan beragam kekayaan alam dan budayanya.
            </p>
            <p className="mt-7 text-xs font-black uppercase tracking-[0.22em] text-white/58">
              10 halaman · 18 gambar
            </p>
          </div>
          <p className="mt-12 text-xs font-black uppercase tracking-[0.24em] text-white/54">
            Scroll to begin the story
          </p>
        </div>
      </section>

      <div className="relative mx-auto grid max-w-[1240px] gap-10 px-5 py-16 md:px-8 md:py-24 lg:grid-cols-[230px_minmax(0,820px)] lg:gap-14 xl:grid-cols-[250px_minmax(0,820px)]">
        <aside className="hidden lg:block">
          <nav className="sticky top-28 border-l border-[#c9c0b3] pl-5 text-sm dark:border-[#39362f]">
            <p className="mb-5 text-[0.68rem] font-black uppercase tracking-[0.2em] text-[#7d725f] dark:text-[#a59b87]">
              Daftar Isi
            </p>
            <ol className="space-y-3">
              {tocItems.map((item) => (
                <li key={item.id}>
                  <a
                    href={`#${item.id}`}
                    className={`block leading-6 transition ${
                      activeSection === item.id
                        ? "font-black text-[#2c4e2e] dark:text-[#bddbb4]"
                        : "font-bold text-[#756d60] hover:text-[#2c4e2e] dark:text-[#a59b87] dark:hover:text-[#bddbb4]"
                    }`}
                  >
                    {item.heading}
                  </a>
                </li>
              ))}
            </ol>
          </nav>
        </aside>

        <article className="min-w-0">
          {sections.map((section) => (
            <section
              key={section.id}
              id={section.id}
              className="scroll-mt-24 py-10 first:pt-0 md:py-16"
            >
              <h2 className="text-3xl font-black leading-tight tracking-[-0.01em] text-[#233821] md:text-5xl dark:text-[#e9e0d1]">
                {section.heading}
              </h2>
              <div className="mt-8 space-y-7">
                {section.blocks.map((block, index) =>
                  block.type === "paragraph" ? (
                    <p
                      key={`${section.id}-${index}`}
                      className="text-[1.05rem] font-medium leading-9 text-[#3f3a31] md:text-[1.16rem] md:leading-10 dark:text-[#d5cbb9]"
                    >
                      {block.text}
                    </p>
                  ) : (
                    <ImageSequence
                      key={`${section.id}-${index}`}
                      indexes={block.indexes}
                      layout={block.layout ?? "single"}
                      onOpen={openImage}
                    />
                  ),
                )}
              </div>
            </section>
          ))}

          <section className="scroll-mt-24 py-10 md:py-16">
            <h2 className="text-3xl font-black leading-tight tracking-[-0.01em] text-[#233821] md:text-5xl dark:text-[#e9e0d1]">
              Dulu dan Kini
            </h2>
            <div className="mt-10 space-y-14">
              <ComparisonPair
                beforeIndex={11}
                afterIndex={12}
                caption={archiveImages[11].caption}
                onOpen={openImage}
              />
              <figure>
                <div className="grid gap-4 md:grid-cols-[0.75fr_1fr_1fr]">
                  {[13, 14, 15].map((imageIndex, itemIndex) => (
                    <ArchiveFigure
                      key={imageIndex}
                      imageIndex={imageIndex}
                      label={itemIndex < 2 ? "Masa Lalu" : "Saat Ini"}
                      onOpen={openImage}
                    />
                  ))}
                </div>
                <figcaption className="mx-auto mt-4 max-w-3xl text-center text-xs font-semibold leading-6 text-[#756d60] dark:text-[#a59b87]">
                  {archiveImages[13].caption}
                </figcaption>
              </figure>
              <figure>
                <div className="grid gap-4 md:grid-cols-2">
                  {[16, 17].map((imageIndex) => (
                    <ArchiveFigure
                      key={imageIndex}
                      imageIndex={imageIndex}
                      onOpen={openImage}
                    />
                  ))}
                </div>
                <figcaption className="mx-auto mt-4 max-w-3xl text-center text-xs font-semibold leading-6 text-[#756d60] dark:text-[#a59b87]">
                  {archiveImages[16].caption}
                </figcaption>
              </figure>
            </div>
          </section>
        </article>
      </div>

      <FadeIn>
        <PublicFooter />
      </FadeIn>

      {currentImage && activeImage !== null && (
        <div className="fixed inset-0 z-[100] flex flex-col bg-black/94 text-white">
          <button
            type="button"
            aria-label="Tutup"
            onClick={() => setActiveImage(null)}
            className="absolute right-4 top-4 z-10 grid h-11 w-11 place-items-center rounded-full bg-white/10 text-2xl font-light transition hover:bg-white/18"
          >
            ×
          </button>
          <button
            type="button"
            aria-label="Sebelumnya"
            onClick={() => moveLightbox(-1)}
            className="absolute left-3 top-1/2 z-10 grid h-11 w-11 -translate-y-1/2 place-items-center rounded-full bg-white/10 text-3xl font-light transition hover:bg-white/18 md:left-8"
          >
            ‹
          </button>
          <button
            type="button"
            aria-label="Berikutnya"
            onClick={() => moveLightbox(1)}
            className="absolute right-3 top-1/2 z-10 grid h-11 w-11 -translate-y-1/2 place-items-center rounded-full bg-white/10 text-3xl font-light transition hover:bg-white/18 md:right-8"
          >
            ›
          </button>
          <div className="relative min-h-0 flex-1">
            <Image
              src={currentImage.src}
              alt={currentImage.caption}
              fill
              className="object-contain"
              sizes="100vw"
            />
          </div>
          <p className="mx-auto max-w-4xl px-5 py-5 text-center text-sm font-semibold leading-7 text-white/78">
            {currentImage.caption}
          </p>
        </div>
      )}
    </main>
  );
}

function ImageSequence({
  indexes,
  layout,
  onOpen,
}: {
  indexes: number[];
  layout: "single" | "pair" | "gallery";
  onOpen: (index: number) => void;
}) {
  if (layout === "single") {
    return (
      <div className="py-8 md:py-12">
        <ArchiveFigure imageIndex={indexes[0]} onOpen={onOpen} large />
      </div>
    );
  }

  return (
    <div
      className={`py-8 md:py-12 ${
        layout === "pair"
          ? "grid gap-5 md:grid-cols-2"
          : "grid gap-5 md:grid-cols-3"
      }`}
    >
      {indexes.map((imageIndex) => (
        <ArchiveFigure key={imageIndex} imageIndex={imageIndex} onOpen={onOpen} />
      ))}
    </div>
  );
}

function ComparisonPair({
  beforeIndex,
  afterIndex,
  caption,
  onOpen,
}: {
  beforeIndex: number;
  afterIndex: number;
  caption: string;
  onOpen: (index: number) => void;
}) {
  return (
    <figure>
      <div className="grid overflow-hidden bg-[#171915] shadow-[0_24px_80px_rgb(24_22_18/0.22)] md:grid-cols-2">
        <ArchiveFigure
          imageIndex={beforeIndex}
          label="Masa Lalu"
          onOpen={onOpen}
          flush
        />
        <ArchiveFigure
          imageIndex={afterIndex}
          label="Saat Ini"
          onOpen={onOpen}
          flush
        />
      </div>
      <figcaption className="mx-auto mt-4 max-w-3xl text-center text-xs font-semibold leading-6 text-[#756d60] dark:text-[#a59b87]">
        {caption}
      </figcaption>
    </figure>
  );
}

function ArchiveFigure({
  imageIndex,
  onOpen,
  label,
  large = false,
  flush = false,
}: {
  imageIndex: number;
  onOpen: (index: number) => void;
  label?: string;
  large?: boolean;
  flush?: boolean;
}) {
  const image = archiveImages[imageIndex];

  return (
    <figure
      className={`group ${flush ? "" : "bg-[#e8e1d4] shadow-[0_18px_60px_rgb(31_29_24/0.12)] dark:bg-[#1c1d18]"}`}
    >
      <button
        type="button"
        onClick={() => onOpen(imageIndex)}
        className="relative block w-full overflow-hidden bg-[#1a2117] text-left"
      >
        <span
          className={`relative block ${
            large ? "aspect-[1.62]" : "aspect-[1.28]"
          }`}
        >
          <Image
            src={image.src}
            alt={image.caption}
            fill
            className="object-cover transition duration-700 group-hover:scale-[1.035]"
            sizes={large ? "(min-width: 1024px) 820px, 100vw" : "(min-width: 1024px) 410px, 100vw"}
          />
        </span>
        {label && (
          <span className="absolute left-3 top-3 rounded-full bg-black/54 px-3 py-1 text-[0.66rem] font-black uppercase tracking-[0.16em] text-white backdrop-blur">
            {label}
          </span>
        )}
      </button>
      {!flush && (
        <figcaption className="px-4 py-3 text-xs font-semibold leading-6 text-[#756d60] dark:text-[#a59b87]">
          {image.caption}
        </figcaption>
      )}
    </figure>
  );
}
