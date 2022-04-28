// @ts-check
import { build } from "esbuild";
import { resolve } from "path";
import { execaCommand } from "execa";

const stripDir = resolve("./theatre-strip");
const stripCommand = resolve(stripDir, "./target/release/theatre-strip");

// get started on cargo build right away in the background
const cargoBuild = execaCommand("cargo build --release", {
  cwd: stripDir,
});

await build({
  entryPoints: ["src/index.ts"],
  outfile: "dist/index.js",
  bundle: true,
  sourcemap: true,
  plugins: [
    {
      name: "theatre-strip",
      setup(plugin) {
        const RE_LOAD_FILTER = /\.tsx?$/;
        plugin.onLoad(
          {
            namespace: "file",
            filter: RE_LOAD_FILTER,
          },
          async ({ path }) => {
            await cargoBuild;
            const result = await execaCommand(`${stripCommand} ${path}`);

            return {
              contents: result.stdout,
              loader: path.endsWith("x") ? "tsx" : "ts",
              watchFiles: [path],
            };
          }
        );
      },
    },
  ],
});
