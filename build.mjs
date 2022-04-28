// @ts-check
import { build } from "esbuild";
import { readFile, writeFile, stat } from "fs/promises";
import { resolve } from "path";

function timer(name) {
  const label = `${name} - ${Date.now().toString(36)}`;
  console.time(label);
  console.timeLog(label, "started");
  return () => console.timeEnd(label);
}

await build({
  entryPoints: ["src/index.ts"],
  outfile: "dist/index.js",
  bundle: true,
  sourcemap: true,
  plugins: [
    {
      name: "remove dev stuff",
      setup(plugin) {
        const RE_FILTER = /\.tsx?$/;
        /** @type {Map<string, Promise<{ contents: string }>>} */
        const loading = new Map();
        plugin.onResolve(
          {
            namespace: "file",
            filter: RE_FILTER,
          },
          async ({ path, ...options }) => {
            const absPath = resolve(options.resolveDir, path)
            // const loadingContent = (async () => {
            //   const time = timer(`load ${path}`);
            //   const content = await readFile(absPath, "utf8");
            //   await delay(1000);
            //   // hmm.
            //   time();
            //   return {
            //     contents: content.replace(
            //       /console\.log\(/g,
            //       `//"\`'ole.log(`
            //     ),
            //   };
            // })()
            // loading.set(
            //   absPath,
            //   loadingContent
            // );
            return {
              path: absPath,
              // pluginData: loadingContent
            };
          }
        );
        plugin.onLoad(
          {
            namespace: "file",
            filter: RE_FILTER,
          },
          async (hmm) => {
            const value = loading.get(hmm.path);
            console.log({ path: hmm.path, value, data: hmm.pluginData });
            if (value != null) {
              const { contents } = await value;
              return {
                contents,
                loader: hmm.path.endsWith("x") ? "tsx" : "ts",
                watchFiles: [hmm.path],
              };
            } else {
              const time = timer(`load ${hmm.path}`);
              const content = await readFile(hmm.path, "utf8");
              await delay(1000);
              // hmm.
              time();
              return {
                contents: content.replace(
                  /console\.log\(/g,
                  `//"\`'ole.log(`
                ),
                loader: hmm.path.endsWith("x") ? "tsx" : "ts",
                watchFiles: [hmm.path],
              };
            }
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

function delay(ms) {
  return new Promise((res) => setTimeout(res, ms));
}

// async function checkForTypeScriptAt(path) {
//   stat
// }
