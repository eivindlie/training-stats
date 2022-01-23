const BASE_URL = "https://www.strava.com/oauth";
const SCOPE = "read,activity:read_all";

const dotenv = require("dotenv");
dotenv.config();
const path = require("path");
const express = require("express");
const fetch = require("node-fetch");

const port = process.env.PORT || 8080;
const app = express();

const isDevelopment = process.env.NODE_ENV === "development";

app.use(
  express.static("build", {
    etag: true,
    lastModified: true,
    setHeaders: (res, path) => {
      const hashRegExp = new RegExp("\\.[0-9a-f]{8}\\.");
      if (path.endsWith(".html")) {
        res.setHeader("Cache-Control", "no-cache");
      } else if (hashRegExp.test(path)) {
        res.setHeader("Cache-Control", "max-age=432000");
      }
    },
  })
);

app.get("/auth/strava/authorize", (request, response) => {
  const protocol = request.protocol;
  const host = request.get("host");
  const redirectUri = `${protocol}://${host}/oauth/callback`;
  response.redirect(
    `${BASE_URL}/authorize?client_id=${process.env.STRAVA_CLIENT_ID}&response_type=code&redirect_uri=${redirectUri}&approval_prompt=force&scope=${SCOPE}`
  );
});

app.post("/auth/strava/token", async (request, response) => {
  const url = `${BASE_URL}/token?client_id=${process.env.STRAVA_CLIENT_ID}&client_secret=${process.env.STRAVA_CLIENT_SECRET}&code=${request.query["code"]}&grant_type=authorization_code`;

  const tokenResponse = await fetch(url, {
    method: "POST",
  });

  response.send(await tokenResponse.text());
});

app.get("*", (_, response) => {
  response.sendFile(path.join(__dirname, "build/index.html"));
});

app.listen(port);
