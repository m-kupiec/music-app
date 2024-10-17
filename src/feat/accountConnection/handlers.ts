import { createPKCECodeVerifier, generateCodeChallenge } from "./utils/pkce";
import {
  extractAuthResponseFromLocation,
  requestAuthFromUser,
} from "./utils/auth";
import { handleTokenApiJson, requestTokens } from "./utils/tokens";
import {
  handleWebApiUserProfileJson,
  requestUserProfile,
} from "./utils/webApi";
import { AuthError } from "./classes";

// Spotify API docs: https://developer.spotify.com/documentation/web-api/tutorials/code-pkce-flow
export async function connectSpotifyAccount(phase: AccountConnectionPhase) {
  if (phase === "requestAuth") {
    const codeVerifier = createPKCECodeVerifier();
    const codeChallenge = await generateCodeChallenge(codeVerifier);

    requestAuthFromUser(codeChallenge);
  } else if (phase === "handleAuth") {
    const authCode = getAuthCode();

    await handleFetchingTokens(authCode);
    await handleFetchingUserProfile();
  }
}

function getAuthCode(): string {
  let authCode = "";

  try {
    authCode = extractAuthResponseFromLocation();
  } catch (error) {
    if (error instanceof AuthError) throw new Error(error.getDetails());

    throw new Error((error as Error).message);
  }

  return authCode;
}

async function handleFetchingTokens(authCode: string) {
  let tokenApiJson: TokenApiJson;

  try {
    tokenApiJson = await requestTokens(authCode);
  } catch (error) {
    throw new Error((error as Error).message);
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
