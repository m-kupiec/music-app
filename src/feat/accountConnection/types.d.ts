type AccountConnectionPhase = "auth" | "tokens" | "userData";

interface AccountConnectionErrorParams {
  error: AccountConnectionErrorCode;
}

type AccountConnectionErrorCode =
  | "invalid_auth_response"
  | "code_verifier_not_found"
  | "invalid_token_data"
  | "access_token_not_found";

type WebApiUserProfileJson = WebApiUserProfileSuccessJson | WebApiErrorJson;

// Spotify API docs: https://developer.spotify.com/documentation/web-api/reference/get-current-users-profile
interface WebApiUserProfileSuccessJson {
  display_name: string;
  external_urls: {
    spotify: `https://open.spotify.com/user/${WebApiUserId}`;
  };
  href: `https://api.spotify.com/v1/users/${WebApiUserId}`;
  id: string;
  images: {
    url: string;
    height: number;
    width: number;
  }[];
  type: string;
  uri: `spotify:user:${WebApiUserId}`;
  followers: {
    href: string | null;
    total: number;
  };
}

type WebApiUserId = string;

interface WebApiErrorDetails {
  status: WebApiErrorStatus;
  message: string;
}

// RFC 6749: https://datatracker.ietf.org/doc/html/rfc6749#section-7.2
// Spotify API docs:
// https://developer.spotify.com/documentation/web-api/concepts/api-calls#regular-error-object
// https://developer.spotify.com/documentation/web-api/reference/get-current-users-profile
interface WebApiErrorJson {
  error: {
    status: WebApiErrorStatus;
    message: string;
  };
}

interface WebApiUserProfileSuccessResponse {
  headers: {
    "Content-Type": "application/json;charset=UTF-8";
    "Cache-Control": "no-store";
    Pragma: "no-cache";
  };
  ok: true;
  status: 200;
  statusText: "OK";
  json: () => Promise<WebApiUserProfileSuccessJson>;
}

interface WebApiErrorResponse {
  headers: {
    "Content-Type": "application/json;charset=UTF-8";
    "Cache-Control": "no-store";
    Pragma: "no-cache";
  };
  ok: false;
  status: WebApiErrorStatus;
  statusText: string;
  json: () => Promise<WebApiErrorJson>;
}

type WebApiErrorStatus = 401 | 403 | 429;

// Spotify API docs: https://developer.spotify.com/documentation/web-api/concepts/access-token
interface WebApiRequestHeaders {
  [index: string]: string;

  Authorization: string;
}

interface TokenData {
  accessToken: string;
  expirationLength: number;
  expirationTime: number;
  refreshToken: string;
}

type TokenApiJson = TokenApiSuccessJson | TokenApiErrorJson;

// RFC 6749: https://datatracker.ietf.org/doc/html/rfc6749#section-4.1.4
// Spotify API docs: https://developer.spotify.com/documentation/web-api/tutorials/code-pkce-flow#response-1
interface TokenApiSuccessJson {
  access_token: string;
  token_type: "Bearer";
  scope?: string;
  expires_in: number;
  refresh_token: string;
}

interface TokenApiErrorDetails {
  message: TokenApiErrorCode;
  description?: string;
  uri?: string;
}

// RFC 6749: https://datatracker.ietf.org/doc/html/rfc6749#section-5.2
interface TokenApiErrorJson {
  error: TokenApiErrorCode;
  error_description?: string;
  error_uri?: string;
}

// RFC 6749: https://datatracker.ietf.org/doc/html/rfc6749#section-5.2
type TokenApiErrorCode =
  | "invalid_request"
  | "invalid_client"
  | "invalid_grant"
  | "unauthorized_client"
  | "unsupported_grant_type"
  | "invalid_scope";

type TokenApiResponse = TokenApiSuccessResponse | TokenApiErrorResponse;

