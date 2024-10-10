import { vi, describe, it, expect, MockInstance } from "vitest";
import { requestUserAuthorization } from "./utils-auth";
import { base64urlHashRepresentationMock } from "../../tests/mocks/pkce";
import { spotifyAuthEndpoint } from "./constants";
import { appConfig } from "../../config";

// Spotify API docs: https://developer.spotify.com/documentation/web-api/tutorials/code-pkce-flow#request-user-authorization
describe("requestUserAuthorization()", () => {
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
    requestUserAuthorization(base64urlHashRepresentationMock);
    // eslint-disable-next-line @typescript-eslint/unbound-method
    expect(window.location.assign).toHaveBeenCalledOnce();

    const redirectUrl: string = (
      (window.location.assign as unknown as MockInstance).mock
        .lastCall as string[]
    )[0].toString();
    expect(redirectUrl).toContain(spotifyAuthEndpoint);
  });

  // RFC 6749: https://datatracker.ietf.org/doc/html/rfc6749#section-4.1.1
  it("includes the required query parameters", () => {
    requestUserAuthorization(base64urlHashRepresentationMock);

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
