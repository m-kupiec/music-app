import { describe, it, expect } from "vitest";
import { getScreenName } from "./utils";

describe("getScreenName()", () => {
  it("returns 'welcome' for 'none'", () => {
    expect(getScreenName("none")).toBe("welcome");
  });

  it("returns 'welcome' for 'unauthorized'", () => {
    expect(getScreenName("unauthorized")).toBe("welcome");
  });

  it("returns 'welcome' for 'failed'", () => {
    expect(getScreenName("failed")).toBe("welcome");
  });

  it("returns 'welcome' for 'closed'", () => {
    expect(getScreenName("closed")).toBe("welcome");
  });

  it("returns 'auth' for 'initiated'", () => {
    expect(getScreenName("initiated")).toBe("auth");
  });

  it("returns 'connection' for 'authorized'", () => {
    expect(getScreenName("authorized")).toBe("connection");
  });

  it("returns 'connection' for 'pending'", () => {
    expect(getScreenName("pending")).toBe("connection");
  });

  it("returns 'main' for 'ok'", () => {
    expect(getScreenName("ok")).toBe("main");
  });

  it("returns 'main' for 'updating'", () => {
    expect(getScreenName("updating")).toBe("main");
  });

  it("returns 'main' for 'broken'", () => {
    expect(getScreenName("broken")).toBe("main");
  });

  it("returns 'none' for an unknown status", () => {
    expect(getScreenName("unknown" as AccountConnectionStatus)).toBe("none");
  });
});
