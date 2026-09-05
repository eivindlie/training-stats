import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

import { buildAuthorizeUrl } from "@/lib/strava/auth";

export function GET(request: NextRequest) {
  const redirectUri = new URL("/api/auth/callback", request.url).toString();

  const authorizeUrl = buildAuthorizeUrl({
    clientId: process.env.STRAVA_CLIENT_ID!,
    redirectUri,
  });

  return NextResponse.redirect(authorizeUrl);
}
