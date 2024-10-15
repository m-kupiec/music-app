import { describe, expect, it } from "vitest";
import { Tokens } from "./classes";
import { mockTokensData } from "../../tests/mocks/tokenData";

describe("Tokens", () => {
  it("should correctly initialize all properties", () => {
    const tokens = new Tokens(mockTokensData);

    expect(tokens.accessToken).toBe(mockTokensData.accessToken);
    expect(tokens.expirationLength).toBe(mockTokensData.expirationLength);
    expect(tokens.expirationTime).toBe(mockTokensData.expirationTime);
    expect(tokens.refreshToken).toBe(mockTokensData.refreshToken);
  });

  it("should correctly return access token", () => {
    const tokens = new Tokens(mockTokensData);

    expect(tokens.getAccessToken()).toBe(mockTokensData.accessToken);
  });

  it("should correctly return expiration length", () => {
    const tokens = new Tokens(mockTokensData);

    expect(tokens.getExpirationLength()).toBe(mockTokensData.expirationLength);
  });

  it("should correctly return expiration time", () => {
    const tokens = new Tokens(mockTokensData);

    expect(tokens.getExpirationTime()).toBe(mockTokensData.expirationTime);
  });

  it("should correctly return refresh token", () => {
    const tokens = new Tokens(mockTokensData);

    expect(tokens.getRefreshToken()).toBe(mockTokensData.refreshToken);
  });
});
