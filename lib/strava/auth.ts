import type { ITokenResponse } from "./types";

const AUTHORIZE_URL = "https://www.strava.com/oauth/authorize";
const TOKEN_URL = "https://www.strava.com/oauth/token";
const SCOPE = "read,activity:read_all";

export const ACCESS_TOKEN_COOKIE = "sa_access_token";
export const REFRESH_TOKEN_COOKIE = "sa_refresh_token";
export const EXPIRES_AT_COOKIE = "sa_expires_at";

// Refresh the access token once it's within this many seconds of expiring,
// rather than waiting for it to actually fail.
export const REFRESH_BUFFER_SECONDS = 600;

export interface Session {
  accessToken: string;
  refreshToken: string;
  /** Unix timestamp (seconds) at which the access token expires. */
  expiresAt: number;
}

/**
 * Minimal structural interfaces satisfied by Next.js's cookie types
 * (`ReadonlyRequestCookies` in Server Components, `RequestCookies` in the
 * proxy, `ResponseCookies` in route handlers/actions), so this module has no
 * compile-time dependency on `next/headers` or `next/server`.
 */
export interface CookieReader {
  get(name: string): { value: string } | undefined;
}

export interface CookieWriter extends CookieReader {
  set(
    name: string,
    value: string,
    options?: {
      httpOnly?: boolean;
      secure?: boolean;
      sameSite?: "lax" | "strict" | "none";
      path?: string;
      maxAge?: number;
    }
  ): void;
  delete(name: string): void;
}

export const buildAuthorizeUrl = (params: {
  clientId: string;
  redirectUri: string;
  state?: string;
}): string => {
  const url = new URL(AUTHORIZE_URL);
  url.searchParams.set("client_id", params.clientId);
  url.searchParams.set("response_type", "code");
  url.searchParams.set("redirect_uri", params.redirectUri);
  url.searchParams.set("scope", SCOPE);
  if (params.state) {
    url.searchParams.set("state", params.state);
  }
  return url.toString();
};

const toSession = (token: ITokenResponse): Session => ({
  accessToken: token.access_token,
  refreshToken: token.refresh_token,
  expiresAt: token.expires_at,
});

const requestToken = async (params: Record<string, string>): Promise<Session> => {
  const url = new URL(TOKEN_URL);
  for (const [key, value] of Object.entries(params)) {
    url.searchParams.set(key, value);
  }

  const response = await fetch(url, { method: "POST" });
  if (!response.ok) {
    throw new Error(`Strava token request failed with status ${response.status}`);
  }

  return toSession((await response.json()) as ITokenResponse);
};

export const exchangeCode = (params: {
  code: string;
  clientId: string;
  clientSecret: string;
}): Promise<Session> =>
  requestToken({
    client_id: params.clientId,
    client_secret: params.clientSecret,
    code: params.code,
    grant_type: "authorization_code",
  });

export const refreshAccessToken = (params: {
  refreshToken: string;
  clientId: string;
  clientSecret: string;
}): Promise<Session> =>
  requestToken({
    client_id: params.clientId,
    client_secret: params.clientSecret,
    refresh_token: params.refreshToken,
    grant_type: "refresh_token",
  });

export const isExpiringSoon = (
  expiresAt: number,
  now: number = Date.now() / 1000
): boolean => expiresAt - now < REFRESH_BUFFER_SECONDS;

/** What the caller (proxy) should do given the current cookies, before rendering a protected page. */
export type AuthAction = "continue" | "refresh" | "login";

export const decideAuthAction = (
  session: Session | null,
  now: number = Date.now() / 1000
): AuthAction => {
  if (!session?.refreshToken) {
    return "login";
  }
  if (isExpiringSoon(session.expiresAt, now)) {
    return "refresh";
  }
  return "continue";
};

export const readSession = (jar: CookieReader): Session | null => {
  const accessToken = jar.get(ACCESS_TOKEN_COOKIE)?.value;
  const refreshToken = jar.get(REFRESH_TOKEN_COOKIE)?.value;
  const expiresAt = jar.get(EXPIRES_AT_COOKIE)?.value;

  if (!accessToken || !refreshToken || !expiresAt) {
    return null;
  }

  return { accessToken, refreshToken, expiresAt: Number(expiresAt) };
};

export const writeSession = (jar: CookieWriter, session: Session): void => {
  const options = {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax" as const,
    path: "/",
  };

  jar.set(ACCESS_TOKEN_COOKIE, session.accessToken, options);
  jar.set(REFRESH_TOKEN_COOKIE, session.refreshToken, options);
  jar.set(EXPIRES_AT_COOKIE, session.expiresAt.toString(), options);
};

export const clearSession = (jar: CookieWriter): void => {
  jar.delete(ACCESS_TOKEN_COOKIE);
  jar.delete(REFRESH_TOKEN_COOKIE);
  jar.delete(EXPIRES_AT_COOKIE);
};

/**
 * Next.js's request-side cookie jar (`request.cookies` in the proxy) only
 * supports a plain `set(name, value)` — cookie attributes like `httpOnly`
 * don't apply to it, since it never produces a `Set-Cookie` header. Use this
 * to make a refreshed session visible to the *current* request's Server
 * Components; use `writeSession` (with a `CookieWriter`) to actually persist
 * it to the browser via the response.
 */
export interface RequestCookieWriter extends CookieReader {
  set(name: string, value: string): unknown;
}

export const propagateSession = (jar: RequestCookieWriter, session: Session): void => {
  jar.set(ACCESS_TOKEN_COOKIE, session.accessToken);
  jar.set(REFRESH_TOKEN_COOKIE, session.refreshToken);
  jar.set(EXPIRES_AT_COOKIE, session.expiresAt.toString());
};
