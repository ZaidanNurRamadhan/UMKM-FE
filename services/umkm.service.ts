import { supabase } from "@/lib/supabase/client";
import { getSupabaseErrorMessage, mapSupabaseError } from "@/lib/errors/supabase-error";
import { getCurrentMangliAdminProfile } from "@/services/profile.service";
import { deletePhoto } from "@/services/storage.service";
import type {
  CreateUmkmInput,
  Umkm,
  UpdateUmkmInput,
  VillageSlug,
} from "@/types/database";
import type { ServiceResult } from "@/types/service-result";
import {
  normalizeVillageRelation,
  type VillageRelation,
} from "./village-relation";

const UMKM_SELECT = `
  id,
  village_id,
  name,
  description,
  whatsapp_number,
  address,
  photo_path,
  created_by,
  created_at,
  updated_at,
  villages!inner (
    id,
    name,
    slug
  )
`;

type ListOptions = {
  villageSlug?: VillageSlug;
  limit?: number;
};

type UmkmQueryRow = Omit<Umkm, "villages"> & {
  villages: VillageRelation;
};

export async function getUmkm(options: ListOptions = {}): Promise<Umkm[]> {
  let query = supabase
    .from("umkm")
    .select(UMKM_SELECT)
    .order("created_at", { ascending: false });

  if (options.villageSlug) {
    query = query.eq("villages.slug", options.villageSlug);
  }

  if (options.limit) {
    query = query.limit(options.limit);
  }

  const { data, error } = await query;

  if (error) {
    throw new Error(
      getSupabaseErrorMessage(error, "Data tidak dapat dimuat. Silakan coba lagi."),
    );
  }

  return ((data ?? []) as unknown as UmkmQueryRow[]).map(normalizeUmkmRow);
}

export async function createUmkm(
  payload: CreateUmkmInput,
): Promise<ServiceResult<Umkm>> {
  const adminProfile = await getCurrentMangliAdminProfile();

  if (!adminProfile.success) {
    return adminProfile;
  }

  try {
    const { data, error } = await supabase
      .from("umkm")
      .insert(payload)
      .select(UMKM_SELECT)
      .single();

    if (error) {
      return mapSupabaseError(error, "Data gagal disimpan.");
    }

    if (!data) {
      return {
        success: false,
        data: null,
        message: "Data UMKM tidak berhasil disimpan.",
      };
    }

    return {
      success: true,
      data: normalizeUmkmRow(data as unknown as UmkmQueryRow),
      message: "UMKM berhasil ditambahkan.",
    };
  } catch (error) {
    return mapSupabaseError(error, "Data gagal disimpan.");
  }
}

export async function updateUmkm(
  payload: UpdateUmkmInput,
): Promise<ServiceResult<Umkm>> {
  const adminProfile = await getCurrentMangliAdminProfile();

  if (!adminProfile.success) {
    return adminProfile;
  }

  const { id, ...values } = payload;

  try {
    const { data, error } = await supabase
      .from("umkm")
      .update(values)
      .eq("id", id)
      .select(UMKM_SELECT)
      .single();

    if (error) {
      return mapSupabaseError(error, "Data gagal diperbarui.");
    }

    if (!data) {
      return {
        success: false,
        data: null,
        message: "Data UMKM tidak berhasil diperbarui.",
      };
    }

    return {
      success: true,
      data: normalizeUmkmRow(data as unknown as UmkmQueryRow),
      message: "UMKM berhasil diperbarui.",
    };
  } catch (error) {
    return mapSupabaseError(error, "Data gagal diperbarui.");
  }
}

export async function deleteUmkm(
  id: string,
): Promise<ServiceResult<{ id: string; photo_path: string | null }>> {
  const adminProfile = await getCurrentMangliAdminProfile();

  if (!adminProfile.success) {
    return adminProfile;
  }

  try {
    const { data, error } = await supabase
      .from("umkm")
      .delete()
      .eq("id", id)
      .select("id, photo_path")
      .single();

    if (error) {
      return mapSupabaseError(error, "Data gagal dihapus.");
    }

    if (!data) {
      return {
        success: false,
        data: null,
        message: "Data UMKM tidak berhasil dihapus.",
      };
    }

    const deletedData = data as { id: string; photo_path: string | null };

    if (deletedData.photo_path) {
      await deletePhoto(deletedData.photo_path);
    }

    return {
      success: true,
      data: deletedData,
      message: "UMKM berhasil dihapus.",
    };
  } catch (error) {
    return mapSupabaseError(error, "Data gagal dihapus.");
  }
}

function normalizeUmkmRow(row: UmkmQueryRow): Umkm {
  return {
    ...row,
    villages: normalizeVillageRelation(row.villages),
  };
}
