import { describe, expect, it } from "vitest";
import { AuthError, TokenApiError, Tokens, WebApiError } from "./classes";
import { mockTokenData } from "../../tests/mocks/tokenData";
import { webApiErrorJsonMock } from "../../tests/mocks/webApi";

describe("WebApiError", () => {
  it("instantiates with empty message and null details by default", () => {
    const error = new WebApiError();

    expect(error.message).toBe("");
    expect(error.details).toBeNull();
  });

  it("sets message when instantiated with a string not convertible to number", () => {
    const message: string = webApiErrorJsonMock.error.message;

    expect(Number(message)).toBe(NaN);

    const error = new WebApiError(message);

    expect(error.status).toBe(NaN);
    expect(error.message).toBe(message);
    expect(error.details).toBeNull();
  });

  it("sets status when instantiated with a string convertible to number", () => {
    const status: WebApiErrorStatus = webApiErrorJsonMock.error.status;
    const statusString = String(status);

    const error = new WebApiError(statusString);

    expect(error.status).toBe(status);
    expect(error.message).toBe("");
    expect(error.details).toBeNull();
  });

  it("sets message, status, and details when instantiated with complete JSON", () => {
    const errorJson = webApiErrorJsonMock;
    const error = new WebApiError(errorJson);

    expect(error.status).toBe(errorJson.error.status);
    expect(error.message).toBe(errorJson.error.message);
    expect(error.details?.status).toBe(errorJson.error.status);
    expect(error.details?.message).toBe(errorJson.error.message);
  });

  it("handles JSON with missing error property", () => {
    const errorJson = {};
    const error = new WebApiError(errorJson as WebApiErrorJson);

    expect(error.status).toBe(NaN);
    expect(error.message).toBe("");
    expect(error.details).toBe(null);
  });

  it("handles JSON with missing message and status properties", () => {
    const errorJson = {
      error: {},
    };
    const error = new WebApiError(errorJson as WebApiErrorJson);

    expect(error.status).toBe(NaN);
    expect(error.message).toBe("");
    expect(error.details?.status).toBe(NaN);
    expect(error.details?.message).toBe("");
  });

  it("handles JSON with missing message property", () => {
    const status = webApiErrorJsonMock.error.status;
    const errorJson = {
      error: {
        status: status,
      },
    };
    const error = new WebApiError(errorJson as WebApiErrorJson);

    expect(error.status).toBe(status);
    expect(error.message).toBe("");
    expect(error.details?.status).toBe(status);
    expect(error.details?.message).toBe("");
  });

  it("handles JSON with missing status property", () => {
    const message = webApiErrorJsonMock.error.message;
    const errorJson = {
      error: {
        message: message,
      },
    };
    const error = new WebApiError(errorJson as WebApiErrorJson);

    expect(error.status).toBe(NaN);
    expect(error.message).toBe(message);
    expect(error.details?.status).toBe(NaN);
    expect(error.details?.message).toBe(message);
  });

  describe("getDetails()", () => {
    it("returns empty string if details are null", () => {
      const error = new WebApiError();

      expect(error.getDetails()).toBe("");
    });

    it("returns formatted string if full details are provided", () => {
      const error = new WebApiError(webApiErrorJsonMock);

      expect(error.getDetails()).toBe(
        `${webApiErrorJsonMock.error.status}: ${webApiErrorJsonMock.error.message}`,
      );
    });

    it("returns formatted string if partial details are provided", () => {
      const status = webApiErrorJsonMock.error.status;
      const message = webApiErrorJsonMock.error.message;

      let errorJson = {};
      let error = new WebApiError(errorJson as WebApiErrorJson);
      expect(error.getDetails()).toBe("");

      errorJson = { error: {} };
      error = new WebApiError(errorJson as WebApiErrorJson);
      expect(error.getDetails()).toBe("");

      errorJson = { error: { status } };
      error = new WebApiError(errorJson as WebApiErrorJson);
      expect(error.getDetails()).toBe(`${status}`);

      errorJson = { error: { message } };
      error = new WebApiError(errorJson as WebApiErrorJson);
      expect(error.getDetails()).toBe(`${message}`);
    });
  });
});

describe("TokenApiError", () => {
  it("instantiates with empty message and null details by default", () => {
    const error = new TokenApiError();

    expect(error.message).toBe("");
    expect(error.details).toBeNull();
  });

  it("sets message when instantiated with a string", () => {
    const message: TokenApiErrorCode = "invalid_request";

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
    const message: TokenApiErrorCode = "invalid_request";

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
      const message: TokenApiErrorCode = "invalid_request";
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
      const message: TokenApiErrorCode = "invalid_request";
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

  it("sets message and details when instantiated with complete params object", () => {
    const params: AuthErrorParams = {
      error: "access_denied",
      error_description: "Access denied",
      error_uri: "https://example.com/error",
    };
    const error = new AuthError(params);

    expect(error.message).toBe(params.error);
    expect(error.details?.message).toBe(params.error);
    expect(error.details?.description).toBe(params.error_description);
    expect(error.details?.uri).toBe(params.error_uri);
  });

  it("handles params object with missing optional properties", () => {
    const message: AuthErrorCode = "access_denied";

    const params: AuthErrorParams = {
      error: message,
    };
    const error = new AuthError(params);

    expect(error.message).toBe(params.error);
    expect(error.details?.message).toBe(params.error);
    expect(error.details?.description).toBe("");
    expect(error.details?.uri).toBe("");
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

      const params: AuthErrorParams = {
        error: message,
        error_description: description,
        error_uri: uri,
      };
      const error = new AuthError(params);

      expect(error.getDetails()).toBe(`${message}: ${description} (${uri})`);
    });

    it("returns formatted string if partial details are provided", () => {
      const message: AuthErrorCode = "access_denied";
      const description = "Access denied";
      const uri = "https://example.com/error";

      let params: AuthErrorParams = {
        error: message,
        error_description: description,
        error_uri: uri,
      };
      let error = new AuthError(params);
      expect(error.getDetails()).toBe(`${message}: ${description} (${uri})`);

      params = { error: message };
      error = new AuthError(params);
      expect(error.getDetails()).toBe(message);

      params = { error: message, error_description: description };
      error = new AuthError(params);
      expect(error.getDetails()).toBe(`${message}: ${description}`);

      params = { error: message, error_uri: uri };
      error = new AuthError(params);
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
