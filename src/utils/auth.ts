import { ITokenResponse } from "../types/auth";

const CLIENT_ID = 76413;
const SCOPE = "read,activity:read_all";
export const REDIRECT_PATH = "/oauth/callback";

const redirect_uri = window.location.origin + REDIRECT_PATH;

export const getToken = () => {
  return localStorage.getItem("access_token");
};

export const signIn = () => {
  window.location.replace(window.location.origin + "/auth/strava/authorize");
};

export const isSignedIn = () => {
  const access_token = localStorage.getItem("access_token");
  if (!access_token) {
    return false;
  }

  const expiration_string = localStorage.getItem("token_expiration");

  if (
    !expiration_string ||
    parseInt(expiration_string) < Date.now() / 1000 - 5
  ) {
    return false;
  }

  return true;
};

export const handle_callback = async () => {
  const params = new URLSearchParams(window.location.search);
  const code = params.get("code");

  const response = await fetch(
    `${window.location.origin}/auth/strava/token?code=${code}`,
    {
      method: "POST",
    }
  );

  const data = (await response.json()) as ITokenResponse;
  localStorage.setItem("access_token", data.access_token);
  localStorage.setItem("token_expiration", data.expires_at.toString());
  localStorage.setItem("refresh_token", data.refresh_token);

  window.location.replace(window.location.origin);
};

export const signOut = () => {
  localStorage.removeItem("access_token");
  localStorage.removeItem("token_expiration");
  localStorage.removeItem("refresh_token");

  window.location.replace(window.location.origin);
};
