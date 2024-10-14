import { createPKCECodeVerifier, generateCodeChallenge } from "./utils-pkce.ts";
import {
  extractAuthResponseFromLocation,
  requestAuthFromUser,
} from "./utils-auth.ts";
import { handleTokenApiJson, requestTokens } from "./utils-tokens.ts";

// Spotify API docs: https://developer.spotify.com/documentation/web-api/tutorials/code-pkce-flow
export async function connectSpotifyAccount(
  phase: AccountConnectionPhase = "requestAuth",
) {
  if (phase === "handleAuth") {
    let authCode = "";
    let tokenApiJson: TokenApiJson;

    // Handle authorization request and response
    try {
      authCode = extractAuthResponseFromLocation();
    } catch (error) {
      throw new Error((error as Error).message);
    }

    // Handle tokens request and response
    try {
      tokenApiJson = await requestTokens(authCode);
    } catch (error) {
      tokenApiJson = { error: (error as Error).message };
    }
    handleTokenApiJson(tokenApiJson);

    return;
  }

  const codeVerifier = createPKCECodeVerifier();
  const codeChallenge = await generateCodeChallenge(codeVerifier);

  requestAuthFromUser(codeChallenge);
}
