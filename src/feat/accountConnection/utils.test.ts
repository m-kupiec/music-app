import { describe, it, expect } from "vitest";
import { getTokenBasedAction, getAccountConnectionStatus } from "./utils.ts";
import { nonExpiredTokens, expiredTokens } from "../../tests/mocks/tokens.ts";

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

describe("getAccountConnectionStatus()", () => {
  it("should return 'none' for 'none'", () => {
    expect(getAccountConnectionStatus("none")).toBe("none");
  });

  it("should return 'none' for 'tokensNotFound'", () => {
    expect(getAccountConnectionStatus("tokensNotFound")).toBe("none");
  });

  it("should return 'pending' for 'initTokenValidated'", () => {
    expect(getAccountConnectionStatus("initTokenValidated")).toBe("pending");
  });

  it("should return 'pending' for 'initTokenExpired'", () => {
    expect(getAccountConnectionStatus("initTokenExpired")).toBe("pending");
  });

  it("should return 'pending' for 'initTokensProvide'", () => {
    expect(getAccountConnectionStatus("initTokensProvide")).toBe("pending");
  });

  it("should return 'pending' for 'moreTokensProvide'", () => {
    expect(getAccountConnectionStatus("moreTokensProvide")).toBe("pending");
  });

  it("should return 'initiated' for 'accountConnect'", () => {
    expect(getAccountConnectionStatus("accountConnect")).toBe("initiated");
  });

  it("should return 'initiated' for 'authPageDisplay'", () => {
    expect(getAccountConnectionStatus("authPageDisplay")).toBe("initiated");
  });

  it("should return 'authorized' for 'authCodeProvide'", () => {
    expect(getAccountConnectionStatus("authCodeProvide")).toBe("authorized");
  });

  it("should return 'unauthorized' for 'authCodeDeny'", () => {
    expect(getAccountConnectionStatus("authCodeDeny")).toBe("unauthorized");
  });

  it("should return 'failed' for 'initTokensDeny'", () => {
    expect(getAccountConnectionStatus("initTokensDeny")).toBe("failed");
  });

  it("should return 'failed' for 'initDataDeny'", () => {
    expect(getAccountConnectionStatus("initDataDeny")).toBe("failed");
  });

  it("should return 'ok' for 'initDataProvide'", () => {
    expect(getAccountConnectionStatus("initDataProvide")).toBe("ok");
  });

  it("should return 'ok' for 'requestAccept'", () => {
    expect(getAccountConnectionStatus("requestAccept")).toBe("ok");
  });

  it("should return 'updating' for 'refrTokenExpired'", () => {
    expect(getAccountConnectionStatus("refrTokenExpired")).toBe("updating");
  });

  it("should return 'updating' for 'refrTokenValidated'", () => {
    expect(getAccountConnectionStatus("refrTokenValidated")).toBe("updating");
  });

  it("should return 'broken' for 'moreTokensDeny'", () => {
    expect(getAccountConnectionStatus("moreTokensDeny")).toBe("broken");
  });

  it("should return 'broken' for 'requestDeny'", () => {
    expect(getAccountConnectionStatus("requestDeny")).toBe("broken");
  });

  it("should return 'closed' for 'accountDisconnect'", () => {
    expect(getAccountConnectionStatus("accountDisconnect")).toBe("closed");
  });

  it("should return 'none' for an unknown action", () => {
    expect(getAccountConnectionStatus("unknown" as Action)).toBe("none");
  });
});
