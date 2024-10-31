import { Tokens } from "../classes";
import { connectSpotifyAccount } from "../handlers";

export async function getWebApiBasedAction(
  webApiHandler: typeof connectSpotifyAccount,
) {
  try {
    await webApiHandler("userData");
    return "initDataProvide";
  } catch {
    return "initDataDeny";
  }
}

export async function getTokenApiBasedAction(
  tokenApiHandler: typeof connectSpotifyAccount,
  authCode: string,
) {
  try {
    await tokenApiHandler("tokens", authCode);
    return "initTokensProvide";
  } catch {
    return "initTokensDeny";
  }
}

export function getAuthBasedAction(
  authResponse: AuthResponse | undefined,
): ServerAction {
  // Authorization response
  if (authResponse === undefined) return "authPageDisplay";

  // Authorization success
  if (typeof authResponse === "string") return "authCodeProvide";

  // Authorization failure
  if (authResponse?.error) return "authCodeDeny";

  return "none";
}

export function getTokenBasedAction(tokens: Tokens | null): BrowserAction {
  if (!tokens) return "tokensNotFound";

  if (tokens.expirationTime > Date.now()) {
    return "initTokenValidated";
  } else {
    return "initTokenExpired";
  }
}
