import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    environment: "jsdom",
    include: ["src/**/*.{test,spec}.{js,ts}"],
    coverage: {
      provider: "v8",
      reporter: ["text", "html", "lcov"],
      reportsDirectory: "coverage",
      include: ["src/**/*.{jsx,tsx}"],
      exclude: [
        "src/**/*.{test,spec}.{js,ts}",
        "coverage/",
        "node_modules/",
        "dist/",
        "**.config.**",
      ],
    },
  },
});
