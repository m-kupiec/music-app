import { vi, describe, it, expect, afterEach, MockInstance } from "vitest";
import * as pkce from "./utils-pkce.ts";
import {
  base64urlHashRepresentationMock,
  codeVerifierMock,
} from "../../tests/mocks/pkce.ts";
import { connectSpotifyAccount } from "./handlers.ts";

// Spotify API docs: https://developer.spotify.com/documentation/web-api/tutorials/code-pkce-flow
describe("connectSpotifyAccount()", () => {
  let createPKCECodeVerifierSpy: MockInstance;
  let generateCodeChallengeSpy: MockInstance;

  beforeEach(() => {
    createPKCECodeVerifierSpy = vi
      .spyOn(pkce, "createPKCECodeVerifier")
      .mockReturnValue(codeVerifierMock);

    generateCodeChallengeSpy = vi
      .spyOn(pkce, "generateCodeChallenge")
      .mockResolvedValue(base64urlHashRepresentationMock);
  });

  afterEach(() => {
    createPKCECodeVerifierSpy.mockRestore();
    generateCodeChallengeSpy.mockRestore();
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
});
