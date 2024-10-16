import { appConfig } from "../../../config";
import { AuthError } from "../classes";
import { spotifyAuthEndpoint } from "../constants";

// RFC 6749: https://datatracker.ietf.org/doc/html/rfc6749#section-4.1.1
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
  const spotifyAuthRequestUrl = new URL(spotifyAuthEndpoint);
  spotifyAuthRequestUrl.search = queryParams.toString();

  window.location.assign(spotifyAuthRequestUrl);
}

// RFC 6749, Section 4.1.2: https://datatracker.ietf.org/doc/html/rfc6749#section-4.1.2
// RFC 6749, Section 4.1.2.1: https://datatracker.ietf.org/doc/html/rfc6749#section-4.1.2.1
// Spotify API docs: https://developer.spotify.com/documentation/web-api/tutorials/code-pkce-flow#response
export function extractAuthResponseFromLocation() {
  const callbackQueryParams = new URLSearchParams(window.location.search);
  const authCode = callbackQueryParams.get("code");
  const authError = callbackQueryParams.get("error") as AuthErrorResponseCode;
  const authErrorDescription = callbackQueryParams.get("error_description");
  const authErrorUri = callbackQueryParams.get("error_uri");

  if (authCode) return authCode;
  if (authError)
    throw new AuthError({
      message: authError,
      description: authErrorDescription,
      uri: authErrorUri,
    } as AuthErrorDetails);

  throw new Error("invalid_auth_response" as AccountConnectionMiscErrorCode);
}
