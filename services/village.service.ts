import { mapSupabaseError } from "@/lib/errors/supabase-error";
import { supabase } from "@/lib/supabase/client";
import type { Village, VillageSlug } from "@/types/database";
import type { ServiceResult } from "@/types/service-result";

export async function getVillageBySlug(
  slug: VillageSlug,
): Promise<ServiceResult<Village>> {
  try {
    const { data, error } = await supabase
      .from("villages")
      .select("id, name, slug, created_at")
      .eq("slug", slug)
      .single();

    if (error) {
      return mapSupabaseError(error, "Data desa tidak ditemukan.");
    }

    if (!data) {
      return {
        success: false,
        data: null,
        message: "Data desa tidak ditemukan.",
      };
    }

    return {
      success: true,
      data: data as Village,
      message: "Data desa berhasil dimuat.",
    };
  } catch (error) {
    return mapSupabaseError(error, "Data desa tidak ditemukan.");
  }
}
