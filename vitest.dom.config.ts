import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    environment: "jsdom",
    include: ["src/**/*.{test,spec}.{jsx,tsx}"],
    coverage: {
      provider: "v8",
      reporter: ["text", "html", "lcov"],
      reportsDirectory: "coverage/dom",
      include: ["src/**/*.{jsx,tsx}"],
      exclude: [
        "src/**/*.{test,spec}.{jsx,tsx}",
        "coverage/",
        "node_modules/",
        "dist/",
        "**.config.**",
      ],
    },
  },
});
