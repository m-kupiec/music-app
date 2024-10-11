import { createPKCECodeVerifier, generateCodeChallenge } from "./utils-pkce.ts";
import {
  getAuthorizationResponse,
  requestUserAuthorization,
} from "./utils-auth.ts";

// Spotify API docs: https://developer.spotify.com/documentation/web-api/tutorials/code-pkce-flow
export async function connectSpotifyAccount(
  phase: AccountConnectionPhase = "initialize",
) {
  if (phase === "handleAuth") {
    let authCode = "";
    let errorMsg = "";

    try {
      authCode = getAuthorizationResponse();
    } catch (error) {
      errorMsg = (error as Error).message;
    }

    if (errorMsg) return errorMsg;

    return authCode;
  }

  const codeVerifier = createPKCECodeVerifier();
  const codeChallenge = await generateCodeChallenge(codeVerifier);

  requestUserAuthorization(codeChallenge);
}
