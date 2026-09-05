import { cache } from "react";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

import { readSession } from "./auth";
import type { IActivity, IAthlete } from "./types";

const BASE_URL = "https://www.strava.com/api/v3";

const getAccessToken = async (): Promise<string> => {
  const jar = await cookies();
  const session = readSession(jar);
  if (!session) {
    // The proxy guards every page that calls this, so a missing session here
    // means the auth gate was bypassed somehow — fail loudly.
    throw new Error("No Strava session found for an authenticated request.");
  }
  return session.accessToken;
};

const get = async <T>(path: string): Promise<T> => {
  const accessToken = await getAccessToken();
  const response = await fetch(`${BASE_URL}${path}`, {
    headers: { Authorization: `Bearer ${accessToken}` },
    cache: "no-store",
  });

  if (response.status === 401) {
    // Our stored token looked like it still had time left, but Strava rejected it anyway
    // (e.g. the user revoked the app's access, or a cookie from a previous, differently
    // configured run is stale). There's no token to refresh our way out of this — send
    // the user back through login. Server Components can't clear cookies themselves, but
    // that's harmless: a successful login overwrites all three via /api/auth/callback.
    redirect("/api/auth/login");
  }

  if (!response.ok) {
    const body = await response.text().catch(() => "");
    throw new Error(
      `Strava request to ${path} failed with status ${response.status}: ${body}`
    );
  }

  return (await response.json()) as T;
};

export const getProfile = cache(async (): Promise<IAthlete> => get<IAthlete>("/athlete"));

export const getActivitiesBetween = async (
  startDate: Date,
  endDate: Date
): Promise<IActivity[]> => {
  const after = Math.floor(startDate.getTime() / 1000);
  const before = Math.floor(endDate.getTime() / 1000);
  return get<IActivity[]>(
    `/athlete/activities?after=${after}&before=${before}&per_page=200`
  );
};
