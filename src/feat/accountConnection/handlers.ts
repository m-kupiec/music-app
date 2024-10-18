import { createPKCECodeVerifier, generateCodeChallenge } from "./utils/pkce";
import {
  extractAuthResponseQueryValues,
  requestAuthFromUser,
} from "./utils/auth";
import { handleTokenApiJson, requestTokens } from "./utils/tokens";
import {
  handleWebApiUserProfileJson,
  requestUserProfile,
} from "./utils/webApi";

// Spotify API docs: https://developer.spotify.com/documentation/web-api/tutorials/code-pkce-flow
export async function connectSpotifyAccount(phase: AccountConnectionPhase) {
  if (phase === "requestAuth") {
    const codeVerifier = createPKCECodeVerifier();
    const codeChallenge = await generateCodeChallenge(codeVerifier);

    requestAuthFromUser(codeChallenge);
  } else if (phase === "handleAuth") {
    const authCode = extractAuthResponseQueryValues();

    const tokenApiJson: TokenApiJson = await requestTokens(authCode);
    handleTokenApiJson(tokenApiJson);

    const webApiUserProfileJson: WebApiUserProfileJson =
      await requestUserProfile();
    handleWebApiUserProfileJson(webApiUserProfileJson);
  }
}
