import { describe, expect, MockInstance, vi } from "vitest";
import "@testing-library/jest-dom";
import { render, screen, cleanup } from "@testing-library/react";
import App from "../../App";
import { authCodeMock } from "../mocks/auth";
import * as viewsUtils from "../../feat/views/utils";
import * as webApiUtils from "../../feat/accountConnection/utils/webApi";
import { accountProfileDataMock } from "../mocks/webApi";

describe("REQ-2: Provide connected Spotify account profile information to users", () => {
  describe("AC-2.1: The connected Spotify account's user name and avatar are displayed on the main screen", () => {
    let getViewNameSpy: MockInstance;
    let getDisplayedMessageSpy: MockInstance;
    let getAccountProfileDataSpy: MockInstance;

    beforeEach(() => {
      getViewNameSpy = vi
        .spyOn(viewsUtils, "getViewName")
        .mockReturnValue("main");

      getDisplayedMessageSpy = vi
        .spyOn(viewsUtils, "getDisplayedMessage")
        .mockReturnValue("Successfully connected");

      getAccountProfileDataSpy = vi
        .spyOn(webApiUtils, "getAccountProfileData")
        .mockReturnValue(accountProfileDataMock);
    });

    afterEach(() => {
      getViewNameSpy.mockRestore();
      getDisplayedMessageSpy.mockRestore();
      getAccountProfileDataSpy.mockRestore();

      cleanup();
    });

    it("displays user name of the connected Spotify account", () => {
      render(<App authResponse={authCodeMock} />);

      const userProfileNameElement = screen.queryByTestId(
        "spotify-account-profile-data-display-name",
      );
      expect(userProfileNameElement).toBeInTheDocument();
      expect(userProfileNameElement?.innerText).not.toBe("");
    });
  });
});
