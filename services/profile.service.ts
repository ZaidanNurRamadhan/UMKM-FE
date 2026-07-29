import { mapSupabaseError } from "@/lib/errors/supabase-error";
import { supabase } from "@/lib/supabase/client";
import type { Profile, VillageSummary } from "@/types/database";
import type { ServiceResult } from "@/types/service-result";

type CurrentAdminProfile = {
  userId: string;
  profile: Profile;
  village: VillageSummary;
};

type CurrentProfile = {
  userId: string;
  profile: Profile;
  village: VillageSummary | null;
};

type ProfileRow = Pick<Profile, "id" | "role" | "village_id">;

export async function getCurrentProfile(): Promise<
  ServiceResult<CurrentProfile>
> {
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError) {
    return mapSupabaseError(
      userError,
      "Sesi login telah berakhir. Silakan login kembali.",
    );
  }

  if (!user) {
    return {
      success: false,
      data: null,
      message: "Sesi login tidak ditemukan. Silakan login kembali.",
    };
  }

  const { data: profileData, error: profileError } = await supabase
    .from("profiles")
    .select("id, username, full_name, role, village_id")
    .eq("id", user.id)
    .maybeSingle();

  if (profileError) {
    return mapSupabaseError(profileError, "Profil pengguna tidak ditemukan.");
  }

  if (!profileData) {
    return {
      success: false,
      data: null,
      message: "Profil pengguna tidak ditemukan.",
    };
  }

  const profile = profileData as Profile;

  if (!profile.village_id) {
    return {
      success: true,
      data: {
        userId: user.id,
        profile,
        village: null,
      },
      message: "Profil berhasil dimuat.",
    };
  }

  const { data: villageData, error: villageError } = await supabase
    .from("villages")
    .select("id, name, slug")
    .eq("id", profile.village_id)
    .maybeSingle();

  if (villageError) {
    return mapSupabaseError(villageError, "Data desa profil tidak ditemukan.");
  }

  return {
    success: true,
    data: {
      userId: user.id,
      profile,
      village: villageData ? (villageData as VillageSummary) : null,
    },
    message: "Profil berhasil dimuat.",
  };
}

export async function getCurrentAdminProfile(): Promise<
  ServiceResult<CurrentAdminProfile>
> {
  const currentProfile = await getCurrentProfile();

  if (!currentProfile.success) {
    return currentProfile;
  }

  const { userId, profile, village } = currentProfile.data;

  if (profile.role !== "admin") {
    return {
      success: false,
      data: null,
      message: "Akun ini tidak memiliki akses admin.",
    };
  }

  if (!profile.village_id || !village) {
    return {
      success: false,
      data: null,
      message: "Desa admin belum dikonfigurasi.",
    };
  }

  return {
    success: true,
    data: {
      userId,
      profile,
      village,
    },
    message: "Profil admin berhasil dimuat.",
  };
}

export async function requireAdminSession(): Promise<
  ServiceResult<CurrentAdminProfile>
> {
  return getCurrentAdminProfile();
}

export async function getCurrentMangliAdminProfile(): Promise<
  ServiceResult<CurrentAdminProfile>
> {
  const adminProfile = await getCurrentAdminProfile();

  if (!adminProfile.success) {
    return adminProfile;
  }

  if (adminProfile.data.village.slug !== "mangli") {
    return {
      success: false,
      data: null,
      message: "Hanya Admin Desa Mangli yang dapat mengelola UMKM.",
    };
  }

  return adminProfile;
}

export function toProfileDebug(
  profile: ProfileRow,
  village?: Pick<VillageSummary, "slug">,
) {
  return {
    role: profile.role,
    villageId: profile.village_id,
    villageSlug: village?.slug,
  };
}
