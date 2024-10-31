import { renderHook, waitFor } from "@testing-library/react";
import {
  afterEach,
  beforeEach,
  describe,
  expect,
  it,
  MockInstance,
  vi,
} from "vitest";
import * as handlers from "./handlers";
import * as connectionStatus from "./utils/connectionStatus";
import useAccountConnectionProcess from "./useAccountConnectionProcess";
import { authCodeMock } from "../../tests/mocks/auth";

describe("useAccountConnectionProcess()", () => {
  let connectSpotifyAccountSpy: MockInstance;
  let getAccountConnectionStatusSpy: MockInstance;
  let setAccountConnectionStatusMock: React.Dispatch<
    React.SetStateAction<AccountConnectionStatus>
  > &
    MockInstance;

  beforeEach(() => {
    connectSpotifyAccountSpy = vi
      .spyOn(handlers, "connectSpotifyAccount")
      .mockImplementation(() => Promise.resolve());

    getAccountConnectionStatusSpy = vi
      .spyOn(connectionStatus, "getAccountConnectionStatus")
      .mockImplementation((action) => {
        if (action === "initDataProvide") return "ok";

        return "failed";
      });

    setAccountConnectionStatusMock = vi.fn();
  });

  afterEach(() => {
    connectSpotifyAccountSpy.mockRestore();
    getAccountConnectionStatusSpy.mockRestore();
    setAccountConnectionStatusMock.mockRestore();
  });

  it("starts the token phase of the Spotify account connection process when authorized by the user", () => {
    renderHook(() =>
      useAccountConnectionProcess(
        "authorized",
        setAccountConnectionStatusMock,
        authCodeMock,
      ),
    );

    expect(connectSpotifyAccountSpy).toHaveBeenLastCalledWith(
      "tokens",
      authCodeMock,
    );
  });

  it("starts the user data phase of the Spotify account connection process when retrieved tokens", () => {
    renderHook(() =>
      useAccountConnectionProcess(
        "validated",
        setAccountConnectionStatusMock,
        authCodeMock,
      ),
    );

    expect(connectSpotifyAccountSpy).toHaveBeenLastCalledWith("userData");
  });

  it("sets proper Spotify account connection sucesss status", async () => {
    renderHook(() =>
      useAccountConnectionProcess(
        "authorized",
        setAccountConnectionStatusMock,
        authCodeMock,
      ),
    );

    await waitFor(() =>
      expect(setAccountConnectionStatusMock).toHaveBeenCalledWith("ok"),
    );
  });

  it("sets proper Spotify account connection failure status", async () => {
    connectSpotifyAccountSpy = vi
      .spyOn(handlers, "connectSpotifyAccount")
      .mockImplementation(() => Promise.reject(new Error()));

    renderHook(() =>
      useAccountConnectionProcess(
        "authorized",
        setAccountConnectionStatusMock,
        authCodeMock,
      ),
    );

    await waitFor(() =>
      expect(setAccountConnectionStatusMock).toHaveBeenCalledWith("failed"),
    );
  });
});
