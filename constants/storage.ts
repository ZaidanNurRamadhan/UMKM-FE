export const VILLAGE_ASSETS_BUCKET = "village-assets";

export const MAX_PHOTO_SIZE_BYTES = 500 * 1024;

export const ALLOWED_PHOTO_TYPES = [
  "image/jpeg",
  "image/jpg",
  "image/png",
  "image/webp",
] as const;

export const PHOTO_ACCEPT_ATTRIBUTE = "image/jpeg,image/png,image/webp";

export const STORAGE_FOLDERS = {
  UMKM: "umkm",
  WARUNGS: "warungs",
} as const;

export type StorageFolder =
  (typeof STORAGE_FOLDERS)[keyof typeof STORAGE_FOLDERS];
