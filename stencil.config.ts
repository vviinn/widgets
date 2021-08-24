import { Config } from "@stencil/core";
import dotenvPlugin from "rollup-plugin-dotenv";
import { postcss } from "@stencil/postcss";
import autoprefixer from "autoprefixer";

export const config: Config = {
  namespace: "mediaopt-widgets",
  taskQueue: "async",
  outputTargets: [
    {
      type: "dist",
    },
    {
      type: "docs-readme",
    },
    {
      type: "www",
      serviceWorker: null, // disable service workers,
      copy: [{ src: "assets" }, { src: "favicon.ico" }],
    },
  ],
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
