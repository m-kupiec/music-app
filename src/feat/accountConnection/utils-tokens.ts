import { appConfig } from "../../config";
import { Tokens } from "./classes";
import {
  spotifyApiTokenEndpoint,
  spotifyApiTokenRequestHeaders,
} from "./constants";
import { popCodeVerifierFromStorage } from "./utils-pkce";
import * as tokens from "./utils-tokens";

// RFC 6749: https://datatracker.ietf.org/doc/html/rfc6749#section-4.1.3
// Spotify API docs: https://developer.spotify.com/documentation/web-api/tutorials/code-pkce-flow#request-an-access-token
export async function requestTokens(authCode: string) {
  const codeVerifier = popCodeVerifierFromStorage();

  const requestParams: TokenApiRequestParams = {
    grant_type: "authorization_code",
    code: authCode,
    redirect_uri: appConfig.spotifyAuth.redirectUrl,
    client_id: appConfig.spotifyAuth.clientId,
    code_verifier: codeVerifier,
  };
  const requestBody = new URLSearchParams(requestParams);

  try {
    const response = await fetch(spotifyApiTokenEndpoint, {
      method: "POST",
      headers: spotifyApiTokenRequestHeaders,
      body: requestBody,
    });

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }

    const data = (await response.json()) as TokenApiSuccessJson;

    return data;
  } catch (error) {
    throw new Error((error as Error).message);
  }
}

// RFC 6749, Section 4.1.4: https://datatracker.ietf.org/doc/html/rfc6749#section-4.1.4
// RFC 6749, Section 5.2: https://datatracker.ietf.org/doc/html/rfc6749#section-5.2
// Spotify API docs: https://developer.spotify.com/documentation/web-api/tutorials/code-pkce-flow#response-1
export function handleTokenApiJson(apiJson: TokenApiJson): void {
  if ("error" in apiJson) throw new Error(apiJson.error);

  tokens.storeTokens(apiJson);
}

export function storeTokens(apiJson: TokenApiSuccessJson): void {
  const tokensData: Tokens | null = tokens.extractTokensFromApiJson(apiJson);

  if (!tokensData) throw new Error("invalid_tokens_data");

  localStorage.setItem("tokens", JSON.stringify(tokensData));
}

// RFC 6749: https://datatracker.ietf.org/doc/html/rfc6749#section-4.1.4
// Spotify API docs: https://developer.spotify.com/documentation/web-api/tutorials/code-pkce-flow#response-1
export function extractTokensFromApiJson(
  apiJson: TokenApiSuccessJson,
): Tokens | null {
  if (!apiJson?.access_token) return null;
  if (!apiJson?.refresh_token) return null;
  if (!apiJson?.expires_in) return null;

  return new Tokens({
    accessToken: apiJson.access_token,
    refreshToken: apiJson.refresh_token,
    expirationLength: apiJson.expires_in,
    expirationTime: calculateTokensExpirationTime(apiJson.expires_in),
  });
}

// Spotify API docs: https://developer.spotify.com/documentation/web-api/tutorials/code-pkce-flow#response-1
export function calculateTokensExpirationTime(
  expirationLength: TokenData["expirationLength"],
): TokenData["expirationTime"] {
  const currentTime = new Date().getTime();
  const expirationMiliseconds = Number(expirationLength) * 1000;

  // Count tokens as expired 1 minute in advance
  const timeBuffer = 1000 * 60;

  const tokensExpirationTime = currentTime + expirationMiliseconds - timeBuffer;

  return tokensExpirationTime;
}

export function getTokensFromStorage(): Tokens | null {
  const item = localStorage.getItem("tokens");

  if (!item) return null;

  const tokens: TokenData = JSON.parse(item) as TokenData;

  if (!tokens?.accessToken) return null;
  if (!tokens?.refreshToken) return null;
  if (!tokens?.expirationLength) return null;
  if (!tokens?.expirationTime) return null;

  return new Tokens({ ...tokens });
}
