import { Tokens } from "./classes";
import { spotifyWebApiUserProfileEndpoint } from "./constants";
import { getTokensFromStorage } from "./utils-tokens";
import * as webApi from "./utils-webApi";

// Spotify API docs: https://developer.spotify.com/documentation/web-api/reference/get-current-users-profile
export async function requestUserProfile() {
  const accessToken = getTokensFromStorage()?.getAccessToken();
  let userProfileData: WebApiUserProfileSuccessJson;

  if (!accessToken) throw new Error("access_token_not_found");

  const requestHeaders = webApi.getUserProfileRequestHeaders(accessToken);

  try {
    const response = await fetch(spotifyWebApiUserProfileEndpoint, {
      method: "GET",
      headers: requestHeaders,
    });

    userProfileData = (await response.json()) as WebApiUserProfileSuccessJson;
  } catch (error) {
    throw new Error((error as Error).message);
  }

  return userProfileData;
}

// Spotify API docs: https://developer.spotify.com/documentation/web-api/concepts/access-token
export function getUserProfileRequestHeaders(
  accessToken: Tokens["accessToken"],
) {
  return new Headers({
    Authorization: `Bearer ${accessToken}`,
  });
}

// Spotify API docs: https://developer.spotify.com/documentation/web-api/reference/get-current-users-profile
export function handleWebApiUserProfileJson(json: WebApiUserProfileJson) {
  if ("error" in json) throw new Error(json.error);

  return json;
}