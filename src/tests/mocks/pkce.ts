// RFC 7636: https://datatracker.ietf.org/doc/html/rfc7636#section-4.1
// Spotify API docs: https://developer.spotify.com/documentation/web-api/tutorials/code-pkce-flow#code-verifier
export const codeVerifierMock =
  "WX95GWPX9W4UjcpBYauJF6Sfs7.Yt2_lTNXZRqLdCZME1YYJwp9EPJ7X4-TNSkTO";

export const encodedCodeVerifierMock = Uint8Array.from([
  87, 88, 57, 53, 71, 87, 80, 88, 57, 87, 52, 85, 106, 99, 112, 66, 89, 97, 117,
  74, 70, 54, 83, 102, 115, 55, 46, 89, 116, 50, 95, 108, 84, 78, 88, 90, 82,
  113, 76, 100, 67, 90, 77, 69, 49, 89, 89, 74, 119, 112, 57, 69, 80, 74, 55,
  88, 52, 45, 84, 78, 83, 107, 84, 79,
]);

export const hashedCodeVerifierMock = Uint8Array.from([
  118, 190, 90, 195, 37, 55, 196, 165, 228, 183, 111, 180, 164, 187, 179, 103,
  6, 151, 125, 55, 36, 9, 11, 44, 176, 218, 51, 76, 158, 118, 253, 15,
]);

// RFC 4648, Section 4: https://datatracker.ietf.org/doc/html/rfc4648#section-4
export const base64HashRepresentationMock =
  "dr5awyU3xKXkt2+0pLuzZwaXfTckCQsssNozTJ52/Q8=";

// RFC 4648, Section 5: https://datatracker.ietf.org/doc/html/rfc4648#section-5
// RFC 4648, Section 3.2: https://datatracker.ietf.org/doc/html/rfc4648#section-3.2
// Spotify API docs: https://developer.spotify.com/documentation/web-api/tutorials/code-pkce-flow#code-challenge
export const base64urlHashRepresentationMock =
  "dr5awyU3xKXkt2-0pLuzZwaXfTckCQsssNozTJ52_Q8";
