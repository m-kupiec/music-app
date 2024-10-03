import { vi, describe, it, expect, afterEach } from "vitest";
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

    it("renders the welcome screen if no tokens are available", () => {
      getTokensSpy.mockReturnValue(null);

      render(<App />);

      const element = screen.queryByTestId("welcome-screen");
      expect(element).not.toBeNull();
    });

    it("contains clear messaging prompting users to connect their Spotify account", () => {
      getTokensSpy.mockReturnValue(null);

      render(<App />);

      const element = screen.queryByText(
        "Please connect your Spotify account to proceed",
      );
      expect(element).not.toBeNull();
    });
  });
});
