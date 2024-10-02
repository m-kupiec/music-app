import { beforeEach, describe, expect, it } from "vitest";
import { Tokens } from "./classes.ts";
import { mockTokensData } from "../../tests/mocks/tokens.ts";

describe("Tokens", () => {
  let tokens: Tokens;

  beforeEach(() => {
    tokens = new Tokens(mockTokensData);
  });

  it("should correctly initialize all properties", () => {
    expect(tokens.accessToken).toBe(mockTokensData.accessToken);
    expect(tokens.expirationLength).toBe(mockTokensData.expirationLength);
    expect(tokens.expirationTime).toBe(mockTokensData.expirationTime);
    expect(tokens.refreshToken).toBe(mockTokensData.refreshToken);
  });

  it("should correctly return access token", () => {
    expect(tokens.getAccessToken()).toBe(mockTokensData.accessToken);
  });

  it("should correctly return expiration length", () => {
    expect(tokens.getExpirationLength()).toBe(mockTokensData.expirationLength);
  });

  it("should correctly return expiration time", () => {
    expect(tokens.getExpirationTime()).toBe(mockTokensData.expirationTime);
  });

  it("should correctly return refresh token", () => {
    expect(tokens.getRefreshToken()).toBe(mockTokensData.refreshToken);
  });
});
