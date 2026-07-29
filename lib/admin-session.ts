export type AdminSession = {
  role: "admin";
  villageSlug: string;
};

export const ADMIN_SESSION_COOKIE = "admin_session";

export function createAdminSessionCookieValue(session: AdminSession): string {
  return encodeURIComponent(JSON.stringify(session));
}

export function parseAdminSessionCookie(value: string | undefined): AdminSession | null {
  if (!value) {
    return null;
  }

  try {
    const decoded = decodeURIComponent(value);
    const parsed = JSON.parse(decoded) as AdminSession;

    if (
      parsed &&
      parsed.role === "admin" &&
      typeof parsed.villageSlug === "string" &&
      parsed.villageSlug.length > 0
    ) {
      return parsed;
    }

    return null;
  } catch {
    return null;
  }
}

export function setAdminSessionCookie(session: AdminSession) {
  if (typeof document === "undefined") {
    return;
  }

  const value = createAdminSessionCookieValue(session);
  document.cookie = `${ADMIN_SESSION_COOKIE}=${value}; path=/; max-age=31536000; sameSite=strict`;
}

export function removeAdminSessionCookie() {
  if (typeof document === "undefined") {
    return;
  }

  document.cookie = `${ADMIN_SESSION_COOKIE}=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT; sameSite=strict`;
}
