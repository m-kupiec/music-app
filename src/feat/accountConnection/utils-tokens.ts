import { appConfig } from "../../config";
import {
  spotifyApiTokenEndpoint,
  spotifyApiTokenRequestHeaders,
} from "./constants";

// RFC 6749: https://datatracker.ietf.org/doc/html/rfc6749#section-4.1.3
// Spotify API docs: https://developer.spotify.com/documentation/web-api/tutorials/code-pkce-flow#request-an-access-token
export async function requestTokens(authCode: string) {
  const codeVerifier = localStorage.getItem("codeVerifier");

  if (!codeVerifier) throw new Error("code_verifier_not_found");

  const requestParams: TokensRequestParams = {
    grant_type: "authorization_code",
    code: authCode,
    redirect_uri: appConfig.spotifyAuth.redirectUrl,
    client_id: appConfig.spotifyAuth.clientId,
    code_verifier: codeVerifier,
  };
  const requestBody = new URLSearchParams(requestParams);

  await fetch(spotifyApiTokenEndpoint, {
    method: "POST",
    headers: spotifyApiTokenRequestHeaders,
    body: requestBody,
  });
}
