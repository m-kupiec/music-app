import { createPKCECodeVerifier, generateCodeChallenge } from "./utils-pkce.ts";
import { requestUserAuthorization } from "./utils-auth.ts";

// Spotify API docs: https://developer.spotify.com/documentation/web-api/tutorials/code-pkce-flow
export async function connectSpotifyAccount() {
  const codeVerifier = createPKCECodeVerifier();
  const codeChallenge = await generateCodeChallenge(codeVerifier);

  requestUserAuthorization(codeChallenge);
}
