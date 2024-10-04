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

      const button = screen.getByTestId("spotify-account-connection-button");

      expect(button).toBeVisible();
    });
  });
});
