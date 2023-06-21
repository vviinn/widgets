import { Config } from "@stencil/core";
import { postcss } from "@stencil-community/postcss";
import autoprefixer from "autoprefixer";
import dotenvPlugin from "rollup-plugin-dotenv";

export const config: Config = {
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
    environment: process.env.ENVIRONMENT,
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
};
