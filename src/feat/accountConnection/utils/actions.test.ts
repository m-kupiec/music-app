import { describe, expect, it } from "vitest";
import { getTokenBasedAction } from "./actions";
import {
  expiredTokens,
  nonExpiredTokens,
} from "../../../tests/mocks/tokenData";

describe("getTokenBasedAction()", () => {
  it("returns 'tokensNotFound' for no tokens (null)", () => {
    expect(getTokenBasedAction(null)).toBe("tokensNotFound");
  });

  it("returns 'initTokenValidated' for non-expired tokens", () => {
    expect(getTokenBasedAction(nonExpiredTokens)).toBe("initTokenValidated");
  });

  it("returns 'initTokenExpired' for expired tokens", () => {
    expect(getTokenBasedAction(expiredTokens)).toBe("initTokenExpired");
  });
});