// RFC 6749: https://datatracker.ietf.org/doc/html/rfc6749#section-4.1.4
interface TokenApiSuccessResponse {
  headers: {
    "Content-Type": "application/json;charset=UTF-8";
    "Cache-Control": "no-store";
    Pragma: "no-cache";
  };
  ok: true;
  status: 200;
  statusText: "OK";
  json: () => Promise<TokenApiSuccessJson>;
}

// RFC 6749: https://datatracker.ietf.org/doc/html/rfc6749#section-5.2
interface TokenApiErrorResponse {
  headers: {
    "Content-Type": "application/json;charset=UTF-8";
    "Cache-Control": "no-store";
    Pragma: "no-cache";
    "WWW-Authenticate"?: unknown;
  };
  ok: false;
  status: 400 | 401;
  statusText: "Bad Request" | "Unauthorized";
  json: () => Promise<TokenApiErrorJson>;
}

// RFC 6749: https://datatracker.ietf.org/doc/html/rfc6749#section-4.1.3
// RFC 7636: https://datatracker.ietf.org/doc/html/rfc7636#appendix-B
// Spotify API docs: https://developer.spotify.com/documentation/web-api/tutorials/code-pkce-flow#request-an-access-token
interface TokenApiRequestParams {
  [index: string]: string;

  grant_type: "authorization_code";
  code: string;
  redirect_uri: string;
  client_id: string;
  code_verifier: string;
}

type AuthResponse =
  | string
  | AuthErrorParams
  | AccountConnectionErrorParams
  | null;

// RFC 6749: https://datatracker.ietf.org/doc/html/rfc6749#section-4.1.2.1
interface AuthErrorDetails {
  message: AuthErrorCode;
  description?: string | null;
  uri?: string | null;
}

// RFC 6749: https://datatracker.ietf.org/doc/html/rfc6749#section-4.1.2.1
interface AuthErrorParams {
  error: AuthErrorCode;
  error_description?: string | null;
  error_uri?: string | null;
}

// Spotify API docs: https://developer.spotify.com/documentation/web-api/tutorials/code-pkce-flow#response
type AuthResponseQuery = AuthSuccessQuery | AuthErrorQuery;

// RFC 6749: https://datatracker.ietf.org/doc/html/rfc6749#section-4.1.2
type AuthSuccessQuery = `?code=${string}` | `?code=${string}&state=${string}`;

// RFC 6749: https://datatracker.ietf.org/doc/html/rfc6749#section-4.1.2.1
type AuthErrorQuery =
  | `?error=${AuthErrorCode}`
  | `?error=${AuthErrorCode}&error_description=${string}`
  | `?error=${AuthErrorCode}&error_uri=${string}`
  | `?error=${AuthErrorCode}&error_description=${string}&error_uri=${string}`
  | `?error=${AuthErrorCode}&state=${string}`
  | `?error=${AuthErrorCode}&state=${string}&error_description=${string}`
  | `?error=${AuthErrorCode}&state=${string}&error_uri=${string}`
  | `?error=${AuthErrorCode}&state=${string}&error_description=${string}&error_uri=${string}`;

// RFC 6749: https://datatracker.ietf.org/doc/html/rfc6749#section-4.1.2.1
type AuthErrorCode =
  | "invalid_request"
  | "unauthorized_client"
  | "access_denied"
  | "unsupported_response_type"
  | "invalid_scope"
  | "server_error"
  | "temporarily_unavailable";

// RFC 6749, Section 4.1.2: https://datatracker.ietf.org/doc/html/rfc6749#section-4.1.2
// RFC 6749, Section 4.1.2.1: https://datatracker.ietf.org/doc/html/rfc6749#section-4.1.2.1
type AuthResponseQueryKey =
  | "code"
  | "error"
  | "state"
  | "error_description"
  | "error_uri";

// RFC 6749: https://datatracker.ietf.org/doc/html/rfc6749#section-4.1.1
// RFC 7636: https://datatracker.ietf.org/doc/html/rfc7636#appendix-B
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
  | "validated"
  | "initiated"
  | "authorized"
  | "pending"
  | "ok"
  | "unauthorized"
  | "failed"
  | "updating"
  | "broken"
  | "closed";
