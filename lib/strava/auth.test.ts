import { afterEach, describe, expect, it, vi } from "vitest";

import {
  ACCESS_TOKEN_COOKIE,
  EXPIRES_AT_COOKIE,
  REFRESH_TOKEN_COOKIE,
  buildAuthorizeUrl,
  clearSession,
  decideAuthAction,
  exchangeCode,
  isExpiringSoon,
  propagateSession,
  readSession,
  refreshAccessToken,
  writeSession,
  type Session,
} from "./auth";

class FakeCookieJar {
  private store = new Map<string, string>();

  get(name: string) {
    const value = this.store.get(name);
    return value === undefined ? undefined : { value };
  }

  set(name: string, value: string) {
    this.store.set(name, value);
  }

  delete(name: string) {
    this.store.delete(name);
  }
}

const session: Session = {
  accessToken: "access-123",
  refreshToken: "refresh-456",
  expiresAt: 1_700_000_000,
};

describe("isExpiringSoon", () => {
  it("is false when the token has plenty of time left", () => {
    expect(isExpiringSoon(2000, 0)).toBe(false);
  });

  it("is true once within the refresh buffer", () => {
    expect(isExpiringSoon(1000, 999)).toBe(true);
  });

  it("is true once already expired", () => {
    expect(isExpiringSoon(1000, 1500)).toBe(true);
  });
});

describe("decideAuthAction", () => {
  it("says login when there is no session at all", () => {
    expect(decideAuthAction(null, 0)).toBe("login");
  });

  it("says refresh when the session is expiring soon", () => {
    expect(decideAuthAction({ ...session, expiresAt: 1000 }, 999)).toBe("refresh");
  });

  it("says continue when the session is still fresh", () => {
    expect(decideAuthAction({ ...session, expiresAt: 2000 }, 0)).toBe("continue");
  });
});

describe("buildAuthorizeUrl", () => {
  it("includes client id, redirect uri, response type and scope", () => {
    const url = new URL(
      buildAuthorizeUrl({
        clientId: "my-client-id",
        redirectUri: "https://example.com/api/auth/callback",
      })
    );

    expect(url.origin + url.pathname).toBe("https://www.strava.com/oauth/authorize");
    expect(url.searchParams.get("client_id")).toBe("my-client-id");
    expect(url.searchParams.get("redirect_uri")).toBe(
      "https://example.com/api/auth/callback"
    );
    expect(url.searchParams.get("response_type")).toBe("code");
    expect(url.searchParams.get("scope")).toBe("read,activity:read_all");
  });

  it("carries through an optional state param", () => {
    const url = new URL(
      buildAuthorizeUrl({
        clientId: "id",
        redirectUri: "https://example.com/callback",
        state: "xyz",
      })
    );

    expect(url.searchParams.get("state")).toBe("xyz");
  });
});

describe("session cookie round-trip", () => {
  it("reads back exactly what was written", () => {
    const jar = new FakeCookieJar();
    writeSession(jar, session);

    expect(readSession(jar)).toEqual(session);
  });

  it("returns null when any cookie is missing", () => {
    const jar = new FakeCookieJar();
    jar.set(ACCESS_TOKEN_COOKIE, "only-access-token");

    expect(readSession(jar)).toBeNull();
  });

  it("clears all three cookies", () => {
    const jar = new FakeCookieJar();
    writeSession(jar, session);
    clearSession(jar);

    expect(readSession(jar)).toBeNull();
  });

  it("propagateSession sets the same three values via a 2-arg-only setter", () => {
    const jar = new FakeCookieJar();
    propagateSession(jar, session);

    expect(jar.get(ACCESS_TOKEN_COOKIE)?.value).toBe(session.accessToken);
    expect(jar.get(REFRESH_TOKEN_COOKIE)?.value).toBe(session.refreshToken);
    expect(jar.get(EXPIRES_AT_COOKIE)?.value).toBe(session.expiresAt.toString());
  });
});

describe("Strava token requests", () => {
  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it("exchangeCode sends an authorization_code grant and maps the response", async () => {
    const fetchMock = vi.fn(async (url: URL) => {
      expect(url.searchParams.get("grant_type")).toBe("authorization_code");
      expect(url.searchParams.get("code")).toBe("the-code");
      expect(url.searchParams.get("client_id")).toBe("id");
      expect(url.searchParams.get("client_secret")).toBe("secret");
      return new Response(
        JSON.stringify({
          access_token: "new-access",
          refresh_token: "new-refresh",
          expires_at: 123,
        }),
        { status: 200 }
      );
    });
    vi.stubGlobal("fetch", fetchMock);

    const result = await exchangeCode({ code: "the-code", clientId: "id", clientSecret: "secret" });

    expect(result).toEqual({
      accessToken: "new-access",
      refreshToken: "new-refresh",
      expiresAt: 123,
    });
  });

  it("refreshAccessToken sends a refresh_token grant", async () => {
    const fetchMock = vi.fn(async (url: URL) => {
      expect(url.searchParams.get("grant_type")).toBe("refresh_token");
      expect(url.searchParams.get("refresh_token")).toBe("old-refresh");
      return new Response(
        JSON.stringify({
          access_token: "refreshed-access",
          refresh_token: "refreshed-refresh",
          expires_at: 456,
        }),
        { status: 200 }
      );
    });
    vi.stubGlobal("fetch", fetchMock);

    const result = await refreshAccessToken({
      refreshToken: "old-refresh",
      clientId: "id",
      clientSecret: "secret",
    });

    expect(result.accessToken).toBe("refreshed-access");
  });

  it("throws when Strava responds with an error status", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn(async () => new Response("nope", { status: 401 }))
    );

    await expect(
      refreshAccessToken({ refreshToken: "bad", clientId: "id", clientSecret: "secret" })
    ).rejects.toThrow();
  });
});
