import { vi, describe, it, expect, MockInstance } from "vitest";
import { popAuthResponseFromQuery, requestAuthFromUser } from "./auth";
import { base64urlHashRepresentationMock } from "../../../tests/mocks/pkce";
import { authEndpoint } from "../constants";
import { appConfig } from "../../../config";
import {
  authInvalidQueryMock,
  authSuccessQueryMock,
  authErrorQueryMock,
} from "../../../tests/mocks/auth";

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
describe("popAuthResponseFromQuery()", () => {
  const originalLocation = window.location;
  let setItemSpy: MockInstance;
  let getItemSpy: MockInstance;
  let removeItemSpy: MockInstance;

  beforeEach(() => {
    setItemSpy = vi
      .spyOn(Storage.prototype, "setItem")
      .mockImplementation(() => undefined);

    getItemSpy = vi.spyOn(Storage.prototype, "getItem").mockReturnValue(null);

    removeItemSpy = vi
      .spyOn(Storage.prototype, "removeItem")
      .mockImplementation(vi.fn());
  });

  afterEach(() => {
    setItemSpy.mockRestore();
    getItemSpy.mockRestore();
    removeItemSpy.mockRestore();
  });

  describe("Phase #1: Auth response data is still embedded in callback URL", () => {
    beforeEach(() => {
      window.location = {
        ...originalLocation,
        search: authSuccessQueryMock,
        replace: vi.fn(),
      };
    });

    afterEach(() => {
      window.location = originalLocation;
    });

    it("stores auth response callback query string in the browser", () => {
      const callbackQueryParams = new URLSearchParams(window.location.search);
      const callbackQueryString = String(callbackQueryParams);

      popAuthResponseFromQuery();

      expect(setItemSpy).toHaveBeenCalledWith(
        "queryParams",
        callbackQueryString,
      );
    });

    it("clears the current page's URL from callback query string", () => {
      popAuthResponseFromQuery();

      expect(window.location.href).not.toContain<string>(authSuccessQueryMock);
    });

    it("returns undefined", () => {
      expect(popAuthResponseFromQuery()).toBeUndefined();
    });
  });

  describe("Phase #2: Auth response data is already stored in localStorage after removing it from callback URL", () => {
    beforeEach(() => {
      window.location = {
        ...originalLocation,
        search: "",
        replace: vi.fn(),
      };
    });

    afterEach(() => {
      window.location = originalLocation;
    });

    it("gets auth response callback query string from the browser storage", () => {
      popAuthResponseFromQuery();

      expect(getItemSpy).toHaveBeenCalledWith("queryParams");
    });

    it("removes auth response callback query string from the browser storage", () => {
      getItemSpy.mockReturnValue(authSuccessQueryMock);

      popAuthResponseFromQuery();

      expect(removeItemSpy).toHaveBeenCalledWith("queryParams");
    });

    it("returns null if there is no retrieved authorization response query to process", () => {
      // window.location.search = "";

      expect(popAuthResponseFromQuery()).toBe(null);
    });

    // RFC 6749, Section 4.1.2: https://datatracker.ietf.org/doc/html/rfc6749#section-4.1.2
    it("returns the authorization code if the user grants connection", () => {
      getItemSpy.mockReturnValue(authSuccessQueryMock);

      const retrievedQueryParams = new URLSearchParams(authSuccessQueryMock);
      const authCode = retrievedQueryParams.get("code" as AuthResponseQueryKey);

      expect(popAuthResponseFromQuery()).toBe(authCode);
    });

    // RFC 6749, Section 4.1.2.1: https://datatracker.ietf.org/doc/html/rfc6749#section-4.1.2.1
    it("returns authorization error params in case of failed authorization", () => {
      getItemSpy.mockReturnValue(authErrorQueryMock);

      const retrievedQueryParams = new URLSearchParams(authErrorQueryMock);
      const authError = retrievedQueryParams.get(
        "error" as AuthResponseQueryKey,
      ) as AuthErrorCode;
      const authErrorDescription = retrievedQueryParams.get(
        "error_description" as AuthResponseQueryKey,
      );
      const authErrorUri = retrievedQueryParams.get(
        "error_uri" as AuthResponseQueryKey,
      );

      expect(popAuthResponseFromQuery()).toEqual({
        error: authError,
        error_description: authErrorDescription,
        error_uri: authErrorUri,
      } as AuthErrorParams);
    });

    it("returns account connection error params in case of invalid authorization response", () => {
      getItemSpy.mockReturnValue(authInvalidQueryMock);

      expect(popAuthResponseFromQuery()).toEqual({
        error: "invalid_auth_response",
      } as AccountConnectionErrorParams);
    });
  });
});
