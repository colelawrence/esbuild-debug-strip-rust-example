// @ts-check
import { build } from "esbuild";
import theatreStripPlugin from "./theatre-strip/index.js";

await build({
  entryPoints: ["src/index.ts"],
  outfile: "dist/index.js",
  bundle: true,
  sourcemap: true,
  plugins: [theatreStripPlugin],
});
