import { vi, describe, it, expect, afterEach, afterAll } from "vitest";
import "@testing-library/jest-dom";
import { cleanup, render, screen } from "@testing-library/react";
import * as accountConnection from "../../feat/accountConnection/utils.ts";
import App from "../../App.tsx";

describe("REQ-1: Let users connect their Spotify account", () => {
  describe("AC-1.1: A welcome screen appears when no Spotify account is connected on opening the app", () => {
    const getTokensSpy = vi.spyOn(accountConnection, "getTokens");

    afterEach(() => {
      getTokensSpy.mockReset();
      cleanup();
    });

    afterAll(() => {
      getTokensSpy.mockRestore();
    });

    it("renders the welcome screen if no tokens are available", () => {
      getTokensSpy.mockReturnValue(null);

      render(<App />);

      const element = screen.queryByTestId("welcome-screen");
      expect(element).toBeInTheDocument();
    });

    it("contains clear messaging prompting users to connect their Spotify account", () => {
      getTokensSpy.mockReturnValue(null);

      render(<App />);

      const element = screen.queryByText(
        "Please connect your Spotify account to proceed",
      );
      expect(element).toBeInTheDocument();
    });
  });

  describe("AC-1.2: The welcome screen allows users to request to connect their Spotify account", () => {
    it("renders a button to initiate Spotify account connection", () => {
      render(<App />);

      const button = screen.getByTestId("spotify-account-connection-button");

      expect(button).toBeInTheDocument();
    });

    it("enables the Spotify account connection button", () => {
      render(<App />);

      const button: HTMLButtonElement = screen.getByTestId(
        "spotify-account-connection-button",
      );

      expect(button).toBeEnabled();
    });

    it("has a clear call to action on the Spotify account connection button", () => {
      render(<App />);

      const button = screen.getByRole("button", {
        name: "Connect Spotify Account",
      });

      expect(button).toBeInTheDocument();
    });
  });
});
