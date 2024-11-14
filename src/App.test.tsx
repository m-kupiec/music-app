import { describe, it, vi, expect, afterEach, MockInstance } from "vitest";
import "@testing-library/jest-dom";
import { cleanup, render, screen } from "@testing-library/react";
import App from "./App";
import * as viewsUtils from "./feat/views/utils";

vi.mock("./feat/views/WelcomeView", () => {
  return {
    default: function WelcomeView() {
      return <main data-testid="welcome-view"></main>;
    },
  };
});

/*
The return value of useAccountConnectionStatus() is irrelevant here,
  as it is only used as an argument in getViewName(),
  the return value of which is mocked anyway.
*/
vi.mock("./feat/accountConnection/useAccountConnectionStatus", () => {
  return {
    default: function useAccountConnectionStatus() {
      return [null, () => undefined];
    },
  };
});

vi.mock("./feat/views/ConnectionView", () => {
  return {
    default: function ConnectionView() {
      return <main data-testid="connection-view"></main>;
    },
  };
});

vi.mock("./feat/accountConnection/useAccountConnectionProcess", () => {
  return {
    default: function useAccountConnectionProcess() {
      return;
    },
  };
});

describe("The app", () => {
  let getViewNameSpy: MockInstance;
  let getDisplayedMessageSpy: MockInstance;

  beforeEach(() => {
    getViewNameSpy = vi.spyOn(viewsUtils, "getViewName");
    getDisplayedMessageSpy = vi
      .spyOn(viewsUtils, "getDisplayedMessage")
      .mockReturnValue("");
  });

  afterEach(() => {
    getViewNameSpy.mockRestore();
    getDisplayedMessageSpy.mockRestore();
    cleanup();
  });

  it("is able to start with the welcome screen", () => {
    getViewNameSpy.mockReturnValue("welcome");

    render(<App authResponse={null} />);

    const element = screen.queryByTestId("welcome-view");
    expect(element).toBeInTheDocument();
  });

  it("is able not to start with the welcome screen", () => {
    getViewNameSpy.mockReturnValue("none");

    render(<App authResponse={null} />);

    const element = screen.queryByTestId("welcome-view");
    expect(element).not.toBeInTheDocument();
  });

  it("is able to start with the connection screen", () => {
    getViewNameSpy.mockReturnValue("connection");

    render(<App authResponse={null} />);

    const element = screen.queryByTestId("connection-view");
    expect(element).toBeInTheDocument();
  });
});
