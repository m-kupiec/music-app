import { describe, it, MockInstance, vi, expect } from "vitest";
import {
  getUserProfileRequestHeaders,
  requestUserProfile,
  handleWebApiUserProfileJson,
  extractAccountProfileDataFromJson,
  isValidAccountProfileData,
} from "./webApi";
import * as webApi from "./webApi";
import * as tokens from "./tokens";
import { nonExpiredTokens } from "../../../tests/mocks/tokenData";
import { userProfileEndpoint } from "../constants";
import { accessTokenMock } from "../../../tests/mocks/tokenApi";
import {
  accountProfileDataMock,
  webApiErrorJsonMock,
  webApiErrorResponseMock,
  webApiUserProfileSuccessJsonMock,
  webApiUserProfileSuccessResponseMock,
} from "../../../tests/mocks/webApi";
import {
  AccountConnectionError,
  FetchException,
  WebApiError,
} from "../classes";

// Spotify API docs: https://developer.spotify.com/documentation/web-api/reference/get-current-users-profile
describe("requestUserProfile()", () => {
  let getTokensFromStorageMock: MockInstance;
  let getUserProfileRequestHeadersMock: MockInstance;
  let fetchMock: MockInstance;

  beforeEach(() => {
    getTokensFromStorageMock = vi
      .spyOn(tokens, "getTokensFromStorage")
      .mockReturnValue(nonExpiredTokens);

    getUserProfileRequestHeadersMock = vi
      .spyOn(webApi, "getUserProfileRequestHeaders")
      .mockReturnValue(
        new Headers({
          Authorization: `Bearer ${accessTokenMock}`,
        } as WebApiRequestHeaders),
      );

    fetchMock = vi.fn().mockResolvedValue(webApiUserProfileSuccessResponseMock);
    vi.stubGlobal("fetch", fetchMock);
  });

  afterEach(() => {
    vi.unstubAllGlobals();
    fetchMock.mockRestore();

    getUserProfileRequestHeadersMock.mockRestore();
    getTokensFromStorageMock.mockRestore();
  });

  it("retrieves access token from the browser storage", async () => {
    expect(getTokensFromStorageMock).not.toHaveBeenCalled();
    await requestUserProfile();
    expect(getTokensFromStorageMock).toHaveBeenCalled();
  });

  it("throws an error if no access token has been found", async () => {
    getTokensFromStorageMock.mockReturnValue(null);

    expect(getTokensFromStorageMock).not.toHaveBeenCalled();
    await expect(() => requestUserProfile()).rejects.toThrowError(
      new AccountConnectionError("access_token_not_found"),
    );
  });

  it("sends a request to the Spotify Web API's User Profile endpoint", async () => {
    expect(fetch).not.toHaveBeenCalled();

    await requestUserProfile();

    const fetchCallArgs = fetchMock.mock.lastCall;
    const endpoint = fetchCallArgs ? (fetchCallArgs[0] as string) : "";

    expect(endpoint).toBe(userProfileEndpoint);
  });

  it("sends a GET request", async () => {
    expect(fetch).not.toHaveBeenCalled();
    await requestUserProfile();

    const fetchCallArgs = fetchMock.mock.lastCall;
    const isMethodIncluded =
      fetchCallArgs?.length === 2 &&
      typeof fetchCallArgs[1] === "object" &&
      "method" in fetchCallArgs[1];

    const method = isMethodIncluded
      ? (fetchCallArgs[1] as { method: string }).method
      : "";
    expect(method.toUpperCase()).toBe("GET");
  });

  it("includes the required headers", async () => {
    expect(fetch).not.toHaveBeenCalled();
    await requestUserProfile();

    const fetchCallArgs = fetchMock.mock.lastCall;
    const areHeadersIncluded =
      fetchCallArgs?.length === 2 &&
      typeof fetchCallArgs[1] === "object" &&
      "headers" in fetchCallArgs[1];

    const properHeaders = getUserProfileRequestHeaders(accessTokenMock);
    const includedHeaders = areHeadersIncluded
      ? (fetchCallArgs[1] as { headers: Headers }).headers
      : {};

    expect(includedHeaders).toEqual(properHeaders);
  });

  it("returns the API's response JSON if no fetch errors occurred", async () => {
    let result = await requestUserProfile();
    expect(result).toBe(webApiUserProfileSuccessJsonMock);

    fetchMock = vi.fn().mockResolvedValue(webApiErrorResponseMock);
    vi.stubGlobal("fetch", fetchMock);

    result = await requestUserProfile();
    expect(result).toBe(webApiErrorJsonMock);
  });

  it("rethrows fetch errors that occur during the user profile data request and response process", async () => {
    const errorMessageMock = "error_mock";

    fetchMock = vi.fn().mockImplementation(() => {
      throw new TypeError(errorMessageMock);
    });
    vi.stubGlobal("fetch", fetchMock);

    await expect(() => requestUserProfile()).rejects.toThrowError(
      new FetchException(errorMessageMock),
    );
  });
});

