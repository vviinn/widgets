import { Config } from "@stencil/core";

export const config: Config = {
  namespace: "mediaopt-widgets",
  taskQueue: "async",
  outputTargets: [
    {
      type: "docs-readme",
      dir: "docs",
      footer: "*Built by vviinn*",
    },
  ],
};
