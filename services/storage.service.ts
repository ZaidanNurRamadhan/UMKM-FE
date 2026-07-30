import { supabase } from "@/lib/supabase/client";
import { VILLAGE_ASSETS_BUCKET, type StorageFolder } from "@/constants/storage";
import { mapSupabaseError } from "@/lib/errors/supabase-error";
import { createStorageFileName } from "@/lib/utils/file";
import { debugCurrentSession } from "@/services/auth.service";
import type { ServiceResult } from "@/types/service-result";

type UploadPhotoOptions = {
  villageSlug: string;
  folder: StorageFolder;
};

export function getVillageAssetUrl(photoPath: string | null): string | null {
  const normalizedPath = photoPath?.trim();

  if (!normalizedPath) {
    return null;
  }

  if (isPublicUrl(normalizedPath)) {
    return normalizedPath;
  }

  const { data } = supabase.storage
    .from(VILLAGE_ASSETS_BUCKET)
    .getPublicUrl(normalizedPath);

  return data.publicUrl || null;
}

function isPublicUrl(value: string): boolean {
  try {
    const url = new URL(value);

    return url.protocol === "http:" || url.protocol === "https:";
  } catch {
    return false;
  }
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

    const path = `${options.villageSlug}/${options.folder}/${createStorageFileName(file.name)}`;
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
    const storage = supabase.storage.from(VILLAGE_ASSETS_BUCKET);
    const { data, error } = await storage.remove([photoPath]);

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

    // const { data: photoStillExists, error: verificationError } =
    //   await storage.exists(photoPath);

    // if (photoStillExists) {
    //   return {
    //     success: false,
    //     data: null,
    //     message: "Foto gagal dihapus dari penyimpanan.",
    //     code: "PHOTO_DELETE_FAILED",
    //     details: "File masih tersedia di Supabase Storage setelah proses hapus.",
    //   };
    // }

    // if (verificationError && photoStillExists !== false) {
    //   return mapSupabaseError(
    //     verificationError,
    //     "Status penghapusan foto tidak dapat diverifikasi.",
    //   );
    // }

    return {
      success: true,
      data: { path: photoPath },
      message: "Foto berhasil dihapus.",
    };
  } catch (error) {
    return mapSupabaseError(error, "Foto gagal dihapus.");
  }
}
