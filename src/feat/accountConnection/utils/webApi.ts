import {
  AccountConnectionError,
  FetchException,
  Tokens,
  WebApiError,
} from "../classes";
import { userProfileEndpoint } from "../constants";
import { getTokensFromStorage } from "./tokens";
import * as webApi from "./webApi";

// Spotify API docs: https://developer.spotify.com/documentation/web-api/reference/get-current-users-profile
export async function requestUserProfile() {
  const accessToken = getTokensFromStorage()?.getAccessToken();
  let userProfileData: WebApiUserProfileSuccessJson;

  if (!accessToken) throw new AccountConnectionError("access_token_not_found");

  const requestHeaders = webApi.getUserProfileRequestHeaders(accessToken);

  try {
    const response = await fetch(userProfileEndpoint, {
      method: "GET",
      headers: requestHeaders,
    });

    userProfileData = (await response.json()) as WebApiUserProfileSuccessJson;
  } catch (error) {
    throw new FetchException((error as DOMException | TypeError).message);
  }

  return userProfileData;
}

// Spotify API docs: https://developer.spotify.com/documentation/web-api/concepts/access-token
export function getUserProfileRequestHeaders(
  accessToken: Tokens["accessToken"],
) {
  const headers: WebApiRequestHeaders = {
    Authorization: `Bearer ${accessToken}`,
  };

  return new Headers(headers);
}

// Spotify API docs: https://developer.spotify.com/documentation/web-api/reference/get-current-users-profile
export function handleWebApiUserProfileJson(json: WebApiUserProfileJson) {
  if ("error" in json) throw new WebApiError(json);

  return json;
}
