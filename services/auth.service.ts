import { mapSupabaseError } from "@/lib/errors/supabase-error";
import { supabase } from "@/lib/supabase/client";
import type { LoginFormValues } from "@/validations/auth.schema";
import type { ServiceResult } from "@/types/service-result";

type AuthSessionData = {
  userId: string;
  email: string | null;
};

type AuthSessionDebug = {
  label: string;
  hasSession: boolean;
  sessionUserId: string | null;
  sessionEmail: string | null;
  userId: string | null;
  userEmail: string | null;
  expectedEmail?: string;
  emailMatchesExpected?: boolean;
  expiresAt: number | null;
  sessionError: string | null;
  userError: string | null;
};

function isInvalidLoginError(error: unknown): boolean {
  if (!(error instanceof Error)) {
    return false;
  }

  const message = error.message.toLowerCase();

  return (
    message.includes("invalid login credentials") ||
    message.includes("invalid credentials")
  );
}

function isUnconfirmedAccountError(error: unknown): boolean {
  return error instanceof Error && error.message.toLowerCase().includes("not confirmed");
}

export async function debugCurrentSession(
  label: string,
  expectedEmail?: string,
): Promise<AuthSessionDebug> {
  const { data: sessionData, error: sessionError } =
    await supabase.auth.getSession();
  const { data: userData, error: userError } = await supabase.auth.getUser();
  const session = sessionData.session;
  const normalizedExpectedEmail = expectedEmail?.trim().toLowerCase();
  const sessionEmail = session?.user.email?.toLowerCase() ?? null;
  const userEmail = userData.user?.email?.toLowerCase() ?? null;
  const debugData: AuthSessionDebug = {
    label,
    hasSession: Boolean(session),
    sessionUserId: session?.user.id ?? null,
    sessionEmail,
    userId: userData.user?.id ?? null,
    userEmail,
    expectedEmail: normalizedExpectedEmail,
    emailMatchesExpected: normalizedExpectedEmail
      ? sessionEmail === normalizedExpectedEmail ||
        userEmail === normalizedExpectedEmail
      : undefined,
    expiresAt: session?.expires_at ?? null,
    sessionError: sessionError?.message ?? null,
    userError: userError?.message ?? null,
  };

  console.log("Supabase session debug", debugData);

  return debugData;
}

export async function signInAdmin(
  payload: LoginFormValues,
): Promise<ServiceResult<AuthSessionData>> {
  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email: payload.email,
      password: payload.password,
    });

    if (error) {
      if (isUnconfirmedAccountError(error)) {
        return {
          success: false,
          data: null,
          message: "Akun belum terkonfirmasi.",
          code: error.name,
        };
      }

      if (isInvalidLoginError(error)) {
        return {
          success: false,
          data: null,
          message: "Username atau password salah.",
          code: error.name,
        };
      }

      return mapSupabaseError(error, "Login gagal.");
    }

    if (!data.user) {
      return {
        success: false,
        data: null,
        message: "Username atau password salah.",
      };
    }

    await debugCurrentSession("after signInWithPassword", payload.email);

    return {
      success: true,
      data: {
        userId: data.user.id,
        email: data.user.email ?? null,
      },
      message: "Login berhasil.",
    };
  } catch (error) {
    return mapSupabaseError(error, "Login gagal.");
  }
}

export async function signOutAdmin(): Promise<ServiceResult<null>> {
  try {
    const { error } = await supabase.auth.signOut();

    if (error) {
      return mapSupabaseError(error, "Logout gagal.");
    }

    return {
      success: true,
      data: null,
      message: "Logout berhasil.",
    };
  } catch (error) {
    return mapSupabaseError(error, "Logout gagal.");
  }
}
