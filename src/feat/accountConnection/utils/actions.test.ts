import { describe, expect, it } from "vitest";
import { getTokenBasedAction } from "./actions";
import {
  expiredTokens,
  nonExpiredTokens,
} from "../../../tests/mocks/tokenData";

describe("getTokenBasedAction()", () => {
  it("should return 'tokensNotFound' for no tokens (null)", () => {
    expect(getTokenBasedAction(null)).toBe("tokensNotFound");
  });

  it("should return 'initTokenValidated' for non-expired tokens", () => {
    expect(getTokenBasedAction(nonExpiredTokens)).toBe("initTokenValidated");
  });

  it("should return 'initTokenExpired' for expired tokens", () => {
    expect(getTokenBasedAction(expiredTokens)).toBe("initTokenExpired");
  });
});
