import { vi, describe, it, expect, afterEach, MockInstance } from "vitest";
import * as pkce from "./utils/pkce";
import * as auth from "./utils/auth";
import * as tokens from "./utils/tokens";
import * as webApi from "./utils/webApi";
import {
  base64urlHashRepresentationMock,
  codeVerifierMock,
} from "../../tests/mocks/pkce";
import { connectSpotifyAccount } from "./handlers";
import {
  webApiErrorJsonMock,
  webApiUserProfileSuccessJsonMock,
} from "../../tests/mocks/webApi";
import { tokenApiErrorJsonMock } from "../../tests/mocks/tokenApi";

// Spotify API docs: https://developer.spotify.com/documentation/web-api/tutorials/code-pkce-flow
describe("connectSpotifyAccount()", () => {
  let createPKCECodeVerifierSpy: MockInstance;
  let generateCodeChallengeSpy: MockInstance;
  let requestAuthFromUserSpy: MockInstance;
  let extractAuthResponseQueryValuesSpy: MockInstance;
  let requestTokensSpy: MockInstance;
  let handleTokenApiJsonSpy: MockInstance;
  let requestUserProfileSpy: MockInstance;
  let handleWebApiUserProfileJsonSpy: MockInstance;

  beforeEach(() => {
    createPKCECodeVerifierSpy = vi
      .spyOn(pkce, "createPKCECodeVerifier")
      .mockReturnValue(codeVerifierMock);

    generateCodeChallengeSpy = vi
      .spyOn(pkce, "generateCodeChallenge")
      .mockResolvedValue(base64urlHashRepresentationMock);

    requestAuthFromUserSpy = vi
      .spyOn(auth, "requestAuthFromUser")
      .mockReturnValue();

    extractAuthResponseQueryValuesSpy = vi
      .spyOn(auth, "extractAuthResponseQueryValues")
      .mockReturnValue("");

    requestTokensSpy = vi
      .spyOn(tokens, "requestTokens")
      .mockResolvedValue({} as TokenApiSuccessJson);

    handleTokenApiJsonSpy = vi
      .spyOn(tokens, "handleTokenApiJson")
      .mockReturnValue();

    requestUserProfileSpy = vi
      .spyOn(webApi, "requestUserProfile")
      .mockResolvedValue(webApiUserProfileSuccessJsonMock);

    handleWebApiUserProfileJsonSpy = vi
      .spyOn(webApi, "handleWebApiUserProfileJson")
      .mockReturnValue(webApiUserProfileSuccessJsonMock);
  });

  afterEach(() => {
    createPKCECodeVerifierSpy.mockRestore();
    generateCodeChallengeSpy.mockRestore();
    requestAuthFromUserSpy.mockRestore();
    extractAuthResponseQueryValuesSpy.mockRestore();
    requestTokensSpy.mockRestore();
    handleTokenApiJsonSpy.mockRestore();
    requestUserProfileSpy.mockRestore();
    handleWebApiUserProfileJsonSpy.mockRestore();
  });

  // Spotify API docs: https://developer.spotify.com/documentation/web-api/tutorials/code-pkce-flow#code-verifier
  it("creates a code verifier according to the PKCE standard", async () => {
    expect(createPKCECodeVerifierSpy).not.toHaveBeenCalled();
    await connectSpotifyAccount("requestAuth");
    expect(createPKCECodeVerifierSpy).toHaveBeenCalledOnce();
  });

  // Spotify API docs: https://developer.spotify.com/documentation/web-api/tutorials/code-pkce-flow#code-challenge
  it("generates a code challenge from the code verifier", async () => {
    expect(generateCodeChallengeSpy).not.toHaveBeenCalled();
    await connectSpotifyAccount("requestAuth");
    expect(generateCodeChallengeSpy).toHaveBeenCalledOnce();
  });

  // Spotify API docs: https://developer.spotify.com/documentation/web-api/tutorials/code-pkce-flow#request-user-authorization
  it("requests authorization from the user", async () => {
    expect(requestAuthFromUserSpy).not.toHaveBeenCalled();
    await connectSpotifyAccount("requestAuth");
    expect(requestAuthFromUserSpy).toHaveBeenCalledOnce();
  });

  // Spotify API docs: https://developer.spotify.com/documentation/web-api/tutorials/code-pkce-flow#response
  it("handles authorization response", async () => {
    expect(extractAuthResponseQueryValuesSpy).not.toHaveBeenCalled();
    await connectSpotifyAccount("handleAuth");
    expect(extractAuthResponseQueryValuesSpy).toHaveBeenCalledOnce();
  });

  // Spotify API docs: https://developer.spotify.com/documentation/web-api/tutorials/code-pkce-flow#request-an-access-token
  it("requests tokens in exchange for the authorization code", async () => {
    expect(requestTokensSpy).not.toHaveBeenCalled();
    await connectSpotifyAccount("handleAuth");
    expect(requestTokensSpy).toHaveBeenCalledOnce();
  });

  // Spotify API docs: https://developer.spotify.com/documentation/web-api/tutorials/code-pkce-flow#response-1
  it("handles API's success JSON received in response to the tokens request", async () => {
    expect(handleTokenApiJsonSpy).not.toHaveBeenCalled();
    await connectSpotifyAccount("handleAuth");
    expect(handleTokenApiJsonSpy).toHaveBeenCalledOnce();
  });

  it("handles API's error JSON received in response to the tokens request", async () => {
    requestTokensSpy.mockReturnValue(tokenApiErrorJsonMock);

    expect(handleTokenApiJsonSpy).not.toHaveBeenCalled();
    await connectSpotifyAccount("handleAuth");
    expect(handleTokenApiJsonSpy).toHaveBeenCalledOnce();
  });

  // Spotify API docs: https://developer.spotify.com/documentation/web-api/reference/get-current-users-profile
  it("requests the user's profile data from the Spotify Web API", async () => {
    expect(requestUserProfileSpy).not.toHaveBeenCalled();
    await connectSpotifyAccount("handleAuth");
    expect(requestUserProfileSpy).toHaveBeenCalledOnce();
  });

  it("handles API's success JSON received in response to the user profile data request", async () => {
    expect(handleWebApiUserProfileJsonSpy).not.toHaveBeenCalled();
    await connectSpotifyAccount("handleAuth");
    expect(handleWebApiUserProfileJsonSpy).toHaveBeenCalledOnce();
  });

  it("handles API's error JSON received in response to the user profile data request", async () => {
    requestUserProfileSpy.mockReturnValue(webApiErrorJsonMock);

    expect(handleWebApiUserProfileJsonSpy).not.toHaveBeenCalled();
    await connectSpotifyAccount("handleAuth");
    expect(handleWebApiUserProfileJsonSpy).toHaveBeenCalledWith(
      webApiErrorJsonMock,
    );
  });
});
