import type { ServiceResult } from "@/types/service-result";

type ErrorLike = {
  code?: string;
  message?: string;
  details?: string;
  hint?: string;
  status?: number;
  name?: string;
};

function isErrorLike(error: unknown): error is ErrorLike {
  return typeof error === "object" && error !== null;
}

function readError(error: unknown): ErrorLike {
  if (error instanceof Error) {
    return {
      name: error.name,
      message: error.message,
    };
  }

  if (!isErrorLike(error)) {
    return {};
  }

  return {
    code: typeof error.code === "string" ? error.code : undefined,
    message: typeof error.message === "string" ? error.message : undefined,
    details: typeof error.details === "string" ? error.details : undefined,
    hint: typeof error.hint === "string" ? error.hint : undefined,
    status: typeof error.status === "number" ? error.status : undefined,
    name: typeof error.name === "string" ? error.name : undefined,
  };
}

function getFriendlyMessage(error: ErrorLike, fallbackMessage?: string): string {
  const code = error.code?.toUpperCase();
  const status = error.status;
  const sourceMessage = `${error.message ?? ""} ${error.details ?? ""} ${error.hint ?? ""}`.toLowerCase();

  if (
    sourceMessage.includes("jwt expired") ||
    sourceMessage.includes("invalid jwt") ||
    sourceMessage.includes("session") ||
    code === "PGRST301" ||
    status === 401
  ) {
    return "Sesi login telah berakhir. Silakan login kembali.";
  }

  if (
    sourceMessage.includes("row-level security") ||
    sourceMessage.includes("rls")
  ) {
    return "Data gagal disimpan karena akun tidak memiliki akses yang sesuai.";
  }

  if (
    sourceMessage.includes("permission denied") ||
    status === 403
  ) {
    return sourceMessage.includes("insert") ||
      sourceMessage.includes("update") ||
      sourceMessage.includes("delete")
      ? "Data gagal disimpan karena akun tidak memiliki akses."
      : "Anda tidak memiliki izin untuk melakukan tindakan ini.";
  }

  if (code === "23505") {
    if (sourceMessage.includes("username")) {
      return "Username sudah digunakan.";
    }

    if (sourceMessage.includes("url")) {
      return "URL artikel sudah tersedia.";
    }

    if (sourceMessage.includes("name") || sourceMessage.includes("nama")) {
      return "Nama data sudah tersedia.";
    }

    return "Data dengan nilai yang sama sudah tersedia.";
  }

  if (code === "23514") {
    return "Data yang dimasukkan tidak memenuhi ketentuan.";
  }

  if (code === "23503") {
    return "Data terkait tidak ditemukan atau sudah dihapus.";
  }

  if (code === "23502") {
    return "Ada data wajib yang belum diisi.";
  }

  if (code === "22P02") {
    return "Format identitas data tidak valid.";
  }

  if (
    sourceMessage.includes("network") ||
    sourceMessage.includes("failed to fetch") ||
    sourceMessage.includes("fetch failed") ||
    sourceMessage.includes("load failed")
  ) {
    return "Koneksi ke server bermasalah. Periksa koneksi internet lalu coba lagi.";
  }

  if (
    sourceMessage.includes("timeout") ||
    sourceMessage.includes("timed out") ||
    status === 408 ||
    status === 504
  ) {
    return "Permintaan memerlukan waktu terlalu lama. Silakan coba lagi.";
  }

  if (
    sourceMessage.includes("rate limit") ||
    sourceMessage.includes("too many requests") ||
    status === 429
  ) {
    return "Terlalu banyak percobaan. Silakan coba lagi beberapa saat lagi.";
  }

  if (
    sourceMessage.includes("not found") ||
    sourceMessage.includes("no rows") ||
    status === 404
  ) {
    return sourceMessage.includes("bucket")
      ? "Penyimpanan foto belum tersedia."
      : "Data yang diminta tidak ditemukan.";
  }

  if (
    sourceMessage.includes("file size") ||
    sourceMessage.includes("too large") ||
    status === 413
  ) {
    return "Ukuran foto melebihi batas maksimal 2 MB.";
  }

  if (
    sourceMessage.includes("mime") ||
    sourceMessage.includes("content type") ||
    sourceMessage.includes("unsupported media") ||
    status === 415
  ) {
    return "Format foto tidak didukung.";
  }

  return fallbackMessage ?? "Terjadi kesalahan yang tidak diketahui.";
}

export function mapSupabaseError<T>(
  error: unknown,
  fallbackMessage?: string,
): ServiceResult<T> {
  const normalizedError = readError(error);

  return {
    success: false,
    data: null,
    message: getFriendlyMessage(normalizedError, fallbackMessage),
    code: normalizedError.code,
    details: normalizedError.details,
  };
}

export function getSupabaseErrorMessage(
  error: unknown,
  fallbackMessage?: string,
): string {
  return mapSupabaseError<never>(error, fallbackMessage).message;
}
