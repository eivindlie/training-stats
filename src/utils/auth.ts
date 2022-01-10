import { ITokenResponse } from "../types/auth";

const CLIENT_ID = 76413;
const SCOPE = "read";
export const REDIRECT_PATH = "/oauth/callback";

const redirect_uri = window.location.origin + REDIRECT_PATH;

export const getToken = () => {
  return localStorage.getItem("access_token");
};

export const signIn = () => {
  window.location.replace(
    `https://www.strava.com/oauth/authorize?client_id=${CLIENT_ID}&response_type=code&redirect_uri=${redirect_uri}&approval_prompt=force&scope=${SCOPE}`
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

  const response = await fetch(
    `https://www.strava.com/oauth/token?client_id=${CLIENT_ID}&client_secret=${process.env.REACT_APP_STRAVA_CLIENT_SECRET}&code=${code}&grant_type=authorization_code`,
    {
      method: "POST",
    }
  );

  const data = (await response.json()) as ITokenResponse;
  localStorage.setItem("access_token", data.access_token);
  localStorage.setItem("token_expiration", data.expires_at.toString());
  localStorage.setItem("refresh_token", data.refresh_token);
};
