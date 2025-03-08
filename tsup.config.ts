import { defineConfig } from "tsup";

export default defineConfig({
  entry: ["src/**/*.ts"], // Keep file structure for dynamic loading
  outDir: "dist",
  format: ["esm"],
  dts: true, // Generate type declarations
  sourcemap: true,
  splitting: false, // No bundling, keep files separate
  clean: true, // Clean output directory before each build
});
