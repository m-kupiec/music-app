import {
  afterEach,
  beforeEach,
  describe,
  expect,
  it,
  MockInstance,
  vi,
} from "vitest";
import {
  getTokensFromStorage,
  extractTokensFromApiJson,
  handleTokenApiJson,
  requestTokens,
} from "./tokens";
import { authCodeMock } from "../../../tests/mocks/auth";
import { tokenEndpoint, tokenRequestHeaders } from "../constants";
import { appConfig } from "../../../config";
import { codeVerifierMock } from "../../../tests/mocks/pkce";
import {
  tokenApiErrorJsonMock,
  tokenApiSuccessJsonMock,
  tokenApiSuccessResponseMock,
} from "../../../tests/mocks/tokenApi";
import {
  invalidTokens,
  nonExpiredTokens,
  tokensWithEmptyAccessToken,
  tokensWithEmptyRefreshToken,
  tokensWithInvalidLength,
  tokensWithInvalidTime,
} from "../../../tests/mocks/tokenData";
import { Tokens } from "../classes";
import * as tokens from "./tokens";
import * as pkce from "./pkce";

// RFC 6749: https://datatracker.ietf.org/doc/html/rfc6749#section-4.1.3
// RFC 7636: https://datatracker.ietf.org/doc/html/rfc7636#appendix-B
// Spotify API docs: https://developer.spotify.com/documentation/web-api/tutorials/code-pkce-flow#request-an-access-token
describe("requestTokens()", () => {
  let popCodeVerifierFromStorageMock: MockInstance;
  let fetchMock: MockInstance;

  beforeEach(() => {
    popCodeVerifierFromStorageMock = vi
      .spyOn(pkce, "popCodeVerifierFromStorage")
      .mockReturnValue(codeVerifierMock);

    fetchMock = vi.fn().mockResolvedValue(tokenApiSuccessResponseMock);

    vi.stubGlobal("fetch", fetchMock);
  });

  afterEach(() => {
    vi.unstubAllGlobals();

    popCodeVerifierFromStorageMock.mockRestore();

    fetchMock.mockRestore();
  });

  it("retrieves code verifier from the browser storage", async () => {
    expect(popCodeVerifierFromStorageMock).not.toHaveBeenCalled();
    await requestTokens(authCodeMock);
    expect(popCodeVerifierFromStorageMock).toHaveBeenCalled();
  });

  it("sends a request to the Spotify API token endpoint", async () => {
    expect(fetch).not.toHaveBeenCalled();
    await requestTokens(authCodeMock);

    const fetchCallArgs = fetchMock.mock.lastCall;
    const endpoint = fetchCallArgs ? (fetchCallArgs[0] as string) : "";

    expect(endpoint).toBe(tokenEndpoint);
  });

  it("sends a POST request", async () => {
    expect(fetch).not.toHaveBeenCalled();
    await requestTokens(authCodeMock);

    const fetchCallArgs = fetchMock.mock.lastCall;
    const isMethodIncluded =
      fetchCallArgs?.length === 2 &&
      typeof fetchCallArgs[1] === "object" &&
      "method" in fetchCallArgs[1];

    const method = isMethodIncluded
      ? (fetchCallArgs[1] as { method: string }).method
      : "";
    expect(method.toUpperCase()).toBe("POST");
  });

  it("includes the required headers", async () => {
    expect(fetch).not.toHaveBeenCalled();
    await requestTokens(authCodeMock);

    const fetchCallArgs = fetchMock.mock.lastCall;
    const areHeadersIncluded =
      fetchCallArgs?.length === 2 &&
      typeof fetchCallArgs[1] === "object" &&
      "headers" in fetchCallArgs[1];

    const headers = areHeadersIncluded
      ? (fetchCallArgs[1] as { headers: Headers }).headers
      : {};
    expect(headers).toEqual(tokenRequestHeaders);
  });

  it("includes the required body parameters", async () => {
    expect(fetch).not.toHaveBeenCalled();
    await requestTokens(authCodeMock);

    const fetchCallArgs = fetchMock.mock.lastCall;
    const isBodyIncluded =
      fetchCallArgs?.length === 2 &&
      typeof fetchCallArgs[1] === "object" &&
      "body" in fetchCallArgs[1];

    const body: URLSearchParams = isBodyIncluded
      ? (fetchCallArgs[1] as { body: URLSearchParams }).body
      : new URLSearchParams();

    expect(body).toEqual(
      new URLSearchParams({
        grant_type: "authorization_code",
        code: authCodeMock,
        redirect_uri: appConfig.spotifyAuth.redirectUrl,
        client_id: appConfig.spotifyAuth.clientId,
        code_verifier: codeVerifierMock,
      }),
    );
  });
});

