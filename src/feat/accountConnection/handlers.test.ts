import { vi, describe, it, expect, afterEach, MockInstance } from "vitest";
import * as pkce from "./utils-pkce.ts";
import * as auth from "./utils-auth.ts";
import * as tokens from "./utils-tokens.ts";
import {
  base64urlHashRepresentationMock,
  codeVerifierMock,
} from "../../tests/mocks/pkce.ts";
import { connectSpotifyAccount } from "./handlers.ts";

// Spotify API docs: https://developer.spotify.com/documentation/web-api/tutorials/code-pkce-flow
describe("connectSpotifyAccount()", () => {
  let createPKCECodeVerifierSpy: MockInstance;
  let generateCodeChallengeSpy: MockInstance;
  let requestUserAuthorizationSpy: MockInstance;
  let getAuthorizationResponseSpy: MockInstance;
  let requestTokensSpy: MockInstance;

  beforeEach(() => {
    createPKCECodeVerifierSpy = vi
      .spyOn(pkce, "createPKCECodeVerifier")
      .mockReturnValue(codeVerifierMock);

    generateCodeChallengeSpy = vi
      .spyOn(pkce, "generateCodeChallenge")
      .mockResolvedValue(base64urlHashRepresentationMock);

    requestUserAuthorizationSpy = vi
      .spyOn(auth, "requestUserAuthorization")
      .mockReturnValue();

    getAuthorizationResponseSpy = vi
      .spyOn(auth, "getAuthorizationResponse")
      .mockReturnValue("");

    requestTokensSpy = vi
      .spyOn(tokens, "requestTokens")
      .mockReturnValue(Promise.resolve());
  });

  afterEach(() => {
    createPKCECodeVerifierSpy.mockRestore();
    generateCodeChallengeSpy.mockRestore();
    requestUserAuthorizationSpy.mockRestore();
    getAuthorizationResponseSpy.mockRestore();
    requestTokensSpy.mockRestore();
  });

  it("creates a code verifier according to the PKCE standard", async () => {
    expect(createPKCECodeVerifierSpy).not.toHaveBeenCalled();
    await connectSpotifyAccount();
    expect(createPKCECodeVerifierSpy).toHaveBeenCalledOnce();
  });

  it("generates a code challenge from the code verifier", async () => {
    expect(generateCodeChallengeSpy).not.toHaveBeenCalled();
    await connectSpotifyAccount();
    expect(generateCodeChallengeSpy).toHaveBeenCalledOnce();
  });

  // Spotify API docs: https://developer.spotify.com/documentation/web-api/tutorials/code-pkce-flow#request-user-authorization
  it("requests authorization from the user", async () => {
    expect(requestUserAuthorizationSpy).not.toHaveBeenCalled();
    await connectSpotifyAccount();
    expect(requestUserAuthorizationSpy).toHaveBeenCalledOnce();
  });

  // Spotify API docs: https://developer.spotify.com/documentation/web-api/tutorials/code-pkce-flow#response
  it("handles authorization response", async () => {
    expect(getAuthorizationResponseSpy).not.toHaveBeenCalled();
    await connectSpotifyAccount("handleAuth");
    expect(getAuthorizationResponseSpy).toHaveBeenCalledOnce();
  });

  // Spotify API docs: https://developer.spotify.com/documentation/web-api/tutorials/code-pkce-flow#request-an-access-token
  it("requests tokens in exchange for the authorization code", async () => {
    expect(requestTokensSpy).not.toHaveBeenCalled();
    await connectSpotifyAccount("handleAuth");
    expect(requestTokensSpy).toHaveBeenCalledOnce();
  });
});
