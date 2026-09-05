import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { ACCESS_TOKEN_COOKIE, EXPIRES_AT_COOKIE, REFRESH_TOKEN_COOKIE } from "./auth";

const { cookiesMock, redirectMock } = vi.hoisted(() => ({
  cookiesMock: vi.fn(),
  redirectMock: vi.fn((url: string) => {
    throw new Error(`REDIRECT:${url}`);
  }),
}));

vi.mock("next/headers", () => ({
  cookies: () => cookiesMock(),
}));

vi.mock("next/navigation", () => ({
  redirect: (url: string) => redirectMock(url),
}));

const { getActivitiesBetween } = await import("./client");

const validJar = () => ({
  get: (name: string) => {
    const values: Record<string, string> = {
      [ACCESS_TOKEN_COOKIE]: "token-abc",
      [REFRESH_TOKEN_COOKIE]: "refresh-abc",
      [EXPIRES_AT_COOKIE]: "9999999999",
    };
    return values[name] !== undefined ? { value: values[name] } : undefined;
  },
});

const YEAR_START = new Date(2024, 0, 1);
const YEAR_END = new Date(2024, 11, 31);

describe("getActivitiesBetween", () => {
  beforeEach(() => {
    cookiesMock.mockResolvedValue(validJar());
  });

  afterEach(() => {
    vi.unstubAllGlobals();
    redirectMock.mockClear();
  });

  it("returns the parsed activities on success", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn(async () => new Response(JSON.stringify([{ id: 1 }]), { status: 200 }))
    );

    await expect(getActivitiesBetween(YEAR_START, YEAR_END)).resolves.toEqual([{ id: 1 }]);
  });

  it("redirects to login instead of throwing when Strava returns 401", async () => {
    vi.stubGlobal("fetch", vi.fn(async () => new Response("nope", { status: 401 })));

    await expect(getActivitiesBetween(YEAR_START, YEAR_END)).rejects.toThrow(
      "REDIRECT:/api/auth/login"
    );
    expect(redirectMock).toHaveBeenCalledWith("/api/auth/login");
  });

  it("throws a descriptive error for other failure statuses", async () => {
    vi.stubGlobal("fetch", vi.fn(async () => new Response("boom", { status: 500 })));

    await expect(getActivitiesBetween(YEAR_START, YEAR_END)).rejects.toThrow(/status 500/);
    expect(redirectMock).not.toHaveBeenCalled();
  });
});
