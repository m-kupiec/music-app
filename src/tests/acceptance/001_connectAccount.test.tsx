import { vi, describe, it, expect, afterEach, MockInstance } from "vitest";
import "@testing-library/jest-dom";
import { cleanup, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import * as accountConnection from "../../feat/accountConnection/utils.ts";
import * as handlers from "../../feat/accountConnection/handlers.ts";
import App from "../../App.tsx";

describe("REQ-1: Let users connect their Spotify account", () => {
  afterEach(() => {
    cleanup();
  });

  describe("AC-1.1: A welcome screen appears when no Spotify account is connected on opening the app", () => {
    let getTokensSpy: MockInstance;

    beforeEach(() => {
      getTokensSpy = vi.spyOn(accountConnection, "getTokens");
    });

    afterEach(() => {
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
        "Please connect your Spotify account to proceed.",
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
        name: "Connect",
      });

      expect(button).toBeInTheDocument();
    });
  });

  describe("AC-1.3: A Spotify account is being connected at the user's request", () => {
    let connectSpotifyAccountSpy: MockInstance;

    beforeEach(() => {
      connectSpotifyAccountSpy = vi
        .spyOn(handlers, "connectSpotifyAccount")
        .mockReturnValue(Promise.resolve(undefined));
    });

    afterEach(() => {
      connectSpotifyAccountSpy.mockRestore();
    });

    it("initiates the Spotify account connection process upon pressing the connect button", async () => {
      const user = userEvent.setup();

      render(<App />);

      expect(connectSpotifyAccountSpy).not.toHaveBeenCalled();
      await user.click(screen.getByTestId("spotify-account-connection-button"));
      expect(connectSpotifyAccountSpy).toHaveBeenCalledOnce();

      cleanup();
    });

    it("continues the Spotify account connection process upon redirecting from the authorization page", async () => {
      const originalLocation = window.location;
      window.location = {
        ...originalLocation,
        search: "",
      };
      window.location.search = "?param_mock=value-mock";

      expect(connectSpotifyAccountSpy).not.toHaveBeenCalled();
      await import("../../main.tsx");
      expect(connectSpotifyAccountSpy).toHaveBeenCalledWith("handleAuth");

      window.location = originalLocation;
    });
  });
});
