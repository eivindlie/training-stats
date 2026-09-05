import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

import {
  clearSession,
  decideAuthAction,
  propagateSession,
  readSession,
  refreshAccessToken,
  writeSession,
} from "@/lib/strava/auth";

// Guard every page (there are only two: "/" and "/profile", but this also
// covers any typo'd/unknown path so it 404s cleanly instead of crashing in
// Header's getProfile() call) — except the auth routes and static assets,
// or every redirect here would loop back into this proxy.
export const config = {
  matcher: ["/((?!api/auth|_next/static|_next/image|favicon.ico).*)"],
};

export async function proxy(request: NextRequest) {
  const session = readSession(request.cookies);
  const action = decideAuthAction(session);

  if (action === "continue") {
    return NextResponse.next();
  }

  if (action === "login") {
    return NextResponse.redirect(new URL("/api/auth/login", request.url));
  }

  // action === "refresh": session exists but is expiring soon.
  try {
    const refreshed = await refreshAccessToken({
      refreshToken: session!.refreshToken,
      clientId: process.env.STRAVA_CLIENT_ID!,
      clientSecret: process.env.STRAVA_CLIENT_SECRET!,
    });

    // Let this request's own Server Components see the fresh token...
    propagateSession(request.cookies, refreshed);
    const response = NextResponse.next({ request });
    // ...and persist it to the browser for subsequent requests.
    writeSession(response.cookies, refreshed);
    return response;
  } catch {
    // Refresh token was rejected (revoked access, expired refresh token) —
    // there's no valid session left, so start over.
    const response = NextResponse.redirect(new URL("/api/auth/login", request.url));
    clearSession(response.cookies);
    return response;
  }
}
