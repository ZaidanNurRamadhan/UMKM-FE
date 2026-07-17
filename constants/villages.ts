import type { VillageSlug } from "@/types/database";

export const VILLAGE_SLUGS = {
  MANGLI: "mangli",
  MUNGGANGSARI: "munggangsari",
} as const;

export const VILLAGE_NAMES = {
  mangli: "Mangli",
  munggangsari: "Munggangsari",
} satisfies Record<VillageSlug, string>;

export const ADMIN_NAMES = {
  mangli: "Admin Mangli",
  munggangsari: "Admin Munggangsari",
} satisfies Record<VillageSlug, string>;
