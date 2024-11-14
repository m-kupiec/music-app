import { describe, it, expect } from "vitest";
import { getDisplayedMessage, getViewName } from "./utils";

describe("getDisplayedMessage()", () => {
  it("returns an empty string for 'none'", () => {
    expect(getDisplayedMessage("none")).toBe("");
  });

  it("returns 'Not authorized.' for 'unauthorized'", () => {
    expect(getDisplayedMessage("unauthorized")).toBe("Not authorized");
  });

  it("returns 'Connection failed.' string for 'failed'", () => {
    expect(getDisplayedMessage("failed")).toBe("Connection failed");
  });

  it("returns an empty string for 'closed'", () => {
    expect(getDisplayedMessage("closed")).toBe("");
  });

  it("returns an empty string for 'initiated'", () => {
    expect(getDisplayedMessage("initiated")).toBe("");
  });

  it("returns an empty string for 'authorized'", () => {
    expect(getDisplayedMessage("authorized")).toBe("");
  });

  it("returns an empty string for 'pending'", () => {
    expect(getDisplayedMessage("pending")).toBe("");
  });

  it("returns 'Successfully connected' string for 'ok'", () => {
    expect(getDisplayedMessage("ok")).toBe("Successfully connected");
  });

  it("returns an empty string for 'updating'", () => {
    expect(getDisplayedMessage("updating")).toBe("");
  });

  it("returns an empty string for 'broken'", () => {
    expect(getDisplayedMessage("broken")).toBe("");
  });

  it("returns an empty string for an unknown status", () => {
    expect(getDisplayedMessage("unknown" as AccountConnectionStatus)).toBe("");
  });
});

describe("getViewName()", () => {
  it("returns 'welcome' for 'none'", () => {
    expect(getViewName("none")).toBe("welcome");
  });

  it("returns 'welcome' for 'unauthorized'", () => {
    expect(getViewName("unauthorized")).toBe("welcome");
  });

  it("returns 'welcome' for 'failed'", () => {
    expect(getViewName("failed")).toBe("welcome");
  });

  it("returns 'welcome' for 'closed'", () => {
    expect(getViewName("closed")).toBe("welcome");
  });

  it("returns 'auth' for 'initiated'", () => {
    expect(getViewName("initiated")).toBe("auth");
  });

  it("returns 'connection' for 'authorized'", () => {
    expect(getViewName("authorized")).toBe("connection");
  });

  it("returns 'connection' for 'pending'", () => {
    expect(getViewName("pending")).toBe("connection");
  });

  it("returns 'main' for 'ok'", () => {
    expect(getViewName("ok")).toBe("main");
  });

  it("returns 'main' for 'updating'", () => {
    expect(getViewName("updating")).toBe("main");
  });

  it("returns 'main' for 'broken'", () => {
    expect(getViewName("broken")).toBe("main");
  });

  it("returns 'none' for an unknown status", () => {
    expect(getViewName("unknown" as AccountConnectionStatus)).toBe("none");
  });
});
