import { describe, it, vi, expect, afterEach, MockInstance } from "vitest";
import "@testing-library/jest-dom";
import { cleanup, render, screen } from "@testing-library/react";
import App from "./App";
import * as screensUtils from "./feat/screens/utils";

vi.mock("./feat/screens/WelcomeScreen", () => {
  return {
    default: function WelcomeScreen() {
      return <main data-testid="welcome-screen"></main>;
    },
  };
});

/*
The return value of useAccountConnectionStatus() is irrelevant here,
  as it is only used as an argument in getScreenName(),
  the return value of which is mocked anyway.
*/
vi.mock("./feat/accountConnection/hooks", () => {
  return {
    useAccountConnectionStatus() {
      return [null, () => undefined];
    },
  };
});

vi.mock("./feat/screens/ConnectionProgress", () => {
  return {
    default: function ConnectionProgress() {
      return <main data-testid="connection-progress-screen"></main>;
    },
  };
});

vi.mock("./feat/screens/hooks", () => {
  return {
    useSpotifyAccountConnectionProcess() {
      return;
    },
  };
});

describe("The app", () => {
  let getScreenNameSpy: MockInstance;

  beforeEach(() => {
    getScreenNameSpy = vi.spyOn(screensUtils, "getScreenName");
  });

  afterEach(() => {
    getScreenNameSpy.mockRestore();
    cleanup();
  });

  it("is able to start with the welcome screen", () => {
    getScreenNameSpy.mockReturnValue("welcome");

    render(<App authResponse={null} />);

    const element = screen.queryByTestId("welcome-screen");
    expect(element).toBeInTheDocument();
  });

  it("is able not to start with the welcome screen", () => {
    getScreenNameSpy.mockReturnValue("none");

    render(<App authResponse={null} />);

    const element = screen.queryByTestId("welcome-screen");
    expect(element).not.toBeInTheDocument();
  });

  it("is able to start with the connection progress screen", () => {
    getScreenNameSpy.mockReturnValue("connection");

    render(<App authResponse={null} />);

    const element = screen.queryByTestId("connection-progress-screen");
    expect(element).toBeInTheDocument();
  });
});
