import { createPKCECodeVerifier, generateCodeChallenge } from "./utils/pkce";
import { requestAuthFromUser } from "./utils/auth";
import { handleTokenApiJson, requestTokens } from "./utils/tokens";
import {
  handleWebApiUserProfileJson,
  requestUserProfile,
} from "./utils/webApi";

// Spotify API docs: https://developer.spotify.com/documentation/web-api/tutorials/code-pkce-flow
export async function connectSpotifyAccount(
  phase: AccountConnectionPhase,
  authCode?: string,
) {
  if (phase === "auth") {
    const codeVerifier = createPKCECodeVerifier();
    const codeChallenge = await generateCodeChallenge(codeVerifier);
    requestAuthFromUser(codeChallenge);
  } else if (phase === "tokens" && authCode) {
    const tokenApiJson = await requestTokens(authCode);
    handleTokenApiJson(tokenApiJson);
  } else if (phase === "userData") {
    const webApiUserProfileJson = await requestUserProfile();
    handleWebApiUserProfileJson(webApiUserProfileJson);
  }
}
