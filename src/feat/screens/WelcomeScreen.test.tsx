import { afterEach, describe, expect, it } from "vitest";
import "@testing-library/jest-dom";
import { cleanup, render, screen } from "@testing-library/react";
import WelcomeScreen from "./WelcomeScreen";

describe("Welcome screen", () => {
  afterEach(() => {
    cleanup();
  });

  describe("Spotify account connection prompt", () => {
    it("is visible to the user", () => {
      render(<WelcomeScreen />);

      const element = screen.queryByTestId("spotify-account-connection-prompt");

      expect(element).toBeVisible();
    });
  });

  describe("Spotify account connection button", () => {
    it("is visible to the user", () => {
      render(<WelcomeScreen />);

      const button = screen.queryByTestId("spotify-account-connection-button");

      expect(button).toBeVisible();
    });
  });

  describe("Account connection message area", () => {
    it("is not rendered if message is empty", () => {
      render(<WelcomeScreen displayedMessage="" />);

      const messageBox = screen.queryByTestId(
        "spotify-account-connection-message-box",
      );
      const messageText = screen.queryByTestId(
        "spotify-account-connection-message-text",
      );

      expect(messageBox).not.toBeInTheDocument();
      expect(messageText).not.toBeInTheDocument();
    });

    it("is visible to the user if there is a message to display", () => {
      render(<WelcomeScreen displayedMessage="Mock message." />);

      const messageBox = screen.queryByTestId(
        "spotify-account-connection-message-box",
      );
      const messageText = screen.queryByTestId(
        "spotify-account-connection-message-text",
      );

      expect(messageBox).toBeVisible();
      expect(messageText).toBeVisible();
    });
  });
});
