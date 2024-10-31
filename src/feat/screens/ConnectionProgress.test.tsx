import { cleanup, render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import { describe, it, vi } from "vitest";
import ConnectionProgress from "./ConnectionProgress";
import { authCodeMock } from "../../tests/mocks/auth";
import { useSpotifyAccountConnectionProcess } from "./hooks";

vi.mock("./hooks", () => {
  return {
    useSpotifyAccountConnectionProcess: vi.fn(() => {
      return;
    }),
  };
});

describe("ConnectionProgress", () => {
  afterEach(() => {
    cleanup();
  });

  it("continues connecting Spotify account when authorized by the user", () => {
    render(
      <ConnectionProgress
        accountConnectionStatus={"authorized"}
        setAccountConnectionStatus={vi.fn()}
        authCode={authCodeMock}
      />,
    );

    expect(useSpotifyAccountConnectionProcess).toHaveBeenCalled();
  });

  it("continues connecting Spotify account when valid tokens were found in the browser storage", () => {
    render(
      <ConnectionProgress
        accountConnectionStatus={"validated"}
        setAccountConnectionStatus={vi.fn()}
        authCode={authCodeMock}
      />,
    );

    expect(useSpotifyAccountConnectionProcess).toHaveBeenCalled();
  });

  it("displays full-page background to indicate ongoing account connection process", () => {
    render(
      <ConnectionProgress
        accountConnectionStatus={"authorized"}
        setAccountConnectionStatus={vi.fn()}
        authCode={authCodeMock}
      />,
    );

    const background = screen.queryByTestId("connection-progress-screen");

    expect(background).toBeInTheDocument();
  });
});
