import { describe, expect, it } from "vitest";
import { Tokens } from "./classes";
import { mockTokenData } from "../../tests/mocks/tokenData";

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
