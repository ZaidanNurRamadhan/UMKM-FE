import { supabase } from "@/lib/supabase/client";
import { mapSupabaseError } from "@/lib/errors/supabase-error";
import { debugCurrentSession } from "@/services/auth.service";
import type { ServiceResult } from "@/types/service-result";

const VILLAGE_ASSETS_BUCKET = "village-assets";

type UploadPhotoOptions = {
  villageSlug: string;
  folder: "umkm" | "warung";
};

export function getVillageAssetUrl(photoPath: string | null): string | null {
  const normalizedPath = photoPath?.trim();

  if (!normalizedPath) {
    return null;
  }

  const { data } = supabase.storage
    .from(VILLAGE_ASSETS_BUCKET)
    .getPublicUrl(normalizedPath);

  return data.publicUrl || null;
}

export async function uploadPhoto(
  file: File,
  options: UploadPhotoOptions,
): Promise<ServiceResult<{ path: string }>> {
  try {
    const sessionDebug = await debugCurrentSession(
      `before storage upload (${options.folder})`,
    );

    if (!sessionDebug.hasSession || !sessionDebug.userId) {
      return {
        success: false,
        data: null,
        message: "Sesi login tidak ditemukan. Silakan login kembali.",
      };
    }

    const extension = file.name.split(".").pop()?.toLowerCase() || "jpg";
    const path = `${options.villageSlug}/${options.folder}/${crypto.randomUUID()}.${extension}`;
    const { data, error } = await supabase.storage
      .from(VILLAGE_ASSETS_BUCKET)
      .upload(path, file, {
        cacheControl: "3600",
        contentType: file.type,
        upsert: false,
      });

    if (error) {
      return mapSupabaseError(error, "Foto gagal diunggah.");
    }

    if (!data?.path) {
      return {
        success: false,
        data: null,
        message: "Foto gagal diunggah.",
      };
    }

    return {
      success: true,
      data: { path: data.path },
      message: "Foto berhasil diunggah.",
    };
  } catch (error) {
    return mapSupabaseError(error, "Foto gagal diunggah.");
  }
}

export async function deletePhoto(
  photoPath: string,
): Promise<ServiceResult<{ path: string }>> {
  try {
    const { data, error } = await supabase.storage
      .from(VILLAGE_ASSETS_BUCKET)
      .remove([photoPath]);

    if (error) {
      return mapSupabaseError(error, "Foto gagal dihapus.");
    }

    if (!data) {
      return {
        success: false,
        data: null,
        message: "Foto gagal dihapus.",
      };
    }

    return {
      success: true,
      data: { path: photoPath },
      message: "Foto berhasil dihapus.",
    };
  } catch (error) {
    return mapSupabaseError(error, "Foto gagal dihapus.");
  }
}
