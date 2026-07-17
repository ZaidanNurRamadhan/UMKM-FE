import { supabase } from "@/lib/supabase/client";
import { getSupabaseErrorMessage, mapSupabaseError } from "@/lib/errors/supabase-error";
import { getCurrentMangliAdminProfile, toProfileDebug } from "@/services/profile.service";
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
      logUmkmMutationDebug("insert", {
        userId: adminProfile.data.userId,
        profile: adminProfile.data.profile,
        village: adminProfile.data.village,
        payload,
        error,
      });

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
      logUmkmMutationDebug("update", {
        userId: adminProfile.data.userId,
        profile: adminProfile.data.profile,
        village: adminProfile.data.village,
        payload: { id, ...values },
        error,
      });

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
      logUmkmMutationDebug("delete", {
        userId: adminProfile.data.userId,
        profile: adminProfile.data.profile,
        village: adminProfile.data.village,
        payload: { id },
        error,
      });

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
      const photoResult = await deletePhoto(deletedData.photo_path);

      if (!photoResult.success && process.env.NODE_ENV === "development") {
        console.error(photoResult);
      }
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

type UmkmDebugPayload = Record<string, string | null | undefined>;

function readDebugError(error: unknown) {
  if (typeof error !== "object" || error === null) {
    return null;
  }

  const record = error as Record<string, unknown>;

  return {
    code: typeof record.code === "string" ? record.code : undefined,
    message: typeof record.message === "string" ? record.message : undefined,
    details: typeof record.details === "string" ? record.details : undefined,
    hint: typeof record.hint === "string" ? record.hint : undefined,
  };
}

function logUmkmMutationDebug(
  operation: "insert" | "update" | "delete",
  context: {
    userId: string;
    profile: {
      id: string;
      role: string;
      village_id: string | null;
    };
    village: {
      id: string;
      slug: VillageSlug;
    };
    payload: UmkmDebugPayload;
    error?: unknown;
  },
): void {
  if (process.env.NODE_ENV !== "development") {
    return;
  }

  console.error(`UMKM ${operation} debug`, {
    userId: context.userId,
    ...toProfileDebug(context.profile, context.village),
    payload: context.payload,
    error: context.error ? readDebugError(context.error) : undefined,
  });
}
