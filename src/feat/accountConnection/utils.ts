import { Tokens } from "./classes.ts";

export function getTokens(): Tokens | null {
  const item = localStorage.getItem("tokens");

  if (!item) return null;

  const tokens: TokensData = JSON.parse(item) as TokensData;

  if (!tokens.accessToken) return null;
  if (!tokens.refreshToken) return null;
  if (!tokens.expirationLength) return null;
  if (!tokens.expirationTime) return null;

  return new Tokens({ ...tokens });
}

export function getTokenBasedAction(tokens: Tokens | null): BrowserAction {
  if (!tokens) return "tokensNotFound";

  if (tokens.expirationTime > Date.now()) {
    return "initTokenValidated";
  } else {
    return "initTokenExpired";
  }
}

export function getAccountConnectionStatus(
  action: Action,
): AccountConnectionStatus {
  switch (action) {
    case "none":
    case "tokensNotFound":
      return "none";
    case "initTokenValidated":
    case "initTokenExpired":
    case "initTokensProvide":
    case "moreTokensProvide":
      return "pending";
    case "accountConnect":
    case "authPageDisplay":
      return "initiated";
    case "authCodeProvide":
      return "authorized";
    case "authCodeDeny":
      return "unauthorized";
    case "initTokensDeny":
    case "initDataDeny":
      return "failed";
    case "initDataProvide":
    case "requestAccept":
      return "ok";
    case "refrTokenExpired":
    case "refrTokenValidated":
      return "updating";
    case "moreTokensDeny":
    case "requestDeny":
      return "broken";
    case "accountDisconnect":
      return "closed";
    default:
      return "none";
  }
}