// Spotify API docs: https://developer.spotify.com/documentation/web-api/tutorials/code-pkce-flow#response-1
describe("handleTokenApiJson()", () => {
  let storeTokensMock: MockInstance;

  beforeEach(() => {
    storeTokensMock = vi
      .spyOn(tokens, "storeTokens")
      .mockImplementation(() => undefined);
  });

  afterEach(() => {
    storeTokensMock.mockRestore();
  });

  // RFC 6749: https://datatracker.ietf.org/doc/html/rfc6749#section-4.1.4
  it("stores received tokens data in the browser if authorization is granted", () => {
    vi.useFakeTimers();

    const currentTime = new Date().getTime();
    vi.setSystemTime(currentTime);

    const tokenApiJson = tokenApiSuccessJsonMock;

    expect(storeTokensMock).not.toHaveBeenCalled();
    handleTokenApiJson(tokenApiJson);
    expect(storeTokensMock).toHaveBeenCalledWith(tokenApiJson);

    vi.useRealTimers();
  });

  // RFC 6749: https://datatracker.ietf.org/doc/html/rfc6749#section-5.2
  it("throws the error in case of tokens denial", () => {
    const tokenApiJson = tokenApiErrorJsonMock;

    expect(() => handleTokenApiJson(tokenApiJson)).toThrow();
    expect(storeTokensMock).not.toHaveBeenCalled();
  });
});

describe("storeTokens()", () => {
  let extractTokensFromApiJsonMock: MockInstance;
  let setItemMock: MockInstance;

  beforeEach(() => {
    extractTokensFromApiJsonMock = vi.spyOn(tokens, "extractTokensFromApiJson");

    setItemMock = vi
      .spyOn(Storage.prototype, "setItem")
      .mockImplementation(() => undefined);
  });

  afterEach(() => {
    setItemMock.mockRestore();
    extractTokensFromApiJsonMock.mockRestore();
  });

  it("converts JSON received from the token API to a tokens object", () => {
    extractTokensFromApiJsonMock.mockReturnValue(nonExpiredTokens);

    const apiJson = tokenApiSuccessJsonMock;

    expect(extractTokensFromApiJsonMock).not.toHaveBeenCalled();
    tokens.storeTokens(apiJson);
    expect(extractTokensFromApiJsonMock).toHaveBeenCalledWith(apiJson);
  });

  it("throws an error if the JSON received from the token API is invalid", () => {
    extractTokensFromApiJsonMock.mockReturnValue(null);

    expect(() => tokens.storeTokens({} as TokenApiSuccessJson)).toThrow();
  });

  it("stores a valid tokens object in the browser", () => {
    extractTokensFromApiJsonMock.mockReturnValue(nonExpiredTokens);

    expect(setItemMock).not.toHaveBeenCalled();
    tokens.storeTokens({} as TokenApiSuccessJson);
    expect(setItemMock).toHaveBeenCalledWith(
      "tokens",
      JSON.stringify(nonExpiredTokens),
    );
  });
});

// RFC 6749: https://datatracker.ietf.org/doc/html/rfc6749#section-4.1.4
// Spotify API docs: https://developer.spotify.com/documentation/web-api/tutorials/code-pkce-flow#response-1
describe("extractTokensFromApiJson()", () => {
  it("returns Tokens object containing data received from the token API", () => {
    vi.useFakeTimers();

    const currentTime = new Date().getTime();
    vi.setSystemTime(currentTime);

    const received = tokenApiSuccessJsonMock;
    const returned = extractTokensFromApiJson(received);

    expect(returned).toBeInstanceOf(Tokens);
    expect(returned!.getAccessToken()).toBe(received.access_token);
    expect(returned!.getRefreshToken()).toBe(received.refresh_token);
    expect(returned!.getExpirationLength()).toBe(received.expires_in);
    expect(returned!.getExpirationTime()).toBe(
      tokens.calculateTokensExpirationTime(received.expires_in),
    );

    vi.useRealTimers();
  });

  it("returns null for token API's JSON with access token missing", () => {
    const received = { ...tokenApiSuccessJsonMock };
    delete (received as { access_token?: string }).access_token;

    const returned = extractTokensFromApiJson(
      received as unknown as TokenApiSuccessJson,
    );

    expect(returned).toBe(null);
  });

  it("returns null for token API's JSON with refresh token missing", () => {
    const received = { ...tokenApiSuccessJsonMock };
    delete (received as { refresh_token?: string }).refresh_token;

    const returned = extractTokensFromApiJson(
      received as unknown as TokenApiSuccessJson,
    );

    expect(returned).toBe(null);
  });

  it("returns null for token API's JSON with expiration length missing", () => {
    const received = { ...tokenApiSuccessJsonMock };
    delete (received as { expires_in?: number }).expires_in;

    const returned = extractTokensFromApiJson(
      received as unknown as TokenApiSuccessJson,
    );

    expect(returned).toBe(null);
  });
});

