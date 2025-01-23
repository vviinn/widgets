import { Config } from "@stencil/core";
import { postcss } from "@stencil-community/postcss";
import autoprefixer from "autoprefixer";
import dotenvPlugin from "rollup-plugin-dotenv";
import { readFileSync } from "fs";
import path from "path";

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
      copy: [{ src: "assets" }, { src: "favicon.ico" }],
    },
  ],
  env: {
    packageVersion: process.env.npm_package_version,
    packageName: process.env.npm_package_name,
    environment: process.env.ENV,
  },
  globalScript: "src/global",
  globalStyle: "src/variables.css",
  plugins: [
    dotenvPlugin(),
    postcss({
      plugins: [autoprefixer()],
    }),
  ],
  testing: {
    browserArgs: ["--no-sandbox", "--disable-setuid-sandbox"],
    browserHeadless: true,
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
