import { z } from "zod";

export const MAX_PHOTO_SIZE_BYTES = 2 * 1024 * 1024;

const ALLOWED_PHOTO_TYPES = [
  "image/jpeg",
  "image/jpg",
  "image/png",
  "image/webp",
];

function isFile(value: unknown): value is File {
  return typeof File !== "undefined" && value instanceof File;
}

export const optionalPhotoFileSchema = z
  .custom<File | null>(
    (value) => value === null || value === undefined || isFile(value),
    { message: "Foto tidak valid." },
  )
  .transform((value) => value ?? null)
  .refine(
    (file) => file === null || ALLOWED_PHOTO_TYPES.includes(file.type),
    "Foto harus berformat JPG, PNG, atau WebP.",
  )
  .refine(
    (file) => file === null || file.size <= MAX_PHOTO_SIZE_BYTES,
    "Ukuran foto maksimal 2 MB.",
  );

export const requiredPhotoFileSchema = optionalPhotoFileSchema.refine(
  (file) => file !== null,
  "Foto wajib diunggah.",
);
