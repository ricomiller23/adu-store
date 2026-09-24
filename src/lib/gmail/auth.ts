// src/lib/gmail/auth.ts — Gmail OAuth2 client
import { google } from "googleapis";
import { OAuth2Client } from "google-auth-library";

let _client: OAuth2Client | null = null;

export function getOAuth2Client(): OAuth2Client {
  if (_client) return _client;

  const clientId = process.env.GOOGLE_CLIENT_ID;
  const clientSecret = process.env.GOOGLE_CLIENT_SECRET;
  const refreshToken = process.env.GOOGLE_REFRESH_TOKEN;

  if (!clientId || !clientSecret) {
    throw new Error("Missing GOOGLE_CLIENT_ID or GOOGLE_CLIENT_SECRET.");
  }

  _client = new google.auth.OAuth2(
    clientId,
    clientSecret,
    "http://localhost:4321/oauth2callback"
  );

  if (refreshToken) {
    _client.setCredentials({ refresh_token: refreshToken });
  }

  return _client;
}

export function isAuthConfigured(): boolean {
  return !!(process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET && process.env.GOOGLE_REFRESH_TOKEN);
}
