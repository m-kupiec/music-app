import { createPKCECodeVerifier, generateCodeChallenge } from "./utils-pkce.ts";
import {
  getAuthorizationResponse,
  requestUserAuthorization,
} from "./utils-auth.ts";
import { requestTokens } from "./utils-tokens.ts";

// Spotify API docs: https://developer.spotify.com/documentation/web-api/tutorials/code-pkce-flow
export async function connectSpotifyAccount(
  phase: AccountConnectionPhase = "initialize",
) {
  if (phase === "handleAuth") {
    let authCode = "";

    try {
      authCode = getAuthorizationResponse();
      await requestTokens(authCode);
    } catch (error) {
      throw new Error((error as Error).message);
    }

    return;
  }

  const codeVerifier = createPKCECodeVerifier();
  const codeChallenge = await generateCodeChallenge(codeVerifier);

  requestUserAuthorization(codeChallenge);
}
