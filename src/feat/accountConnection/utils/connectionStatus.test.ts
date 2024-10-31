import { describe, it, expect } from "vitest";
import { getAccountConnectionStatus } from "./connectionStatus";

describe("getAccountConnectionStatus()", () => {
  it("returns 'none' for 'none'", () => {
    expect(getAccountConnectionStatus("none")).toBe("none");
  });

  it("returns 'none' for 'tokensNotFound'", () => {
    expect(getAccountConnectionStatus("tokensNotFound")).toBe("none");
  });

  it("returns 'validated' for 'initTokenValidated'", () => {
    expect(getAccountConnectionStatus("initTokenValidated")).toBe("validated");
  });

  it("returns 'pending' for 'initTokenExpired'", () => {
    expect(getAccountConnectionStatus("initTokenExpired")).toBe("pending");
  });

  it("returns 'pending' for 'initTokensProvide'", () => {
    expect(getAccountConnectionStatus("initTokensProvide")).toBe("pending");
  });

  it("returns 'pending' for 'moreTokensProvide'", () => {
    expect(getAccountConnectionStatus("moreTokensProvide")).toBe("pending");
  });

  it("returns 'initiated' for 'accountConnect'", () => {
    expect(getAccountConnectionStatus("accountConnect")).toBe("initiated");
  });

  it("returns 'initiated' for 'authPageDisplay'", () => {
    expect(getAccountConnectionStatus("authPageDisplay")).toBe("initiated");
  });

  it("returns 'authorized' for 'authCodeProvide'", () => {
    expect(getAccountConnectionStatus("authCodeProvide")).toBe("authorized");
  });

  it("returns 'unauthorized' for 'authCodeDeny'", () => {
    expect(getAccountConnectionStatus("authCodeDeny")).toBe("unauthorized");
  });

  it("returns 'failed' for 'initTokensDeny'", () => {
    expect(getAccountConnectionStatus("initTokensDeny")).toBe("failed");
  });

  it("returns 'failed' for 'initDataDeny'", () => {
    expect(getAccountConnectionStatus("initDataDeny")).toBe("failed");
  });

  it("returns 'ok' for 'initDataProvide'", () => {
    expect(getAccountConnectionStatus("initDataProvide")).toBe("ok");
  });

  it("returns 'ok' for 'requestAccept'", () => {
    expect(getAccountConnectionStatus("requestAccept")).toBe("ok");
  });

  it("returns 'updating' for 'refrTokenExpired'", () => {
    expect(getAccountConnectionStatus("refrTokenExpired")).toBe("updating");
  });

  it("returns 'updating' for 'refrTokenValidated'", () => {
    expect(getAccountConnectionStatus("refrTokenValidated")).toBe("updating");
  });

  it("returns 'broken' for 'moreTokensDeny'", () => {
    expect(getAccountConnectionStatus("moreTokensDeny")).toBe("broken");
  });

  it("returns 'broken' for 'requestDeny'", () => {
    expect(getAccountConnectionStatus("requestDeny")).toBe("broken");
  });

  it("returns 'closed' for 'accountDisconnect'", () => {
    expect(getAccountConnectionStatus("accountDisconnect")).toBe("closed");
  });

  it("returns 'none' for an unknown action", () => {
    expect(getAccountConnectionStatus("unknown" as Action)).toBe("none");
  });
});
