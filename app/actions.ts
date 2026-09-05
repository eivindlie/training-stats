"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";

import { clearSession } from "@/lib/strava/auth";

export const logoutAction = async () => {
  const jar = await cookies();
  clearSession(jar);
  redirect("/");
};
