import { afterEach, describe, expect, it } from "vitest";
import "@testing-library/jest-dom";
import { cleanup, render, screen } from "@testing-library/react";
import MainView from "./MainView";

describe("Main screen", () => {
  afterEach(() => {
    cleanup();
  });

  describe("Account connection message area", () => {
    it("is not rendered if message is empty", () => {
      render(<MainView displayedMessage="" />);

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
      render(<MainView displayedMessage="Mock message." />);

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
