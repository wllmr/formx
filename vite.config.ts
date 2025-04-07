import path from "path";
import { defineConfig } from "vite";

export default defineConfig({
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
});
