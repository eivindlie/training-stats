import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

import { exchangeCode, writeSession } from "@/lib/strava/auth";

export async function GET(request: NextRequest) {
  const code = request.nextUrl.searchParams.get("code");
  if (!code) {
    return NextResponse.redirect(new URL("/api/auth/login", request.url));
  }

  const session = await exchangeCode({
    code,
    clientId: process.env.STRAVA_CLIENT_ID!,
    clientSecret: process.env.STRAVA_CLIENT_SECRET!,
  });

  const response = NextResponse.redirect(new URL("/", request.url));
  writeSession(response.cookies, session);
  return response;
}
