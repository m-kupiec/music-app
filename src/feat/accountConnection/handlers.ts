import { createPKCECodeVerifier, generateCodeChallenge } from "./utils-pkce.ts";

// Spotify API docs: https://developer.spotify.com/documentation/web-api/tutorials/code-pkce-flow
export async function connectSpotifyAccount() {
  const codeVerifier = createPKCECodeVerifier();
  await generateCodeChallenge(codeVerifier);
}
