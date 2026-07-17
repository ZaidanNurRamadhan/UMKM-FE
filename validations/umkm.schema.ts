import { z } from "zod";
import { optionalPhotoFileSchema } from "./file.schema";
import { whatsappNumberSchema } from "./shared";

export const umkmFormSchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, "Nama UMKM wajib diisi.")
    .min(2, "Nama UMKM minimal 2 karakter.")
    .max(150, "Nama UMKM maksimal 150 karakter."),
  description: z
    .string()
    .trim()
    .min(1, "Deskripsi UMKM wajib diisi.")
    .min(3, "Deskripsi UMKM minimal 3 karakter.")
    .max(500, "Deskripsi UMKM maksimal 500 karakter."),
  whatsapp_number: whatsappNumberSchema,
  address: z
    .string()
    .trim()
    .min(1, "Alamat lengkap wajib diisi.")
    .max(300, "Alamat maksimal 300 karakter."),
  photo: optionalPhotoFileSchema,
});

export type UmkmFormValues = z.infer<typeof umkmFormSchema>;
