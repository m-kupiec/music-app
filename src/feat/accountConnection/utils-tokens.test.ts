import {
  afterEach,
  beforeEach,
  describe,
  expect,
  it,
  MockInstance,
  vi,
} from "vitest";
import { requestTokens } from "./utils-tokens";
import { authResponseCodeMock } from "../../tests/mocks/auth";
import {
  spotifyApiTokenEndpoint,
  spotifyApiTokenRequestHeaders,
} from "./constants";
import { appConfig } from "../../config";
import { codeVerifierMock } from "../../tests/mocks/pkce";

// RFC 6749: https://datatracker.ietf.org/doc/html/rfc6749#section-4.1.3
// Spotify API docs: https://developer.spotify.com/documentation/web-api/tutorials/code-pkce-flow#request-an-access-token
describe("requestTokens()", () => {
  const authCodeMock = new URLSearchParams(authResponseCodeMock).get("code")!;
  let getItemMock: MockInstance;
  let fetchMock: MockInstance;

  beforeEach(() => {
    getItemMock = vi
      .spyOn(Storage.prototype, "getItem")
      .mockReturnValue(codeVerifierMock);

    fetchMock = vi.fn().mockResolvedValue(undefined);

    vi.stubGlobal("fetch", fetchMock);
  });

  afterEach(() => {
    getItemMock.mockRestore();

    vi.unstubAllGlobals();

    fetchMock.mockRestore();
  });

  it("retrieves code verifier from the browser storage", async () => {
    expect(getItemMock).not.toHaveBeenCalled();
    await requestTokens(authCodeMock);
    expect(getItemMock).toHaveBeenCalledWith("codeVerifier");
  });

  it("sends a request to the Spotify API token endpoint", async () => {
    expect(fetch).not.toHaveBeenCalled();
    await requestTokens(authCodeMock);

    const fetchCallArgs = fetchMock.mock.lastCall;
    const endpoint = fetchCallArgs ? (fetchCallArgs[0] as string) : "";

    expect(endpoint).toBe(spotifyApiTokenEndpoint);
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
      ? (fetchCallArgs[1] as { headers: object }).headers
      : {};
    expect(headers).toEqual(spotifyApiTokenRequestHeaders);
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
