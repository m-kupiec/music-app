type AccountConnectionPhase = "requestAuth" | "handleAuth";

type TokenApiJson = TokenApiSuccessJson | TokenApiFailureJson;

// RFC 6749: https://datatracker.ietf.org/doc/html/rfc6749#section-4.1.4
// Spotify API docs: https://developer.spotify.com/documentation/web-api/tutorials/code-pkce-flow#response-1
interface TokenApiSuccessJson {
  access_token: string;
  token_type: "Bearer";
  scope: string;
  expires_in: number;
  refresh_token: string;
}

interface TokenApiFailureJson {
  error: string;
}

// RFC 6749: https://datatracker.ietf.org/doc/html/rfc6749#section-4.1.3
// Spotify API docs: https://developer.spotify.com/documentation/web-api/tutorials/code-pkce-flow#request-an-access-token
interface TokensRequestParams {
  [index: string]: string;

  grant_type: "authorization_code";
  code: string;
  redirect_uri: string;
  client_id: string;
  code_verifier: string;
}

// RFC 6749: https://datatracker.ietf.org/doc/html/rfc6749#section-4.1.1
// Spotify API docs: https://developer.spotify.com/documentation/web-api/tutorials/code-pkce-flow#request-user-authorization
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
