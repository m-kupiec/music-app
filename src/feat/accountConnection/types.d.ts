type AccountConnectionPhase = "requestAuth" | "handleAuth";

type AccountConnectionMiscErrorCode = "invalid_auth_response";

type WebApiUserProfileJson =
  | WebApiUserProfileSuccessJson
  | WebApiUserProfileFailureJson;

// Spotify API docs: https://developer.spotify.com/documentation/web-api/reference/get-current-users-profile
interface WebApiUserProfileSuccessJson {
  display_name: string;
  external_urls: {
    spotify: string;
  };
  href: string;
  id: string;
  images: {
    url: string;
    height: number;
    width: number;
  }[];
  type: string;
  uri: string;
  followers: {
    href: string | null;
    total: number;
  };
}

// Spotify API docs: https://developer.spotify.com/documentation/web-api/reference/get-current-users-profile
interface WebApiUserProfileFailureJson {
  error: string;
}

// Spotify API docs: https://developer.spotify.com/documentation/web-api/concepts/access-token
interface WebApiRequestHeaders {
  [index: string]: string;

  Authorization: string;
}

type TokenApiJson = TokenApiSuccessJson | TokenApiErrorJson;

// RFC 6749: https://datatracker.ietf.org/doc/html/rfc6749#section-4.1.4
// Spotify API docs: https://developer.spotify.com/documentation/web-api/tutorials/code-pkce-flow#response-1
interface TokenApiSuccessJson {
  access_token: string;
  token_type: "Bearer";
  scope: string;
  expires_in: number;
  refresh_token: string;
}

interface TokenApiErrorJson {
  error: string;
}

// RFC 6749: https://datatracker.ietf.org/doc/html/rfc6749#section-4.1.3
// Spotify API docs: https://developer.spotify.com/documentation/web-api/tutorials/code-pkce-flow#request-an-access-token
interface TokenApiRequestParams {
  [index: string]: string;

  grant_type: "authorization_code";
  code: string;
  redirect_uri: string;
  client_id: string;
  code_verifier: string;
}

// RFC 6749: https://datatracker.ietf.org/doc/html/rfc6749#section-4.1.2.1
interface AuthErrorDetails {
  message: AuthErrorResponseCode;
  description?: string | null;
  uri?: string | null;
}

// Spotify API docs: https://developer.spotify.com/documentation/web-api/tutorials/code-pkce-flow#response
type AuthResponse = AuthSuccessResponse | AuthErrorResponse;

// RFC 6749: https://datatracker.ietf.org/doc/html/rfc6749#section-4.1.2
type AuthSuccessResponse =
  | `?code=${string}`
  | `?code=${string}&state=${string}`;

// RFC 6749: https://datatracker.ietf.org/doc/html/rfc6749#section-4.1.2.1
type AuthErrorResponse =
  | `?error=${AuthErrorResponseCode}`
  | `?error=${AuthErrorResponseCode}&error_description=${string}`
  | `?error=${AuthErrorResponseCode}&error_uri=${string}`
  | `?error=${AuthErrorResponseCode}&error_description=${string}&error_uri=${string}`
  | `?error=${AuthErrorResponseCode}&state=${string}`
  | `?error=${AuthErrorResponseCode}&state=${string}&error_description=${string}`
  | `?error=${AuthErrorResponseCode}&state=${string}&error_uri=${string}`
  | `?error=${AuthErrorResponseCode}&state=${string}&error_description=${string}&error_uri=${string}`;

// RFC 6749: https://datatracker.ietf.org/doc/html/rfc6749#section-4.1.2.1
type AuthErrorResponseCode =
  | "invalid_request"
  | "unauthorized_client"
  | "access_denied"
  | "unsupported_response_type"
  | "invalid_scope"
  | "server_error"
  | "temporarily_unavailable";

// RFC 6749: https://datatracker.ietf.org/doc/html/rfc6749#section-4.1.1
// Spotify API docs: https://developer.spotify.com/documentation/web-api/tutorials/code-pkce-flow#request-user-authorization
interface AuthRequestParams {
  [index: string]: string;

  client_id: string;
  response_type: "code";
  redirect_uri: string;
  state?: string;
  scope?: string;
  code_challenge_method: "S256";
  code_challenge: string;
}

interface TokenData {
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
