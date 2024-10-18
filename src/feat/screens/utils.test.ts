import { describe, it, expect } from "vitest";
import { getScreenName } from "./utils";

describe("getScreenName()", () => {
  it("should return 'welcome' for 'none'", () => {
    expect(getScreenName("none")).toBe("welcome");
  });

  it("should return 'welcome' for 'unauthorized'", () => {
    expect(getScreenName("unauthorized")).toBe("welcome");
  });

  it("should return 'welcome' for 'failed'", () => {
    expect(getScreenName("failed")).toBe("welcome");
  });

  it("should return 'welcome' for 'closed'", () => {
    expect(getScreenName("closed")).toBe("welcome");
  });

  it("should return 'auth' for 'initiated'", () => {
    expect(getScreenName("initiated")).toBe("auth");
  });

  it("should return 'connection' for 'authorized'", () => {
    expect(getScreenName("authorized")).toBe("connection");
  });

  it("should return 'connection' for 'pending'", () => {
    expect(getScreenName("pending")).toBe("connection");
  });

  it("should return 'main' for 'ok'", () => {
    expect(getScreenName("ok")).toBe("main");
  });

  it("should return 'main' for 'updating'", () => {
    expect(getScreenName("updating")).toBe("main");
  });

  it("should return 'main' for 'broken'", () => {
    expect(getScreenName("broken")).toBe("main");
  });

  it("should return 'none' for an unknown status", () => {
    expect(getScreenName("unknown" as AccountConnectionStatus)).toBe("none");
  });
});
