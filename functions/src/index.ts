import * as functions from "firebase-functions";

const BASE_URL = "https://www.strava.com/oauth";
const SCOPE = "read,activity:read_all";

export const authorize = functions.https.onRequest(
  async (request, response) => {
    const redirectUri = request.query.redirect_uri;
    response.redirect(
      `${BASE_URL}/authorize?client_id=${
        functions.config().strava.clientid
      }&response_type=code&redirect_uri=${redirectUri}&approval_prompt=force&scope=${SCOPE}`
    );
  }
);

export const token = functions.https.onRequest(async (request, response) => {
  const url = `${BASE_URL}/token?client_id=${
    functions.config().strava.clientid
  }&client_secret=${functions.config().strava.clientsecret}&code=${
    request.query.code
  }&grant_type=authorization_code`;

  const tokenResponse = await fetch(url, {
    method: "POST",
  });

  response.send(await tokenResponse.text());
});
