// @ts-check
import { buildSync } from "esbuild";

buildSync({
  entryPoints: ["src/index.ts"],
  outfile: "dist/index.js",
});
