import {
  ASCII_DEC_CODE_MAX_VALUE,
  ASCII_DEC_CODE_MIN_VALUE,
  codeVerifierLength,
  CODE_VERIFIER_VALID_REGEX,
} from "./constants.ts";

// Spotify API docs: https://developer.spotify.com/documentation/web-api/tutorials/code-pkce-flow#code-challenge
export async function generateCodeChallenge(codeVerifier: string) {
  const encodedCodeVerifier: Uint8Array = new TextEncoder().encode(
    codeVerifier,
  );

  const hashedCodeVerifier = await crypto.subtle.digest(
    "SHA-256",
    encodedCodeVerifier,
  );

  // RFC 4648, Section 4: https://datatracker.ietf.org/doc/html/rfc4648#section-4
  const base64HashRepresentation = btoa(
    String.fromCharCode(...new Uint8Array(hashedCodeVerifier)),
  );

  // RFC 4648, Section 5: https://datatracker.ietf.org/doc/html/rfc4648#section-5
  // RFC 4648, Section 3.2: https://datatracker.ietf.org/doc/html/rfc4648#section-3.2
  const base64urlHashRepresentation = base64HashRepresentation
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=/g, "");

  return base64urlHashRepresentation;
}

// RFC 7636: https://datatracker.ietf.org/doc/html/rfc7636#section-4.1
// Spotify API docs: https://developer.spotify.com/documentation/web-api/tutorials/code-pkce-flow#code-verifier
export function createPKCECodeVerifier(): string {
  const possibleChars = convertRegexToPossibleASCII(CODE_VERIFIER_VALID_REGEX);

  const randomUint8Array = crypto.getRandomValues(
    new Uint8Array(codeVerifierLength),
  );

  const codeVerifier = randomUint8Array.reduce(
    (concatenated, current) =>
      concatenated + possibleChars[current % possibleChars.length],
    "",
  );

  localStorage.setItem("codeVerifier", codeVerifier);

  return codeVerifier;
}

export function convertRegexToPossibleASCII(regex: RegExp): string {
  let possibleASCII = "";

  for (
    let code = ASCII_DEC_CODE_MIN_VALUE;
    code <= ASCII_DEC_CODE_MAX_VALUE;
    code++
  ) {
    const char = String.fromCharCode(code);

    if (regex.test(char)) possibleASCII += char;
  }

  return possibleASCII;
}
