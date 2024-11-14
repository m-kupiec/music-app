import { cleanup, render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import { describe, it, vi } from "vitest";
import ConnectionView from "./ConnectionView";
import { authCodeMock } from "../../tests/mocks/auth";
import useAccountConnectionProcess from "../accountConnection/useAccountConnectionProcess";

vi.mock("../accountConnection/useAccountConnectionProcess", () => {
  return {
    default: vi.fn(() => {
      return;
    }),
  };
});

describe("ConnectionView", () => {
  afterEach(() => {
    cleanup();
  });

  it("continues connecting Spotify account when authorized by the user", () => {
    render(
      <ConnectionView
        accountConnectionStatus={"authorized"}
        setAccountConnectionStatus={vi.fn()}
        authCode={authCodeMock}
      />,
    );

    expect(useAccountConnectionProcess).toHaveBeenCalled();
  });

  it("continues connecting Spotify account when valid tokens were found in the browser storage", () => {
    render(
      <ConnectionView
        accountConnectionStatus={"validated"}
        setAccountConnectionStatus={vi.fn()}
        authCode={authCodeMock}
      />,
    );

    expect(useAccountConnectionProcess).toHaveBeenCalled();
  });

  it("displays full-page background to indicate ongoing account connection process", () => {
    render(
      <ConnectionView
        accountConnectionStatus={"authorized"}
        setAccountConnectionStatus={vi.fn()}
        authCode={authCodeMock}
      />,
    );

    const background = screen.queryByTestId("connection-view");

    expect(background).toBeInTheDocument();
  });
});
