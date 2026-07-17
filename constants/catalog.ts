import { STORAGE_FOLDERS, type StorageFolder } from "@/constants/storage";
import type { CatalogKind } from "@/types/catalog";

type CatalogConfig = {
  folder: StorageFolder;
  segment: string;
  manageLabel: string;
  addLabel: string;
  titleCreate: string;
  titleEdit: string;
  formDescription: string;
  listTitle: string;
  listDescription: string;
  nameHeader: string;
  empty: string;
  totalLabel: string;
  successCreate: string;
  successUpdate: string;
};

export const CATALOG_CONFIG = {
  umkm: {
    folder: STORAGE_FOLDERS.UMKM,
    segment: "umkm",
    manageLabel: "Kelola UMKM",
    addLabel: "Tambah UMKM",
    titleCreate: "Tambah UMKM",
    titleEdit: "Edit UMKM",
    formDescription:
      "Lengkapi informasi UMKM Anda dengan data yang akurat dan menarik.",
    listTitle: "Kelola UMKM",
    listDescription:
      "Manajemen basis data pelaku usaha mikro, kecil, dan menengah.",
    nameHeader: "Nama UMKM",
    empty: "Belum ada data UMKM.",
    totalLabel: "UMKM",
    successCreate: "UMKM berhasil ditambahkan.",
    successUpdate: "UMKM berhasil diperbarui.",
  },
  warung: {
    folder: STORAGE_FOLDERS.WARUNGS,
    segment: "warung",
    manageLabel: "Kelola Warung",
    addLabel: "Tambah Warung",
    titleCreate: "Tambah Warung",
    titleEdit: "Edit Warung",
    formDescription: "Manajemen basis data warung dan kuliner lokal desa.",
    listTitle: "Kelola Warung",
    listDescription: "Manajemen basis data warung dan kuliner lokal desa.",
    nameHeader: "Nama Warung",
    empty: "Belum ada data warung.",
    totalLabel: "warung",
    successCreate: "Warung berhasil ditambahkan.",
    successUpdate: "Warung berhasil diperbarui.",
  },
  article: {
    folder: STORAGE_FOLDERS.UMKM,
    segment: "artikel",
    manageLabel: "Kelola Artikel",
    addLabel: "Tambah Artikel",
    titleCreate: "Tambah Artikel",
    titleEdit: "Edit Artikel",
    formDescription: "Manajemen artikel potensi dan cerita inspiratif desa.",
    listTitle: "Kelola Artikel",
    listDescription: "Manajemen artikel potensi dan cerita inspiratif desa.",
    nameHeader: "Judul Artikel",
    empty: "Belum ada data artikel.",
    totalLabel: "artikel",
    successCreate: "Artikel berhasil ditambahkan.",
    successUpdate: "Artikel berhasil diperbarui.",
  },
} satisfies Record<CatalogKind, CatalogConfig>;
