const { build } = require("esbuild");
const { execFileSync } = require("node:child_process");
const { copyFileSync, mkdirSync, readFileSync, writeFileSync } = require("node:fs");
const path = require("node:path");
process.chdir(__dirname);

async function buildFrontend() {
  const output = path.resolve("../public/assets");
  mkdirSync(output, { recursive: true });
  await build({
    entryPoints: ["main.jsx"],
    outfile: path.join(output, "app.js"),
    bundle: true,
    minify: true,
    format: "esm",
    define: { "process.env.NODE_ENV": '"production"' },
  });
  const css = execFileSync(
    process.execPath,
    [require.resolve("tailwindcss/lib/cli.js"), "-i", "base.css", "--minify"],
    { encoding: "utf8" },
  );
  writeFileSync(
    path.join(output, "app.css"),
    css + "\n" + readFileSync("style.css", "utf8"),
  );
  copyFileSync("index.html", "../public/index.html");
}

buildFrontend().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});