// Spotify API docs: https://developer.spotify.com/documentation/web-api/concepts/access-token
describe("getUserProfileRequestHeaders()", () => {
  beforeEach(() => {
    vi.stubGlobal(
      "Headers",
      class {
        constructor(initialValue: Record<string, string>) {
          return Object.entries(initialValue);
        }
      },
    );
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it("returns an HTTP headers object", () => {
    vi.unstubAllGlobals();
    const result = getUserProfileRequestHeaders(accessTokenMock);

    expect(result).toBeInstanceOf(Headers);
  });

  it("includes Authorization property key", () => {
    const result = getUserProfileRequestHeaders(accessTokenMock);
    const flatResult = (result as unknown as string[]).flat();

    expect(flatResult).toContain("Authorization");
  });

  it("Authorization property value is in 'Bearer <access token>' format", () => {
    const result = getUserProfileRequestHeaders(accessTokenMock);
    const flatResult = (result as unknown as string[]).flat();
    const authPropValueIndex = flatResult.indexOf("Authorization") + 1;
    const authPropValueParts = flatResult[authPropValueIndex].split(" ");

    expect(authPropValueParts.length).toBe(2);
    expect(authPropValueParts[0]).toBe("Bearer");
  });
});

// Spotify API docs: https://developer.spotify.com/documentation/web-api/reference/get-current-users-profile
describe("handleWebApiUserProfileJson()", () => {
  let extractAccountProfileDataFromJsonSpy: MockInstance;
  let getAccountProfileDataSpy: MockInstance;
  let setAccountProfileDataSpy: MockInstance;

  beforeEach(() => {
    extractAccountProfileDataFromJsonSpy = vi
      .spyOn(webApi, "extractAccountProfileDataFromJson")
      .mockReturnValue(accountProfileDataMock);
    getAccountProfileDataSpy = vi
      .spyOn(webApi, "getAccountProfileData")
      .mockReturnValue(accountProfileDataMock);
    setAccountProfileDataSpy = vi
      .spyOn(webApi, "setAccountProfileData")
      .mockImplementation(vi.fn());
  });

  afterEach(() => {
    extractAccountProfileDataFromJsonSpy.mockRestore();
    getAccountProfileDataSpy.mockRestore();
    setAccountProfileDataSpy.mockRestore();
  });

  it("extracts key account profile data from Spotify Web API's success response JSON", () => {
    expect(extractAccountProfileDataFromJsonSpy).not.toHaveBeenCalled();
    handleWebApiUserProfileJson(webApiUserProfileSuccessJsonMock);
    expect(extractAccountProfileDataFromJsonSpy).toHaveBeenCalledWith(
      webApiUserProfileSuccessJsonMock,
    );
  });

  it("stores key account profile data if it has not been done yet", () => {
    handleWebApiUserProfileJson(webApiUserProfileSuccessJsonMock);
    expect(setAccountProfileDataSpy).not.toHaveBeenCalled();
    getAccountProfileDataSpy.mockRestore();

    getAccountProfileDataSpy.mockReturnValue(null);
    handleWebApiUserProfileJson(webApiUserProfileSuccessJsonMock);
    expect(setAccountProfileDataSpy).toHaveBeenCalledWith(
      accountProfileDataMock,
    );
  });

  it("throws the error in case of user profile data denial", () => {
    expect(() => handleWebApiUserProfileJson(webApiErrorJsonMock)).toThrowError(
      new WebApiError(webApiErrorJsonMock),
    );
  });
});

describe("extractAccountProfileDataFromJson()", () => {
  let isValidAccountProfileDataSpy: MockInstance;

  beforeEach(() => {
    isValidAccountProfileDataSpy = vi
      .spyOn(webApi, "isValidAccountProfileData")
      .mockReturnValue(true);
  });

  afterEach(() => {
    isValidAccountProfileDataSpy.mockRestore();
  });

  it("validates key account profile data in Spotify Web API's success response JSON", () => {
    extractAccountProfileDataFromJson(webApiUserProfileSuccessJsonMock);
    expect(isValidAccountProfileDataSpy).toHaveBeenCalledWith(
      webApiUserProfileSuccessJsonMock,
    );
  });

  it("returns key account profile data from Spotify Web API's success response JSON", () => {
    const extractedAccountProfileData = extractAccountProfileDataFromJson(
      webApiUserProfileSuccessJsonMock,
    );
    const expectedAccountProfileData = {
      display_name: webApiUserProfileSuccessJsonMock.display_name,
      id: webApiUserProfileSuccessJsonMock.id,
      images: webApiUserProfileSuccessJsonMock.images,
    };

    expect(extractedAccountProfileData).toEqual(expectedAccountProfileData);
  });

  it("returns null if key account profile data in Spotify Web API's success response JSON is invalid", () => {
    isValidAccountProfileDataSpy.mockReturnValue(false);

    const returnedValue = extractAccountProfileDataFromJson(
      webApiUserProfileSuccessJsonMock,
    );

    expect(returnedValue).toBeNull();
  });
});

describe("isValidAccountProfileData()", () => {
  it("returns true if key account profile data is valid", () => {
    expect(isValidAccountProfileData(accountProfileDataMock)).toBe(true);
    expect(isValidAccountProfileData(webApiUserProfileSuccessJsonMock)).toBe(
      true,
    );
  });

  it("returns false if display_name is not a string", () => {
    const invalidAccountProfileDataMock = {
      ...accountProfileDataMock,
      display_name: 0,
    } as unknown as AccountProfileData;

    expect(isValidAccountProfileData(invalidAccountProfileDataMock)).toBe(
      false,
    );
  });

  it("returns false if display_name is an empty string", () => {
    const invalidAccountProfileDataMock = {
      ...accountProfileDataMock,
      display_name: "",
    } as AccountProfileData;

    expect(isValidAccountProfileData(invalidAccountProfileDataMock)).toBe(
      false,
    );
  });

  it("returns false if id is not a string", () => {
    const invalidAccountProfileDataMock = {
      ...accountProfileDataMock,
      id: 0,
    } as unknown as AccountProfileData;

    expect(isValidAccountProfileData(invalidAccountProfileDataMock)).toBe(
      false,
    );
  });

  it("returns false if id is an empty string", () => {
    const invalidAccountProfileDataMock = {
      ...accountProfileDataMock,
      id: "",
    } as AccountProfileData;

    expect(isValidAccountProfileData(invalidAccountProfileDataMock)).toBe(
      false,
    );
  });

  it("returns false if images is not an array", () => {
    const invalidAccountProfileDataMock = {
      ...accountProfileDataMock,
      images: {},
    } as unknown as AccountProfileData;

    expect(isValidAccountProfileData(invalidAccountProfileDataMock)).toBe(
      false,
    );
  });

  it("returns false if the first item in images array has an empty url string", () => {
    const invalidAccountProfileDataMock = {
      ...accountProfileDataMock,
      images: [{ url: "" }],
    } as AccountProfileData;

    expect(isValidAccountProfileData(invalidAccountProfileDataMock)).toBe(
      false,
    );
  });
});
