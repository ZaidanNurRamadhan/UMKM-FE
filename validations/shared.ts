import { z } from "zod";
import { normalizeWhatsAppNumber } from "@/lib/whatsapp";

export const uuidSchema = z
  .string()
  .trim()
  .uuid("Format identitas desa tidak valid.");

export const whatsappNumberSchema = z
  .string()
  .trim()
  .refine(
    (value) => value === "" || /^[0-9+\s()-]+$/.test(value),
    "Nomor WhatsApp tidak valid.",
  )
  .refine((value) => {
    if (value === "") {
      return true;
    }

    const normalized = normalizeWhatsAppNumber(value);

    return Boolean(
      normalized && normalized.length >= 8 && normalized.length <= 25,
    );
  }, "Nomor WhatsApp tidak valid.");
