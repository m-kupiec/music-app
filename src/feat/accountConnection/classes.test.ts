import { describe, expect, it } from "vitest";
import { AuthError, TokenApiError, Tokens } from "./classes";
import { mockTokenData } from "../../tests/mocks/tokenData";

describe("TokenApiError", () => {
  it("instantiates with empty message and null details by default", () => {
    const error = new TokenApiError();

    expect(error.message).toBe("");
    expect(error.details).toBeNull();
  });

  it("sets message when instantiated with a string", () => {
    const message: TokenApiErrorResponseCode = "invalid_request";

    const error = new TokenApiError(message);

    expect(error.message).toBe(message);
    expect(error.details).toBeNull();
    expect(error.getDetails()).toBe("");
  });

  it("sets message and details when instantiated with complete JSON", () => {
    const errorJson: TokenApiErrorJson = {
      error: "invalid_request",
      error_description: "Invalid request",
      error_uri: "https://example.com/error",
    };
    const error = new TokenApiError(errorJson);

    expect(error.message).toBe(errorJson.error);
    expect(error.details?.message).toBe(errorJson.error);
    expect(error.details?.description).toBe(errorJson.error_description);
    expect(error.details?.uri).toBe(errorJson.error_uri);
  });

  it("handles JSON with missing optional fields", () => {
    const message: TokenApiErrorResponseCode = "invalid_request";

    const errorJson: TokenApiErrorJson = {
      error: message,
    };
    const error = new TokenApiError(errorJson);

    expect(error.message).toBe(errorJson.error);
    expect(error.details?.message).toBe(errorJson.error);
    expect(error.details?.description).toBe("");
    expect(error.details?.uri).toBe("");
  });

  describe("getDetails()", () => {
    it("returns empty string if details are null", () => {
      const error = new TokenApiError();

      expect(error.getDetails()).toBe("");
    });

    it("returns formatted string if full details are provided", () => {
      const message: TokenApiErrorResponseCode = "invalid_request";
      const description = "Invalid request";
      const uri = "https://example.com/error";

      const errorJson: TokenApiErrorJson = {
        error: message,
        error_description: description,
        error_uri: uri,
      };
      const error = new TokenApiError(errorJson);

      expect(error.getDetails()).toBe(`${message}: ${description} (${uri})`);
    });

    it("returns formatted string if partial details are provided", () => {
      const message: TokenApiErrorResponseCode = "invalid_request";
      const description = "Invalid request";
      const uri = "https://example.com/error";

      let errorJson: TokenApiErrorJson = {
        error: message,
        error_description: description,
        error_uri: uri,
      };
      let error = new TokenApiError(errorJson);
      expect(error.getDetails()).toBe(`${message}: ${description} (${uri})`);

      errorJson = { error: message };
      error = new TokenApiError(errorJson);
      expect(error.getDetails()).toBe(message);

      errorJson = { error: message, error_description: description };
      error = new TokenApiError(errorJson);
      expect(error.getDetails()).toBe(`${message}: ${description}`);

      errorJson = { error: message, error_uri: uri };
      error = new TokenApiError(errorJson);
      expect(error.getDetails()).toBe(`${message} (${uri})`);
    });
  });
});

describe("AuthError", () => {
  it("instantiates with empty message and null details by default", () => {
    const error = new AuthError();

    expect(error.message).toBe("");
    expect(error.details).toBeNull();
  });

  it("sets message when instantiated with a string", () => {
    const message: AuthErrorCode = "access_denied";

    const error = new AuthError(message);

    expect(error.message).toBe(message);
    expect(error.details).toBeNull();
    expect(error.getDetails()).toBe("");
  });

  it("sets message and details when instantiated with full details object", () => {
    const details: AuthErrorDetails = {
      message: "access_denied",
      description: "Access denied",
      uri: "https://example.com/error",
    };
    const error = new AuthError(details);

    expect(error.message).toBe(details.message);
    expect(error.details).toEqual(details);
  });

  it("handles details object with missing optional fields", () => {
    const message: AuthErrorCode = "access_denied";

    const details: AuthErrorDetails = {
      message: message,
    };
    const error = new AuthError(details);

    expect(error.message).toBe(details.message);
    expect(error.details).toEqual({
      ...details,
      description: "",
      uri: "",
    });
  });

  describe("getDetails()", () => {
    it("returns empty string if details are null", () => {
      const error = new AuthError();

      expect(error.getDetails()).toBe("");
    });

    it("returns formatted string if full details are provided", () => {
      const message: AuthErrorCode = "access_denied";
      const description = "Access denied";
      const uri = "https://example.com/error";

      const details: AuthErrorDetails = {
        message: message,
        description: description,
        uri: uri,
      };
      const error = new AuthError(details);

      expect(error.getDetails()).toBe(`${message}: ${description} (${uri})`);
    });

    it("returns formatted string if partial details are provided", () => {
      const message: AuthErrorCode = "access_denied";
      const description = "Access denied";
      const uri = "https://example.com/error";

      let details: AuthErrorDetails = {
        message: message,
        description: description,
        uri: uri,
      };
      let error = new AuthError(details);
      expect(error.getDetails()).toBe(`${message}: ${description} (${uri})`);

      details = { message: message };
      error = new AuthError(details);
      expect(error.getDetails()).toBe(message);

      details = { message: message, description: description };
      error = new AuthError(details);
      expect(error.getDetails()).toBe(`${message}: ${description}`);

      details = { message: message, uri: uri };
      error = new AuthError(details);
      expect(error.getDetails()).toBe(`${message} (${uri})`);
    });
  });
});

describe("Tokens", () => {
  it("should correctly initialize all properties", () => {
    const tokens = new Tokens(mockTokenData);

    expect(tokens.accessToken).toBe(mockTokenData.accessToken);
    expect(tokens.expirationLength).toBe(mockTokenData.expirationLength);
    expect(tokens.expirationTime).toBe(mockTokenData.expirationTime);
    expect(tokens.refreshToken).toBe(mockTokenData.refreshToken);
  });

  it("should correctly return access token", () => {
    const tokens = new Tokens(mockTokenData);

    expect(tokens.getAccessToken()).toBe(mockTokenData.accessToken);
  });

  it("should correctly return expiration length", () => {
    const tokens = new Tokens(mockTokenData);

    expect(tokens.getExpirationLength()).toBe(mockTokenData.expirationLength);
  });

  it("should correctly return expiration time", () => {
    const tokens = new Tokens(mockTokenData);

    expect(tokens.getExpirationTime()).toBe(mockTokenData.expirationTime);
  });

  it("should correctly return refresh token", () => {
    const tokens = new Tokens(mockTokenData);

    expect(tokens.getRefreshToken()).toBe(mockTokenData.refreshToken);
  });
});
