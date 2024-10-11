type AccountConnectionPhase = "initialize" | "handleAuth";

// RFC 6749: https://datatracker.ietf.org/doc/html/rfc6749#section-4.1.1
interface AuthParams {
  [index: string]: string;

  client_id: string;
  response_type: "code";
  redirect_uri: string;
  state?: string;
  scope?: string;
  code_challenge_method: "S256";
  code_challenge: string;
}

interface TokensData {
  accessToken: string;
  expirationLength: number;
  expirationTime: number;
  refreshToken: string;
}

type BrowserAction =
  | "none"
  | "tokensNotFound"
  | "initTokenValidated"
  | "initTokenExpired"
  | "refrTokenValidated"
  | "refrTokenExpired";

type UserAction =
  | "none"
  | "accountConnect"
  | "accountModalOpen"
  | "accountModalClose"
  | "accountDisconnect";

type ServerAction =
  | "none"
  | "authPageDisplay"
  | "authCodeProvide"
  | "authCodeDeny"
  | "initTokensProvide"
  | "initTokensDeny"
  | "initDataProvide"
  | "initDataDeny"
  | "moreTokensProvide"
  | "moreTokensDeny"
  | "requestAccept"
  | "requestDeny";

type Action = BrowserAction | UserAction | ServerAction;

type AccountConnectionStatus =
  | "none"
  | "initiated"
  | "authorized"
  | "pending"
  | "ok"
  | "unauthorized"
  | "failed"
  | "updating"
  | "broken"
  | "closed";
