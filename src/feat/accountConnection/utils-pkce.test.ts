import { vi, describe, it, expect, afterEach, MockInstance } from "vitest";
import {
  ASCII_CHARS,
  ASCII_DEC_CODE_MAX_VALUE,
  ASCII_DEC_CODE_MIN_VALUE,
  CODE_VERIFIER_VALID_CHARS,
  CODE_VERIFIER_VALID_REGEX,
} from "./constants.ts";
import {
  base64HashRepresentationMock,
  base64urlHashRepresentationMock,
  codeVerifierMock,
  encodedCodeVerifierMock,
  hashedCodeVerifierMock,
} from "../../tests/mocks/pkce.ts";
import {
  convertRegexToPossibleASCII,
  createPKCECodeVerifier,
  generateCodeChallenge,
} from "./utils-pkce.ts";

// Spotify API docs: https://developer.spotify.com/documentation/web-api/tutorials/code-pkce-flow#code-challenge
describe("generateCodeChallenge()", () => {
  let cryptoSubtleDigestSpy: MockInstance;
  const textEncoderMock = {
    encode: vi.fn(() => encodedCodeVerifierMock),
  };

  beforeEach(() => {
    cryptoSubtleDigestSpy = vi
      .spyOn(crypto.subtle, "digest")
      .mockResolvedValue(hashedCodeVerifierMock);

    vi.stubGlobal(
      "TextEncoder",
      vi.fn(() => textEncoderMock),
    );

    vi.stubGlobal(
      "btoa",
      vi.fn(() => base64HashRepresentationMock),
    );
  });

  afterEach(() => {
    cryptoSubtleDigestSpy.mockRestore();

    vi.unstubAllGlobals();
  });

  it("hashes the code verifier using the SHA-256 algorithm", async () => {
    await generateCodeChallenge(codeVerifierMock);

    expect(cryptoSubtleDigestSpy).toHaveBeenCalledWith(
      "SHA-256",
      new TextEncoder().encode(codeVerifierMock),
    );
  });

  // RFC 4648, Section 4: https://datatracker.ietf.org/doc/html/rfc4648#section-4
  it("uses the base64 representation of the hash", async () => {
    expect(btoa).not.toHaveBeenCalled();
    await generateCodeChallenge(codeVerifierMock);
    expect(btoa).toHaveBeenCalledOnce();
    expect(btoa).toHaveReturnedWith(base64HashRepresentationMock);
  });

  // RFC 4648, Section 5: https://datatracker.ietf.org/doc/html/rfc4648#section-5
  // RFC 4648, Section 3.2: https://datatracker.ietf.org/doc/html/rfc4648#section-3.2
  it("returns the base64url representation of the hash", async () => {
    const codeChallenge = await generateCodeChallenge(codeVerifierMock);

    expect(codeChallenge).toBe(base64urlHashRepresentationMock);
  });
});

// RFC 7636: https://datatracker.ietf.org/doc/html/rfc7636#section-4.1
// Spotify API docs: https://developer.spotify.com/documentation/web-api/tutorials/code-pkce-flow#code-verifier
describe("createPKCECodeVerifier()", () => {
  beforeEach(() => {
    vi.stubGlobal("crypto", {
      getRandomValues: <T extends Uint8Array>(arr: T): T => {
        for (let i = 0; i < arr.length; i++) {
          arr[i] = Math.floor(Math.random() * 256);
        }

        return arr;
      },
    });
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it("returns a 64-character string", () => {
    const codeVerifier = createPKCECodeVerifier();

    expect(codeVerifier).toHaveLength(64);
  });

  it("ensures the string contains only valid characters", () => {
    const codeVerifier = createPKCECodeVerifier();

    expect(codeVerifier).toMatch(CODE_VERIFIER_VALID_REGEX);
  });

  it("generates unique values for each call", () => {
    const checksNumber = 10;
    const returnedValues = new Set();

    for (let i = 0; i < checksNumber; i++) {
      const codeVerifier = createPKCECodeVerifier();

      expect(returnedValues.has(codeVerifier)).toBe(false);

      returnedValues.add(codeVerifier);
    }
  });

  it("stores the current code verifier in the browser", () => {
    const reduceSpy = vi.spyOn(Uint8Array.prototype, "reduce");
    reduceSpy.mockReturnValue(codeVerifierMock);

    const setItemSpy = vi.spyOn(Storage.prototype, "setItem");
    setItemSpy.mockImplementation(() => {
      return undefined;
    });

    expect(setItemSpy).not.toHaveBeenCalled();
    createPKCECodeVerifier();
    expect(setItemSpy).toHaveBeenCalledWith("codeVerifier", codeVerifierMock);
    expect(setItemSpy).toHaveBeenCalledOnce();

    setItemSpy.mockRestore();
    reduceSpy.mockRestore();
  });
});

describe("convertRegexToPossibleASCII()", () => {
  const regex = /[0-9A-Za-z]/;

  const fromCharCodeSpy = vi.spyOn(String, "fromCharCode");
  const fromCharCodeMockImplementation = (code: number): string => {
    if (code < ASCII_DEC_CODE_MIN_VALUE || code > ASCII_DEC_CODE_MAX_VALUE) {
      return "";
    }

    return ASCII_CHARS[code] as string;
  };

  beforeEach(() => {
    fromCharCodeSpy.mockImplementation(fromCharCodeMockImplementation);
  });

  afterEach(() => {
    fromCharCodeSpy.mockRestore();
  });

  it("returns a string", () => {
    expect(typeof convertRegexToPossibleASCII(regex)).toBe("string");
  });

  it("ensurea that each character appears only once", () => {
    const convertedString = convertRegexToPossibleASCII(regex);
    const returnedCharSet = new Set(convertedString);

    expect(returnedCharSet.size).toBe(convertedString.length);
  });

  it("limits the output to 7-bit ASCII characters", () => {
    const forbiddenRegex = /€/;

    const convertedString = convertRegexToPossibleASCII(forbiddenRegex);
    const convertedChars = Array.from(convertedString);

    const forbiddenChars = convertedChars.filter(
      (char) =>
        char.charCodeAt(0) < ASCII_DEC_CODE_MIN_VALUE ||
        char.charCodeAt(0) > ASCII_DEC_CODE_MAX_VALUE,
    );
    const forbiddenCharsCount = forbiddenChars.length;

    expect(forbiddenCharsCount).toBe(0);
  });

  it("sorts the characters in ASCII order", () => {
    const convertedString = convertRegexToPossibleASCII(regex);
    let checkedString = convertedString;
    let isASCIIOrder = true;

    while (checkedString.length > 1) {
      if (checkedString.charCodeAt(0) > checkedString.charCodeAt(1)) {
        isASCIIOrder = false;
        break;
      }

      checkedString = checkedString.slice(1);
    }

    expect(isASCIIOrder).toBe(true);
  });

  // RFC 7636: https://datatracker.ietf.org/doc/html/rfc7636#section-4.1
  // Spotify API docs: https://developer.spotify.com/documentation/web-api/tutorials/code-pkce-flow#code-verifier
  it("returns all possible PKCE code verifier characters matching the regex /^[A-Za-z0-9_.-~]+$/", () => {
    expect(convertRegexToPossibleASCII(CODE_VERIFIER_VALID_REGEX)).toBe(
      CODE_VERIFIER_VALID_CHARS,
    );
  });
});
