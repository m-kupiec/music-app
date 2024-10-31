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
import * as handlers from "../accountConnection/handlers";
import * as connectionStatus from "../accountConnection/utils/connectionStatus";
import { useSpotifyAccountConnectionProcess } from "./hooks";
import { authCodeMock } from "../../tests/mocks/auth";

describe("useSpotifyAccountConnectionProcess()", () => {
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
      useSpotifyAccountConnectionProcess(
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
      useSpotifyAccountConnectionProcess(
        "validated",
        setAccountConnectionStatusMock,
        authCodeMock,
      ),
    );

    expect(connectSpotifyAccountSpy).toHaveBeenLastCalledWith("userData");
  });

  it("sets proper Spotify account connection sucesss status", async () => {
    renderHook(() =>
      useSpotifyAccountConnectionProcess(
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
      useSpotifyAccountConnectionProcess(
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
