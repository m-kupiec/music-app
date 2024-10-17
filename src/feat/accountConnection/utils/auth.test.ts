import { vi, describe, it, expect, MockInstance } from "vitest";
import { extractAuthResponseQueryValues, requestAuthFromUser } from "./auth";
import { base64urlHashRepresentationMock } from "../../../tests/mocks/pkce";
import { authEndpoint } from "../constants";
import { appConfig } from "../../../config";
import {
  authInvalidQueryMock,
  authSuccessQueryMock,
  authErrorQueryMock,
} from "../../../tests/mocks/auth";
import { AuthError } from "../classes";

// Spotify API docs: https://developer.spotify.com/documentation/web-api/tutorials/code-pkce-flow#request-user-authorization
describe("requestAuthFromUser()", () => {
  const originalLocation = window.location;

  beforeEach(() => {
    window.location = {
      ...originalLocation,
      assign: vi.fn((url: string) => void url),
    } as Location;
  });

  afterEach(() => {
    window.location = originalLocation;
  });

  it("redirects the user to the Spotify authorization page", () => {
    requestAuthFromUser(base64urlHashRepresentationMock);
    // eslint-disable-next-line @typescript-eslint/unbound-method
    expect(window.location.assign).toHaveBeenCalledOnce();

    const redirectUrl: string = (
      (window.location.assign as unknown as MockInstance).mock
        .lastCall as string[]
    )[0].toString();
    expect(redirectUrl).toContain(authEndpoint);
  });

  // RFC 6749: https://datatracker.ietf.org/doc/html/rfc6749#section-4.1.1
  // RFC 7636: https://datatracker.ietf.org/doc/html/rfc7636#appendix-B
  it("includes the required query parameters", () => {
    requestAuthFromUser(base64urlHashRepresentationMock);

    const redirectUrl: URL = new URL(
      (
        (window.location.assign as unknown as MockInstance).mock
          .lastCall as string[]
      )[0],
    );
    const queryParams = new URLSearchParams(redirectUrl.search);

    expect(queryParams).toEqual(
      new URLSearchParams({
        client_id: appConfig.spotifyAuth.clientId,
        response_type: "code",
        redirect_uri: appConfig.spotifyAuth.redirectUrl,
        code_challenge_method: "S256",
        code_challenge: base64urlHashRepresentationMock,
      }),
    );
  });
});

// Spotify API docs: https://developer.spotify.com/documentation/web-api/tutorials/code-pkce-flow#response
describe("extractAuthResponseQueryValues()", () => {
  const originalLocation = window.location;

  beforeEach(() => {
    window.location = {
      ...originalLocation,
      search: "",
    };
  });

  afterEach(() => {
    window.location = originalLocation;
  });

  // RFC 6749, Section 4.1.2: https://datatracker.ietf.org/doc/html/rfc6749#section-4.1.2
  it("returns the authorization code if the user grants connection", () => {
    window.location.search = authSuccessQueryMock;

    const callbackQueryParams = new URLSearchParams(window.location.search);
    const authCode = callbackQueryParams.get("code");

    const returnedResponse = extractAuthResponseQueryValues();

    expect(returnedResponse).toBe(authCode);
  });

  // RFC 6749, Section 4.1.2.1: https://datatracker.ietf.org/doc/html/rfc6749#section-4.1.2.1
  it("throws the error in case of failed authorization", () => {
    window.location.search = authErrorQueryMock;

    const callbackQueryParams = new URLSearchParams(window.location.search);
    const authError = callbackQueryParams.get("error") as AuthErrorCode;
    const authErrorDescription = callbackQueryParams.get("error_description");
    const authErrorUri = callbackQueryParams.get("error_uri");

    expect(() => extractAuthResponseQueryValues()).toThrowError(
      new AuthError({
        error: authError,
        error_description: authErrorDescription,
        error_uri: authErrorUri,
      } as AuthErrorParams),
    );
  });

  it("throws an error in case of invalid authorization response", () => {
    window.location.search = authInvalidQueryMock;

    expect(() => extractAuthResponseQueryValues()).toThrowError(
      new Error("invalid_auth_response" as AccountConnectionMiscErrorCode),
    );
  });
});
