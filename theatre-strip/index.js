//@ts-check
import { resolve } from "path";
import { exec } from "child_process";

const stripDir = import.meta.url
  .replace(/^file:\/\//, "")
  .replace(/index\.js$/, "");
const stripCommand = resolve(stripDir, "./target/release/theatre-strip");

// get started on cargo build right away in the background
const cargoBuild = run("cargo build --release", {
  cwd: stripDir,
});

/** @type {import("esbuild").Plugin} */
const theatreStripPlugin = {
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
        const result = await run(`${stripCommand} ${path}`);

        return {
          contents: result.stdout,
          loader: path.endsWith("x") ? "tsx" : "ts",
          watchFiles: [path],
        };
      }
    );
  },
};

export default theatreStripPlugin;

/**
 * @param {string} command
 * @param {import("child_process").ExecOptions} [execOptions]
 * @returns {Promise<{ stdout: string }>}
 */
function run(command, execOptions = {}) {
  return new Promise((res, rej) => {
    exec(command, execOptions, (err, stdout, stderr) => {
      process.stderr.write(stderr);
      if (err) {
        rej(err);
      } else {
        res({ stdout });
      }
    });
  });
}
