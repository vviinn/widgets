import { Config, Plugin } from "@stencil/core";
import postCss from "postcss";
import autoprefixer from "autoprefixer";
import dotenvPlugin from "rollup-plugin-dotenv";
import { readFileSync } from "fs";
import path from "path";

// Stencil's built-in autoprefixCss is not an option here: it emits a different prefix set
// than autoprefixer at any browserslist query.
const autoprefixPlugin = (): Plugin => ({
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

export const config: Config = {
  extras: { enableImportInjection: true },
  namespace: "vviinn-widgets",
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
        { src: "assets" },
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
    browserArgs: ["--no-sandbox", "--disable-setuid-sandbox"],
    browserHeadless: "shell",
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
