import path from "path";
import { defineConfig } from "vite";

export default defineConfig(({ command }) => {
  if (command === "build") {
    return {
      build: {
        lib: {
          entry: path.resolve(__dirname, "src/index.ts"),
          name: "formx",
          formats: ["es", "cjs"],
          fileName: (format) => {
            if (format === "es") return "index.mjs";
            if (format === "cjs") return "index.js";
            return `index.${format}.js`;
          },
        },
        rollupOptions: {
          external: ["rxjs"],
          output: {
            globals: {
              rxjs: "rxjs",
            },
          },
        },
        sourcemap: true,
      },
    };
  }

  return {
    root: "./example",
    resolve: {
      alias: {
        "@src": path.resolve(__dirname, "src"),
      },
    },
    server: {
      port: 5173,
    },
  };
});
