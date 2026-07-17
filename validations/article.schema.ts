import { z } from "zod";
import { uuidSchema } from "./shared";

function isMediumUrl(value: string): boolean {
  try {
    const url = new URL(value);
    const hostname = url.hostname.toLowerCase();

    return (
      (url.protocol === "http:" || url.protocol === "https:") &&
      (hostname === "medium.com" || hostname.endsWith(".medium.com"))
    );
  } catch {
    return false;
  }
}

export const articleFormSchema = z.object({
  title: z
    .string()
    .trim()
    .min(1, "Judul artikel wajib diisi.")
    .min(3, "Judul artikel minimal 3 karakter.")
    .max(200, "Judul artikel maksimal 200 karakter."),
  description: z
    .string()
    .trim()
    .min(1, "Deskripsi artikel wajib diisi.")
    .min(3, "Deskripsi artikel minimal 3 karakter.")
    .max(2000, "Deskripsi artikel maksimal 2000 karakter."),
  village_id: uuidSchema.optional(),
  article_url: z
    .string()
    .trim()
    .min(1, "Link artikel wajib diisi.")
    .url("Link artikel harus berupa URL yang valid.")
    .refine((value) => {
      try {
        const url = new URL(value);

        return url.protocol === "http:" || url.protocol === "https:";
      } catch {
        return false;
      }
    }, "Link artikel harus menggunakan protokol http atau https.")
    .refine(isMediumUrl, "Link artikel harus berasal dari Medium."),
});

export type ArticleFormValues = z.infer<typeof articleFormSchema>;
