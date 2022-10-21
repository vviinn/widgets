import { Configuration } from "webpack";

import { resolve } from "path";

const config = {
  stories: [
    "../../src/components/**/*.stories.@(js|jsx|ts|tsx)",
    "../documentation/**/*.stories.mdx",
  ],
  addons: [
    "@storybook/addon-links",
    "@storybook/addon-essentials",
    "@pxtrn/storybook-addon-docs-stencil",
  ],
  features: {
    previewMdx2: true,
    storyStoreV7: true,
  },
  core: {
    builder: {
      name: "webpack5",
    },
    disableTelemetry: true,
  },
  webpackFinal: async (config: Configuration) => {
    config.module.rules = [
      {
        test: /\.stories\.mdx$/,
        use: {
          loader: resolve("./stories.loader.ts"),
        },
      },
      ...config.module.rules,
    ];

    return config;
  },
};

export default config;
