import { server } from "./src/tests/mocks/server.ts";
import { cleanup } from "@testing-library/react";
import { afterEach, beforeAll, afterAll } from "vitest";

beforeAll(() => {
  server.listen();
});

afterEach(() => {
  server.resetHandlers();
  cleanup();
});

afterAll(() => {
  server.close();
});
