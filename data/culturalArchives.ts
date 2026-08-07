export type CulturalArchiveDocument = {
  language: string;
  size: string;
  previewUrl: string;
  downloadUrl: string;
};

export type CulturalArchiveItem = {
  id: string;
  title: string;
  description: string;
  documents: CulturalArchiveDocument[];
};

export const culturalArchives: CulturalArchiveItem[] = [
  {
    id: "merti-dusun",
    title: "Tradisi Merti Dusun: Kemeriahan Desa di Bulan Safar",
    description:
      "Tradisi Merti Dusun merupakan warisan budaya masyarakat Dusun Munggangsari yang diselenggarakan setiap Bulan Safar sebagai ungkapan rasa syukur kepada Tuhan Yang Maha Esa atas kesehatan, keselamatan, rezeki, dan hasil bumi selama satu tahun. Artikel ini mendokumentasikan sejarah tradisi, nilai spiritual, sosial, budaya, dan ekonomi, serta rangkaian prosesi seperti selametan, pagelaran wayang kulit, silaturahmi warga, dan potensi wisata budaya Desa Munggangsari.",
    documents: [
      {
        language: "Bahasa Indonesia",
        size: "3.62 MB",
        previewUrl: "/budaya-pdf/ARTIKEL BUDAYA MERTI DUSUN Indo Vers.pdf",
        downloadUrl: "/budaya-pdf/ARTIKEL BUDAYA MERTI DUSUN Indo Vers.pdf",
      },
      {
        language: "English",
        size: "3.63 MB",
        previewUrl: "/budaya-pdf/ARTIKEL BUDAYA MERTI DUSUN English Vers.pdf",
        downloadUrl: "/budaya-pdf/ARTIKEL BUDAYA MERTI DUSUN English Vers.pdf",
      },
      {
        language: "Français",
        size: "3.63 MB",
        previewUrl: "/budaya-pdf/ARTIKEL BUDAYA MERTI DUSUN France Vers.pdf",
        downloadUrl: "/budaya-pdf/ARTIKEL BUDAYA MERTI DUSUN France Vers.pdf",
      },
    ],
  },
];
