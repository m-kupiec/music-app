import { appConfig } from "../../../config";
import { authEndpoint } from "../constants";

// RFC 6749: https://datatracker.ietf.org/doc/html/rfc6749#section-4.1.1
// RFC 7636: https://datatracker.ietf.org/doc/html/rfc7636#appendix-B
// Spotify API docs: https://developer.spotify.com/documentation/web-api/tutorials/code-pkce-flow#request-user-authorization
export function requestAuthFromUser(codeChallenge: string) {
  const authParams: AuthRequestParams = {
    client_id: appConfig.spotifyAuth.clientId,
    response_type: "code",
    redirect_uri: appConfig.spotifyAuth.redirectUrl,
    code_challenge_method: "S256",
    code_challenge: codeChallenge,
  };

  const queryParams = new URLSearchParams(authParams);
  const spotifyAuthRequestUrl = new URL(authEndpoint);
  spotifyAuthRequestUrl.search = queryParams.toString();

  window.location.assign(spotifyAuthRequestUrl);
}

// RFC 6749, Section 4.1.2: https://datatracker.ietf.org/doc/html/rfc6749#section-4.1.2
// RFC 6749, Section 4.1.2.1: https://datatracker.ietf.org/doc/html/rfc6749#section-4.1.2.1
// Spotify API docs: https://developer.spotify.com/documentation/web-api/tutorials/code-pkce-flow#response
export function getAuthResponseFromQuery(): AuthResponse {
  const callbackQueryParams = new URLSearchParams(window.location.search);

  if (!callbackQueryParams.size) return null;

  const authCode = callbackQueryParams.get("code" as AuthResponseQueryKey);
  const authError = callbackQueryParams.get(
    "error" as AuthResponseQueryKey,
  ) as AuthErrorCode;
  const authErrorDescription = callbackQueryParams.get(
    "error_description" as AuthResponseQueryKey,
  );
  const authErrorUri = callbackQueryParams.get(
    "error_uri" as AuthResponseQueryKey,
  );

  if (authCode) return authCode;

  if (authError) {
    return {
      error: authError,
      error_description: authErrorDescription,
      error_uri: authErrorUri,
    } as AuthErrorParams;
  }

  return {
    error: "invalid_auth_response",
  } as AccountConnectionErrorParams;
}
