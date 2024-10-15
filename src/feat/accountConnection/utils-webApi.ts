import { Tokens } from "./classes";
import { spotifyWebApiUserProfileEndpoint } from "./constants";
import { getTokensFromStorage } from "./utils-tokens";
import * as webApi from "./utils-webApi";

// Spotify API docs: https://developer.spotify.com/documentation/web-api/reference/get-current-users-profile
export async function requestUserProfile() {
  const accessToken = getTokensFromStorage()?.getAccessToken();

  if (!accessToken) throw new Error("access_token_not_found");

  const requestHeaders = webApi.getUserProfileRequestHeaders(accessToken);

  await fetch(spotifyWebApiUserProfileEndpoint, {
    method: "GET",
    headers: requestHeaders,
  });

  return Promise.resolve();
}

// Spotify API docs: https://developer.spotify.com/documentation/web-api/concepts/access-token
export function getUserProfileRequestHeaders(
  accessToken: Tokens["accessToken"],
) {
  return new Headers({
    Authorization: `Bearer ${accessToken}`,
  });
}
