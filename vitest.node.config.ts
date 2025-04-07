import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    environment: "node",
    include: ["src/**/*.{test,spec}.{js,mjs,cjs,ts,mts,cts}"],
    coverage: {
      provider: "v8",
      reporter: ["text", "html", "lcov"],
      reportsDirectory: "coverage/node",
      include: ["src/**/*.{js,mjs,cjs,ts,mts,cts}"],
      exclude: [
        "src/**/*.{test,spec,d}.{js,mjs,cjs,ts,mts,cts}",
        "coverage/",
        "node_modules/",
        "dist/",
        "**.config.**",
      ],
    },
  },
});
