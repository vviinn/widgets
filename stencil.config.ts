import { Config } from "@stencil/core";
import { postcss } from "@stencil-community/postcss";
import autoprefixer from "autoprefixer";
import dotenvPlugin from "rollup-plugin-dotenv";
import { readFileSync } from "fs";
import preset from "cssnano-preset-advanced";

export const config: Config = {
  namespace: "vviinn-widgets",
  taskQueue: "async",
  outputTargets: [
    {
      type: "dist-custom-elements",
    },
    {
      type: "docs-json",
      file: "./docs.json",
    },
    {
      type: "www",
    },
  ],
  env: {
    packageVersion: process.env.npm_package_version,
    packageName: process.env.npm_package_name,
    environment: process.env.ENVIRONMENT,
  },
  globalStyle: "src/variables.css",
  plugins: [
    dotenvPlugin(),
    postcss({
      plugins: [
        autoprefixer(),
        require("cssnano")({
          preset,
        }),
      ],
    }),
  ],
  testing: {
    browserArgs: ["--no-sandbox", "--disable-setuid-sandbox"],
    browserHeadless: true,
  },
  devServer: {
    reloadStrategy: "pageReload",
    port: 4444,
    https: {
      cert: readFileSync("./cert/cert.pem", "utf8"),
      key: readFileSync("./cert/key.pem", "utf8"),
    },
  },
};
