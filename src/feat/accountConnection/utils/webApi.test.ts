import { describe, it, MockInstance, vi } from "vitest";
import {
  getUserProfileRequestHeaders,
  requestUserProfile,
  handleWebApiUserProfileJson,
} from "./webApi";
import * as webApi from "./webApi";
import * as tokens from "./tokens";
import { nonExpiredTokens } from "../../../tests/mocks/tokenData";
import { userProfileEndpoint } from "../constants";
import { accessTokenMock } from "../../../tests/mocks/tokenApi";
import {
  webApiErrorJsonMock,
  webApiUserProfileSuccessJsonMock,
  webApiUserProfileSuccessResponseMock,
} from "../../../tests/mocks/webApi";

// Spotify API docs: https://developer.spotify.com/documentation/web-api/reference/get-current-users-profile
describe("requestUserProfile()", () => {
  let getTokensFromStorageMock: MockInstance;
  let fetchMock: MockInstance;

  beforeEach(() => {
    getTokensFromStorageMock = vi
      .spyOn(tokens, "getTokensFromStorage")
      .mockReturnValue(nonExpiredTokens);

    fetchMock = vi.fn().mockResolvedValue(webApiUserProfileSuccessResponseMock);
    vi.stubGlobal("fetch", fetchMock);
  });

  afterEach(() => {
    vi.unstubAllGlobals();
    fetchMock.mockRestore();

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
    await expect(() => requestUserProfile()).rejects.toThrow();
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
    const getUserProfileRequestHeadersMock = vi
      .spyOn(webApi, "getUserProfileRequestHeaders")
      .mockReturnValue(
        new Headers({
          Authorization: `Bearer ${accessTokenMock}`,
        } as WebApiRequestHeaders),
      );

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

    getUserProfileRequestHeadersMock.mockRestore();
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
  it("returns profile data if granted", () => {
    const result = handleWebApiUserProfileJson(
      webApiUserProfileSuccessJsonMock,
    );

    expect(result).toBe(webApiUserProfileSuccessJsonMock);
  });

  it("throws the error in case of user profile data denial", () => {
    expect(() => handleWebApiUserProfileJson(webApiErrorJsonMock)).toThrow();
  });
});
