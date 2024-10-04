import { describe, it, vi, expect, afterEach, afterAll } from "vitest";
import "@testing-library/jest-dom";
import { cleanup, render, screen } from "@testing-library/react";
import App from "./App.tsx";
import * as screensUtils from "./feat/screens/utils.ts";

vi.mock("./feat/screens/WelcomeScreen.tsx", () => {
  return {
    default: function WelcomeScreen() {
      return <main data-testid="welcome-screen"></main>;
    },
  };
});

/*
The return value of useAccountConnectionStatus() is irrelevant here (and so made null),
  as it is only used as an argument in getScreenName(),
  the return value of which is mocked anyway.
*/
vi.mock("./feat/accountConnection/hooks.ts", () => {
  return {
    useAccountConnectionStatus() {
      return null;
    },
  };
});

describe("The app", () => {
  const getScreenNameSpy = vi.spyOn(screensUtils, "getScreenName");

  afterEach(() => {
    getScreenNameSpy.mockReset();
    cleanup();
  });

  afterAll(() => {
    getScreenNameSpy.mockRestore();
  });

  it("should be able to start with the welcome screen", () => {
    getScreenNameSpy.mockReturnValue("welcome");

    render(<App />);

    const element = screen.queryByTestId("welcome-screen");
    expect(element).toBeInTheDocument();
  });

  it("should be able not to start with the welcome screen", () => {
    getScreenNameSpy.mockReturnValue("none");

    render(<App />);

    const element = screen.queryByTestId("welcome-screen");
    expect(element).not.toBeInTheDocument();
  });
});
