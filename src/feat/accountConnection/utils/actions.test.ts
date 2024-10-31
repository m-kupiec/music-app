import { describe, expect, it, vi } from "vitest";
import {
  getAuthBasedAction,
  getTokenApiBasedAction,
  getTokenBasedAction,
  getWebApiBasedAction,
} from "./actions";
import {
  expiredTokens,
  nonExpiredTokens,
} from "../../../tests/mocks/tokenData";
import { authCodeMock, authErrorParamsMock } from "../../../tests/mocks/auth";

describe("getWebApiBasedAction()", () => {
  it("returns 'initDataProvide' when the passed handler does not throw", async () => {
    const passedHandler = vi.fn().mockResolvedValue(undefined);
    const expectedAction: ServerAction = "initDataProvide";
    const returnedAction = await getWebApiBasedAction(passedHandler);

    expect(returnedAction).toBe(expectedAction);
  });

  it("returns 'initDataDeny' when the passed handler throws", async () => {
    const passedHandler = vi.fn().mockRejectedValue(new Error());
    const expectedAction: ServerAction = "initDataDeny";
    const returnedAction = await getWebApiBasedAction(passedHandler);

    expect(returnedAction).toBe(expectedAction);
  });
});

describe("getTokenApiBasedAction()", () => {
  it("returns 'initTokensProvide' when the passed handler does not throw", async () => {
    const passedHandler = vi.fn().mockResolvedValue(undefined);
    const expectedAction: ServerAction = "initTokensProvide";
    const returnedAction = await getTokenApiBasedAction(
      passedHandler,
      authCodeMock,
    );

    expect(returnedAction).toBe(expectedAction);
  });

  it("returns 'initTokensDeny' when the passed handler throws", async () => {
    const passedHandler = vi.fn().mockRejectedValue(new Error());
    const expectedAction: ServerAction = "initTokensDeny";
    const returnedAction = await getTokenApiBasedAction(
      passedHandler,
      authCodeMock,
    );

    expect(returnedAction).toBe(expectedAction);
  });
});

describe("getAuthBasedAction()", () => {
  it("returns 'authCodeProvide' when auth response contains auth code", () => {
    const expectedAction: ServerAction = "authCodeProvide";
    const returnedAction = getAuthBasedAction(authCodeMock);

    expect(returnedAction).toBe(expectedAction);
  });

  it("returns 'authCodeDeny' when auth response contains error code", () => {
    const expectedAction: ServerAction = "authCodeDeny";
    const returnedAction = getAuthBasedAction(authErrorParamsMock);

    expect(returnedAction).toBe(expectedAction);
  });

  it("returns 'none' when there is no auth response", () => {
    const expectedAction: ServerAction = "none";
    const returnedAction = getAuthBasedAction(null);

    expect(returnedAction).toBe(expectedAction);
  });
});

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
