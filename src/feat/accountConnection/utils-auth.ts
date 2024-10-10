import { appConfig } from "../../config";
import { spotifyAuthEndpoint } from "./constants";

// RFC 6749: https://datatracker.ietf.org/doc/html/rfc6749#section-4.1.1
// Spotify API docs: https://developer.spotify.com/documentation/web-api/tutorials/code-pkce-flow#request-user-authorization
export function requestUserAuthorization(codeChallenge: string) {
  const authParams: AuthParams = {
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
