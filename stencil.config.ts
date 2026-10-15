import { Config } from "@stencil/core";
import postCss from "postcss";
import autoprefixer from "autoprefixer";
import dotenvPlugin from "rollup-plugin-dotenv";
import { readFileSync } from "fs";
import path from "path";

// Stencil's built-in autoprefixCss is not an option here: it emits a different prefix set
// than autoprefixer at any browserslist query.
const autoprefixPlugin = () => ({
  name: "autoprefix-css",
  pluginType: "css",
  async transform(sourceText: string, fileName: string) {
    if (!/\.css$/i.test(fileName) || sourceText.trim() === "") {
      return null;
    }

    const result = await postCss([autoprefixer()]).process(sourceText, {
      from: fileName,
    });

    return { id: fileName, code: result.css };
  },
});

// Apache-2.0 §4(a) wants the license to travel with every distribution, CDN bundles included.
// Version-pinned jsdelivr links keep pointing at the terms that version shipped under.
const buildLicensePreamble = () => {
  const { name, version, license } = JSON.parse(
    readFileSync(path.join(__dirname, "package.json"), "utf8"),
  );
  const notice = readFileSync(path.join(__dirname, "NOTICE"), "utf8");
  const copyright = notice
    .split("\n")
    .find((line) => line.startsWith("Copyright"));
  if (!copyright) throw new Error("NOTICE carries no Copyright line.");

  const base = `https://cdn.jsdelivr.net/npm/${name}@${version}`;
  return [
    `${name} v${version}`,
    copyright.trim(),
    `SPDX-License-Identifier: ${license}`,
    `License: ${base}/LICENSE`,
    `Notice: ${base}/NOTICE`,
  ].join("\n");
};

export const config: Config = {
  extras: { enableImportInjection: true },
  namespace: "vviinn-widgets",
  preamble: buildLicensePreamble(),
  taskQueue: "async",
  outputTargets: [
    {
      type: "dist",
    },
    {
      type: "docs-json",
      file: "./docs.json",
    },
    {
      type: "www",
      serviceWorker: null, // disable service workers,
      copy: [
        // Dev harness lives outside srcDir so it never reaches dist/collection.
        { src: "../dev/dev-config.js", dest: "dev-config.js", warn: false },
        { src: "../dev/dev-harness.js", dest: "dev-harness.js" },
        { src: "favicon.ico" },
        { src: "favicon.svg" },
        { src: "apple-touch-icon.png" },
      ],
    },
  ],
  env: {
    packageVersion: process.env.npm_package_version,
    packageName: process.env.npm_package_name,
    environment: process.env.ENV,
  },
  globalScript: "src/global",
  globalStyle: "src/variables.css",
  plugins: [dotenvPlugin(), autoprefixPlugin()],
  testing: {
    // Count every source file, not only the ones a test touches: otherwise the
    // first test written for an untested file drags the global figure down.
    collectCoverageFrom: ["src/**/*.{ts,tsx}", "!src/**/*.{spec,test}.*"],
  },
  sourceMap: false,
  devServer:
    process.env.ENV === "local"
      ? {
          https: {
            cert: readFileSync(path.join(__dirname, "localhost.pem"), "utf8"),
            key: readFileSync(
              path.join(__dirname, "localhost-key.pem"),
              "utf8",
            ),
          },
        }
      : {},
};
