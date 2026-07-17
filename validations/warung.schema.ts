import { z } from "zod";
import { optionalPhotoFileSchema } from "./file.schema";
import { whatsappNumberSchema } from "./shared";

export const warungFormSchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, "Nama warung wajib diisi.")
    .min(2, "Nama warung minimal 2 karakter.")
    .max(150, "Nama warung maksimal 150 karakter."),
  owner_name: z
    .string()
    .trim()
    .max(150, "Nama pemilik maksimal 150 karakter.")
    .refine(
      (value) => value === "" || value.length >= 2,
      "Nama pemilik minimal 2 karakter.",
    ),
  address: z
    .string()
    .trim()
    .max(500, "Alamat maksimal 500 karakter."),
  whatsapp_number: whatsappNumberSchema,
  photo: optionalPhotoFileSchema,
});

export type WarungFormValues = z.infer<typeof warungFormSchema>;
