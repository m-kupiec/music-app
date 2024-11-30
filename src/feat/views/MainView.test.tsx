import { afterEach, describe, expect, it, MockInstance, vi } from "vitest";
import "@testing-library/jest-dom";
import { cleanup, render, screen } from "@testing-library/react";
import MainView from "./MainView";
import * as webApiUtils from "../accountConnection/utils/webApi";
import { accountProfileDataMock } from "../../tests/mocks/webApi";

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

  describe("Account profile data area", () => {
    let getAccountProfileDataSpy: MockInstance;

    afterEach(() => {
      getAccountProfileDataSpy.mockRestore();
    });

    it("displays user name if account profile data is available", () => {
      getAccountProfileDataSpy = vi
        .spyOn(webApiUtils, "getAccountProfileData")
        .mockReturnValue(accountProfileDataMock);

      render(<MainView displayedMessage="Mock message." />);

      const userProfileNameElement = screen.queryByTestId(
        "spotify-account-profile-data-display-name",
      );
      expect(userProfileNameElement).toBeInTheDocument();
      expect(userProfileNameElement?.innerText).not.toBe("");
    });

    it("does not display user name if account profile data is unavailable", () => {
      getAccountProfileDataSpy = vi
        .spyOn(webApiUtils, "getAccountProfileData")
        .mockReturnValue(null);

      render(<MainView displayedMessage="Mock message." />);

      const userProfileNameElement = screen.queryByTestId(
        "spotify-account-profile-data-display-name",
      );
      expect(userProfileNameElement).not.toBeInTheDocument();
    });
  });
});
