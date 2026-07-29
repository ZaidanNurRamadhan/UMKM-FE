import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import {
  ADMIN_SESSION_COOKIE,
  parseAdminSessionCookie,
} from "./lib/admin-session";

const ADMIN_BASE_PATH = "/admin";
const SIGN_IN_PATH = "/admin/sign-in";

export function middleware(req: NextRequest) {
  const { pathname, origin } = req.nextUrl;

  if (!pathname.startsWith(ADMIN_BASE_PATH)) {
    return NextResponse.next();
  }

  const sessionCookie = req.cookies.get(ADMIN_SESSION_COOKIE)?.value;
  const adminSession = parseAdminSessionCookie(sessionCookie);

  if (!adminSession) {
    if (pathname === SIGN_IN_PATH) {
      return NextResponse.next();
    }

    return NextResponse.redirect(new URL(SIGN_IN_PATH, origin));
  }

  if (pathname === ADMIN_BASE_PATH || pathname === `${ADMIN_BASE_PATH}/`) {
    return NextResponse.redirect(
      new URL(`${ADMIN_BASE_PATH}/${adminSession.villageSlug}`, origin),
    );
  }

  if (pathname === SIGN_IN_PATH) {
    return NextResponse.redirect(
      new URL(`${ADMIN_BASE_PATH}/${adminSession.villageSlug}`, origin),
    );
  }

  const pathParts = pathname.split("/").filter(Boolean);
  const routeVillage = pathParts[1];

  if (routeVillage && routeVillage !== adminSession.villageSlug) {
    return NextResponse.redirect(
      new URL(`${ADMIN_BASE_PATH}/${adminSession.villageSlug}`, origin),
    );
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*"],
};
