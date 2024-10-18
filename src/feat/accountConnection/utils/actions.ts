import { Tokens } from "../classes";

export function getTokenBasedAction(tokens: Tokens | null): BrowserAction {
  if (!tokens) return "tokensNotFound";

  if (tokens.expirationTime > Date.now()) {
    return "initTokenValidated";
  } else {
    return "initTokenExpired";
  }
}
