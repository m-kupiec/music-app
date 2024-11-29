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
export function handleWebApiUserProfileJson(json: WebApiUserProfileJson): void {
  if ("error" in json) throw new WebApiError(json);

  const extractedAccountProfileData =
    webApi.extractAccountProfileDataFromJson(json);

  if (extractedAccountProfileData && !webApi.getAccountProfileData()) {
    webApi.setAccountProfileData(extractedAccountProfileData);
  }
}

export function extractAccountProfileDataFromJson(
  json: WebApiUserProfileSuccessJson,
): AccountProfileData | null {
  if (!webApi.isValidAccountProfileData(json)) return null;

  const accountProfileData: AccountProfileData = {
    display_name: json.display_name,
    id: json.id,
    images: json.images,
  };

  return accountProfileData;
}

export function isValidAccountProfileData(
  data: AccountProfileData | WebApiUserProfileSuccessJson,
): boolean {
  const display_name = data.display_name;
  if (typeof display_name != "string" || display_name.length === 0)
    return false;

  const id = data.id;
  if (typeof id != "string" || id.length === 0) return false;

  const images = structuredClone(data.images);
  if (!{}.toString.call(images).includes("Array")) return false;
  if (images.length > 0 && images[0].url.length === 0) return false;

  return true;
}

export function setAccountProfileData(
  accountProfileData: AccountProfileData,
): void {
  accountProfile.data = accountProfileData;
}

export function getAccountProfileData(): AccountProfileData | null {
  return accountProfile.data;
}

const accountProfile = { data: null as AccountProfileData | null };
