import { supabase } from "@/lib/supabase/client";
import { getSupabaseErrorMessage, mapSupabaseError } from "@/lib/errors/supabase-error";
import { deletePhoto } from "@/services/storage.service";
import type {
  CreateWarungInput,
  UpdateWarungInput,
  VillageSlug,
  Warung,
} from "@/types/database";
import type { ServiceResult } from "@/types/service-result";
import {
  normalizeVillageRelation,
  type VillageRelation,
} from "./village-relation";

const WARUNG_SELECT = `
  id,
  village_id,
  name,
  owner_name,
  address,
  whatsapp_number,
  photo_path,
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

type WarungQueryRow = Omit<Warung, "villages"> & {
  villages: VillageRelation;
};

export async function getWarungs(
  options: ListOptions = {},
): Promise<Warung[]> {
  let query = supabase
    .from("warungs")
    .select(WARUNG_SELECT)
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

  return ((data ?? []) as unknown as WarungQueryRow[]).map(normalizeWarungRow);
}

export async function getWarungCount(): Promise<number> {
  const { count, error } = await supabase
    .from("warungs")
    .select("id", { count: "exact", head: true });

  if (error) {
    throw new Error(
      getSupabaseErrorMessage(error, "Data tidak dapat dimuat. Silakan coba lagi."),
    );
  }

  return count ?? 0;
}

export async function getWarungById(id: string): Promise<Warung | null> {
  const { data, error } = await supabase
    .from("warungs")
    .select(WARUNG_SELECT)
    .eq("id", id)
    .maybeSingle();

  if (error) {
    throw new Error(
      getSupabaseErrorMessage(error, "Data tidak dapat dimuat. Silakan coba lagi."),
    );
  }

  return data ? normalizeWarungRow(data as unknown as WarungQueryRow) : null;
}

export async function createWarung(
  payload: CreateWarungInput,
): Promise<ServiceResult<Warung>> {
  try {
    const { data, error } = await supabase
      .from("warungs")
      .insert(payload)
      .select(WARUNG_SELECT)
      .single();

    if (error) {
      return mapSupabaseError(error, "Data gagal disimpan.");
    }

    if (!data) {
      return {
        success: false,
        data: null,
        message: "Data warung tidak berhasil disimpan.",
      };
    }

    return {
      success: true,
      data: normalizeWarungRow(data as unknown as WarungQueryRow),
      message: "Warung berhasil ditambahkan.",
    };
  } catch (error) {
    return mapSupabaseError(error, "Data gagal disimpan.");
  }
}

export async function updateWarung(
  payload: UpdateWarungInput,
): Promise<ServiceResult<Warung>> {
  const { id, ...values } = payload;

  try {
    const { data, error } = await supabase
      .from("warungs")
      .update(values)
      .eq("id", id)
      .select(WARUNG_SELECT)
      .single();

    if (error) {
      return mapSupabaseError(error, "Data gagal diperbarui.");
    }

    if (!data) {
      return {
        success: false,
        data: null,
        message: "Data warung tidak berhasil diperbarui.",
      };
    }

    return {
      success: true,
      data: normalizeWarungRow(data as unknown as WarungQueryRow),
      message: "Warung berhasil diperbarui.",
    };
  } catch (error) {
    return mapSupabaseError(error, "Data gagal diperbarui.");
  }
}

export async function deleteWarung(
  id: string,
): Promise<ServiceResult<{ id: string; photo_path: string | null }>> {
  try {
    const { data, error } = await supabase
      .from("warungs")
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
        message: "Data warung tidak berhasil dihapus.",
      };
    }

    const deletedData = data as { id: string; photo_path: string | null };

    if (deletedData.photo_path) {
      const deletePhotoResult = await deletePhoto(deletedData.photo_path);

      if (!deletePhotoResult.success) {
        return {
          success: false,
          data: null,
          message:
            "Data warung berhasil dihapus, tetapi foto gagal dihapus dari penyimpanan.",
          code: "PHOTO_DELETE_FAILED",
          details: deletePhotoResult.message,
        };
      }
    }

    return {
      success: true,
      data: deletedData,
      message: "Warung berhasil dihapus.",
    };
  } catch (error) {
    return mapSupabaseError(error, "Data gagal dihapus.");
  }
}

function normalizeWarungRow(row: WarungQueryRow): Warung {
  return {
    ...row,
    villages: normalizeVillageRelation(row.villages),
  };
}
