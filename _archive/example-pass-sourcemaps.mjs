// @ts-check
import { build } from "esbuild";
import { readFile, writeFile } from "fs/promises";

await build({
  entryPoints: ["src/index.ts"],
  outfile: "dist/index.js",
  bundle: true,
  sourcemap: true,
  plugins: [
    {
      name: "remove dev stuff",
      setup(plugin) {
        plugin.onLoad(
          {
            filter: /.*\.tsx?$/,
          },
          async (hmm) => {
            const content = await readFile(hmm.path, "utf8");
            // hmm.
            return {
              contents: content.replace(/console\.log\(/g, `//"\`'ole.log(`),
              loader: hmm.path.endsWith("x") ? "tsx" : "ts",
              watchFiles: [hmm.path],
            };
          }
        );

        plugin.onEnd(async (result) => {
          console.error("onEnd result", result);
          // throw new Error("hmmm");
          if (result.outputFiles) {
            result.outputFiles.map((outputFile) => {
              // file.text = file.text.replace("asdd", "hmmmmmmmm")
              // file.path
            });
          }
        });
      },
    },
  ],
});

// test minify + sourcemapping
await build({
  entryPoints: ["dist/index.js"],
  outfile: "dist/index.min.js",
  sourcemap: true,
  minifyIdentifiers: true,
});
