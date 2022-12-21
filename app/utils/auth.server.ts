const { CLIENT_ID, CLIENT_SECRET } = process.env;

if (!CLIENT_ID) throw new Error("Missing CLIENT_ID.")
if (!CLIENT_SECRET) throw new Error("Missing CLIENT_SECRET.")

const auth = {
  name: "SERVICE_NAME",
  clientId: CLIENT_ID,
  clientSecret: CLIENT_SECRET,
  callbackURL: process.env.NODE_ENV === "production" ? "https://HOSTNAME/auth/redirect" : "http://localhost:3000/auth/redirect"
};

import { redirect } from "@remix-run/node";
import { Authenticator } from "remix-auth";
import { OAuth2Strategy } from "remix-auth-oauth2";
import { sessionStorage } from "./session.server";

export type User = {
  accessToken: string;
  refreshToken: string;
};

const SESSIONKEY = "user";

// Create an instance of the authenticator, pass a generic with what
// strategies will return and will store in the session
export let authenticator = new Authenticator<User>(sessionStorage, { sessionKey: SESSIONKEY });
let strategy = new OAuth2Strategy(
  {
    clientID: auth.clientId,
    clientSecret: auth.clientSecret,
    callbackURL: auth.callbackURL,
    authorizationURL: "SERVICE_AUTH_URL",
    tokenURL: "SERVICE_TOKEN_URL"
  },
  async ({ accessToken, refreshToken, extraParams, profile }) => {
    const expires_in = extraParams.expires_in as number;
    const tokenExpires = Date.now() + (expires_in * 1000);
    return { handle: profile.displayName ?? "", accessToken, refreshToken, tokenExpires };
  }
);
authenticator.use(strategy, auth.name);

