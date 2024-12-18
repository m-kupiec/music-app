// RFC 7636: https://datatracker.ietf.org/doc/html/rfc7636#section-4.1
// Spotify API docs: https://developer.spotify.com/documentation/web-api/tutorials/code-pkce-flow#code-verifier
export const CODE_VERIFIER_VALID_REGEX = /^[A-Za-z0-9_.\-~]+$/;
export const CODE_VERIFIER_VALID_CHARS =
  "-.0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ_abcdefghijklmnopqrstuvwxyz~";

export const ASCII_DEC_CODE_MIN_VALUE = 0;
export const ASCII_DEC_CODE_MAX_VALUE = 127;
export const ASCII_CHARS = new Array(33)
  .fill("")
  .concat(
    "!\"#$%&'()*+,-./0123456789:;<=>?@ABCDEFGHIJKLMNOPQRSTUVWXYZ[\\]^_`abcdefghijklmnopqrstuvwxyz{|}~".split(
      "",
    ),
    [""],
  );

export const codeVerifierLength = 64;

export const authEndpoint = "https://accounts.spotify.com/authorize";
export const tokenEndpoint = "https://accounts.spotify.com/api/token";
export const tokenRequestHeaders: Headers = new Headers({
  "Content-Type": "application/x-www-form-urlencoded",
});

export const userProfileEndpoint = "https://api.spotify.com/v1/me";