// Spotify API docs: https://developer.spotify.com/documentation/web-api/tutorials/code-pkce-flow#response-1
describe("calculateTokensExpirationTime()", () => {
  it("returns a time that is the expiration length (minus 1 minute buffer) in the future relative to the current time", () => {
    vi.useFakeTimers();

    const currentTime = new Date().getTime();
    vi.setSystemTime(currentTime);

    const expirationSeconds = tokenApiSuccessJsonMock.expires_in;
    const expirationMiliseconds = expirationSeconds * 1000;
    const timeBuffer = 1000 * 60;

    const expirationTime =
      tokens.calculateTokensExpirationTime(expirationSeconds);
    expect(expirationTime).toBe(
      currentTime + expirationMiliseconds - timeBuffer,
    );

    vi.useRealTimers();
  });
});

describe("getTokensFromStorage()", () => {
  let getItemSpy: MockInstance;

  beforeEach(() => {
    getItemSpy = vi.spyOn(Storage.prototype, "getItem");
  });

  afterEach(() => {
    getItemSpy.mockRestore();
  });

  it("accesses the browser storage", () => {
    const storedTokensJSON = JSON.stringify(nonExpiredTokens);
    getItemSpy.mockReturnValue(storedTokensJSON);

    expect(getItemSpy).not.toHaveBeenCalled();
    getTokensFromStorage();
    expect(getItemSpy).toHaveBeenCalled();
  });

  it("returns tokens object", () => {
    const storedTokensJSON = JSON.stringify(nonExpiredTokens);
    getItemSpy.mockReturnValue(storedTokensJSON);

    const receivedTokens = getTokensFromStorage();
    expect(receivedTokens).toBeInstanceOf(Tokens);
  });

  it("returns null if there is no tokens object", () => {
    getItemSpy.mockReturnValue(null);
    const receivedTokens = getTokensFromStorage();
    expect(receivedTokens).toBeNull();
  });

  it("returns null if the tokens object is invalid", () => {
    const storedTokensJSON = JSON.stringify(invalidTokens);
    getItemSpy.mockReturnValue(storedTokensJSON);

    const receivedTokens = getTokensFromStorage();
    expect(receivedTokens).toBeNull();
  });

  it("returns null if the access token is empty", () => {
    const storedCorruptTokensJSON = JSON.stringify(tokensWithEmptyAccessToken);
    getItemSpy.mockReturnValue(storedCorruptTokensJSON);

    const receivedTokens = getTokensFromStorage();
    expect(receivedTokens).toBeNull();
  });

  it("returns null if the refresh token is empty", () => {
    const storedCorruptTokensJSON = JSON.stringify(tokensWithEmptyRefreshToken);
    getItemSpy.mockReturnValue(storedCorruptTokensJSON);

    const receivedTokens = getTokensFromStorage();
    expect(receivedTokens).toBeNull();
  });

  it("returns null if the expiration length is not a valid number", () => {
    const storedCorruptTokensJSON = JSON.stringify(tokensWithInvalidLength);
    getItemSpy.mockReturnValue(storedCorruptTokensJSON);

    const receivedTokens = getTokensFromStorage();
    expect(receivedTokens).toBeNull();
  });

  it("returns null if the expiration time is not a valid number", () => {
    const storedCorruptTokensJSON = JSON.stringify(tokensWithInvalidTime);
    getItemSpy.mockReturnValue(storedCorruptTokensJSON);

    const receivedTokens = getTokensFromStorage();
    expect(receivedTokens).toBeNull();
  });
});
