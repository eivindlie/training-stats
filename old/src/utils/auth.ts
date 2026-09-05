import { ITokenResponse } from "../types/auth";
export const REDIRECT_PATH = "/oauth/callback";

const BASE_URL = "https://us-central1-training-stats-ela.cloudfunctions.net";

export const getToken = () => {
  return localStorage.getItem("access_token");
};

export const signIn = () => {
  window.location.replace(
    `${BASE_URL}/authorize?state=${JSON.stringify({
      environment: process.env.NODE_ENV,
    })}`
  );
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

  const response = await fetch(`${BASE_URL}/token?code=${code}`, {
    method: "POST",
  });

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
