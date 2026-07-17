import { z } from "zod";

export const loginFormSchema = z.object({
  email: z
    .string()
    .trim()
    .min(1, "Email wajib diisi.")
    .email("Email tidak valid.")
    .max(254, "Email maksimal 254 karakter.")
    .transform((value) => value.toLowerCase()),
  password: z
    .string()
    .min(1, "Password wajib diisi.")
    .min(8, "Password minimal 8 karakter."),
});

export type LoginFormValues = z.infer<typeof loginFormSchema>;
