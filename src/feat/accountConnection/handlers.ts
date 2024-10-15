import { createPKCECodeVerifier, generateCodeChallenge } from "./utils-pkce";
import {
  extractAuthResponseFromLocation,
  requestAuthFromUser,
} from "./utils-auth";
import { handleTokenApiJson, requestTokens } from "./utils-tokens";
import { requestUserProfile } from "./utils-webApi";

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

    // Handle user profile data request and response
    try {
      await requestUserProfile();
    } catch (error) {
      throw new Error((error as Error).message);
    }

    return;
  }

  const codeVerifier = createPKCECodeVerifier();
  const codeChallenge = await generateCodeChallenge(codeVerifier);

  requestAuthFromUser(codeChallenge);
}
