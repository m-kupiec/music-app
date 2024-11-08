/// <reference types="vitest/config" />

import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  test: {
    css: true,
    globals: true,
    environment: "jsdom",
    setupFiles: ["./vitest.setup.ts"],
    coverage: {
      reporter: ["text"],
      exclude: [
        "*.config.{js,ts}",
        "**/*.d.ts",
        "**/*.test.*",
        "src/tests/**/*",
        "src/main.tsx",
      ],
    },
  },
});
