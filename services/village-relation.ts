import type { VillageSummary } from "@/types/database";

export type VillageRelation = VillageSummary | VillageSummary[] | null;

export function normalizeVillageRelation(
  relation: VillageRelation,
): VillageSummary | null {
  if (Array.isArray(relation)) {
    return relation[0] ?? null;
  }

  return relation;
}
