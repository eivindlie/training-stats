import * as functions from "firebase-functions";

const BASE_URL = "https://www.strava.com/oauth";
const SCOPE = "read,activity:read_all";
const REDIRECT_URI =
  "https://us-central1-training-stats-ela.cloudfunctions.net/redirect";

export const authorize = functions.https.onRequest(
  async (request, response) => {
    response.redirect(
      `${BASE_URL}/authorize?client_id=${
        functions.config().strava.clientid
      }&response_type=code&redirect_uri=${REDIRECT_URI}&approval_prompt=force&scope=${SCOPE}&state=${
        request.query.state
      }`
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

export const redirect = functions.https.onRequest(async (request, response) => {
  const state = JSON.parse(request.query.state as string);
  let url: string;
  if (state["environment"] === "development") {
    url = "http://localhost:3000/oauth/callback";
  } else {
    url = "https://training-stats.andreassen.info/oauth/callback";
  }
  response.redirect(`${url}?code=${request.query.code}`);
});
