import { vi, describe, it, expect, afterEach, MockInstance } from "vitest";
import "@testing-library/jest-dom";
import { cleanup, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import * as auth from "../../feat/accountConnection/utils/auth";
import * as tokens from "../../feat/accountConnection/utils/tokens";
import * as handlers from "../../feat/accountConnection/handlers";
import * as actions from "../../feat/accountConnection/utils/actions";
import * as connectionStatus from "../../feat/accountConnection/utils/connectionStatus";
import * as screensUtils from "../../feat/screens/utils";
import App from "../../App";
import { authCodeMock, authErrorParamsMock } from "../mocks/auth";

describe("REQ-1: Let users connect their Spotify account", () => {
  afterEach(() => {
    cleanup();
  });

  describe("AC-1.1: A welcome screen appears when no Spotify account is connected on opening the app", () => {
    let getTokensFromStorageSpy: MockInstance;

    beforeEach(() => {
      getTokensFromStorageSpy = vi.spyOn(tokens, "getTokensFromStorage");
    });

    afterEach(() => {
      getTokensFromStorageSpy.mockRestore();
    });

    it("renders the welcome screen if no tokens are available", () => {
      getTokensFromStorageSpy.mockReturnValue(null);

      render(<App authResponse={null} />);

      const element = screen.queryByTestId("welcome-screen");
      expect(element).toBeInTheDocument();
    });

    it("contains clear messaging prompting users to connect their Spotify account", () => {
      getTokensFromStorageSpy.mockReturnValue(null);

      render(<App authResponse={null} />);

      const element = screen.queryByText(
        "Please connect your Spotify account to proceed.",
      );
      expect(element).toBeInTheDocument();
    });
  });

  describe("AC-1.2: The welcome screen allows users to request to connect their Spotify account", () => {
    it("renders a button to initiate Spotify account connection", () => {
      render(<App authResponse={null} />);

      const button = screen.queryByTestId("spotify-account-connection-button");

      expect(button).toBeInTheDocument();
    });

    it("enables the Spotify account connection button", () => {
      render(<App authResponse={null} />);

      const button: HTMLButtonElement = screen.queryByTestId(
        "spotify-account-connection-button",
      )!;

      expect(button).toBeEnabled();
    });

    it("has a clear call to action on the Spotify account connection button", () => {
      render(<App authResponse={null} />);

      const button = screen.queryByRole("button", {
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

      render(<App authResponse={null} />);

      expect(connectSpotifyAccountSpy).not.toHaveBeenCalled();
      await user.click(
        screen.queryByTestId("spotify-account-connection-button")!,
      );
      expect(connectSpotifyAccountSpy).toHaveBeenCalledWith("auth");
    });

    it("continues the Spotify account connection process upon redirecting from the authorization page", async () => {
      const popAuthResponseFromQuerySpy = vi
        .spyOn(auth, "popAuthResponseFromQuery")
        .mockReturnValue(undefined);

      const getAuthBasedActionSpy = vi
        .spyOn(actions, "getAuthBasedAction")
        .mockReturnValue("authPageDisplay");

      const getAccountConnectionStatusSpy = vi
        .spyOn(connectionStatus, "getAccountConnectionStatus")
        .mockReturnValue("initiated");

      expect(popAuthResponseFromQuerySpy).not.toHaveBeenCalled();
      await import("../../main");
      expect(popAuthResponseFromQuerySpy).toHaveBeenCalled();

      popAuthResponseFromQuerySpy.mockRestore();
      getAuthBasedActionSpy.mockRestore();
      getAccountConnectionStatusSpy.mockRestore();
    });
  });

  describe("AC-1.4: The user is notified if they did not authorize the Spotify account connection", () => {
    it("displays a message to the user, indicating that authorization was not granted", () => {
      render(<App authResponse={authErrorParamsMock} />);

      const messageBox = screen.queryByTestId(
        "spotify-account-connection-message-box",
      );
      const messageText = screen.queryByTestId(
        "spotify-account-connection-message-text",
      );

      expect(messageBox).toBeVisible();
      expect(messageText).toBeVisible();
    });

    it("provides guidance on how the user can try to connect their Spotify account again", () => {
      render(<App authResponse={authErrorParamsMock} />);

      const element = screen.queryByText(
        "Please connect your Spotify account to proceed.",
      );
      const button = screen.queryByRole("button", {
        name: "Connect",
      });

      expect(element).toBeInTheDocument();
      expect(button).toBeInTheDocument();
    });
  });

  describe("AC-1.5: The user is notified of the Spotify account connection process", () => {
    it("notifies the user about the status of the Spotify account connection process", () => {
      render(<App authResponse={authCodeMock} />);

      const connectionScreen = screen.queryByTestId("connection-screen");

      expect(connectionScreen).toBeInTheDocument();
    });
  });

  describe("AC-1.6: The user is notified if connecting to the Spotify account fails", () => {
    let getScreenNameSpy: MockInstance;
    let getDisplayedMessageSpy: MockInstance;

    beforeEach(() => {
      getScreenNameSpy = vi
        .spyOn(screensUtils, "getScreenName")
        .mockReturnValue("welcome");

      getDisplayedMessageSpy = vi
        .spyOn(screensUtils, "getDisplayedMessage")
        .mockReturnValue("Connection failed.");
    });

    afterEach(() => {
      getScreenNameSpy.mockRestore();
      getDisplayedMessageSpy.mockRestore();
    });

    it("displays a message to the user, indicating that account connection failed", () => {
      render(<App authResponse={authCodeMock} />);

      const messageBox = screen.queryByTestId(
        "spotify-account-connection-message-box",
      );
      const messageText = screen.queryByTestId(
        "spotify-account-connection-message-text",
      );

      expect(messageBox).toBeVisible();
      expect(messageText).toBeVisible();
    });

    it("provides guidance on how the user can try to connect their Spotify account again", () => {
      render(<App authResponse={authCodeMock} />);

      const element = screen.queryByText(
        "Please connect your Spotify account to proceed.",
      );
      const button = screen.queryByRole("button", {
        name: "Connect",
      });

      expect(element).toBeInTheDocument();
      expect(button).toBeInTheDocument();
    });
  });

  describe("AC-1.7: The main screen appears after a successful Spotify account connection", () => {
    let getScreenNameSpy: MockInstance;
    let getDisplayedMessageSpy: MockInstance;

    beforeEach(() => {
      getScreenNameSpy = vi
        .spyOn(screensUtils, "getScreenName")
        .mockReturnValue("main");

      getDisplayedMessageSpy = vi
        .spyOn(screensUtils, "getDisplayedMessage")
        .mockReturnValue("Successfully connected");
    });

    afterEach(() => {
      getScreenNameSpy.mockRestore();
      getDisplayedMessageSpy.mockRestore();
    });

    it("renders the main screen after receiveing user's Spotify profile data", () => {
      render(<App authResponse={authCodeMock} />);

      const mainScreen = screen.queryByTestId("main-screen");
      expect(mainScreen).toBeInTheDocument();
    });

    it("contains clear indicators that the account has been successfully connected", () => {
      render(<App authResponse={authCodeMock} />);

      const message = screen.queryByText("Successfully connected");
      expect(message).toBeInTheDocument();
    });
  });
});
