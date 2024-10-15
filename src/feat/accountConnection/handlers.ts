import { createPKCECodeVerifier, generateCodeChallenge } from "./utils-pkce";
import {
  extractAuthResponseFromLocation,
  requestAuthFromUser,
} from "./utils-auth";
import { handleTokenApiJson, requestTokens } from "./utils-tokens";
import {
  handleWebApiUserProfileJson,
  requestUserProfile,
} from "./utils-webApi";

// Spotify API docs: https://developer.spotify.com/documentation/web-api/tutorials/code-pkce-flow
export async function connectSpotifyAccount(
  phase: AccountConnectionPhase = "requestAuth",
) {
  if (phase === "handleAuth") {
    const authCode = getAuthCode();

    await handleFetchingTokens(authCode);
    await handleFetchingUserProfile();

    return;
  }

  const codeVerifier = createPKCECodeVerifier();
  const codeChallenge = await generateCodeChallenge(codeVerifier);

  requestAuthFromUser(codeChallenge);
}

function getAuthCode(): string {
  let authCode = "";

  try {
    authCode = extractAuthResponseFromLocation();
  } catch (error) {
    throw new Error((error as Error).message);
  }

  return authCode;
}

async function handleFetchingTokens(authCode: string) {
  let tokenApiJson: TokenApiJson;

  try {
    tokenApiJson = await requestTokens(authCode);
  } catch (error) {
    tokenApiJson = { error: (error as Error).message };
  }

  handleTokenApiJson(tokenApiJson);
}

async function handleFetchingUserProfile() {
  let webApiUserProfileJson: WebApiUserProfileJson;

  try {
    webApiUserProfileJson = await requestUserProfile();
  } catch (error) {
    webApiUserProfileJson = { error: (error as Error).message };
  }

  handleWebApiUserProfileJson(webApiUserProfileJson);
}
