import { StorybookConfig } from "@storybook/web-components-webpack5";
import { resolve } from "path";

const config: StorybookConfig = {
  stories: [
    "../../src/components/**/*.stories.@(js|jsx|ts|tsx)",
    "../documentation/**/*.mdx",
  ],
  addons: [
    "@storybook/addon-links",
    "@storybook/addon-essentials",
    "@storybook/addon-webpack5-compiler-babel",
    "../addons/expand-sidebar/register.ts",
  ],
  core: {
    disableTelemetry: true,
  },
  webpackFinal: async (config) => {
    if (config && config.module && config.module.rules) {
      config.module.rules = [
        {
          test: /\.mdx$/,
          use: {
            loader: resolve("./stories.loader.ts"),
          },
        },
        ...config.module.rules,
      ];
    }
    if (config && config.entry && Array.isArray(config.entry)) {
      config.entry = config.entry.filter(
        (singleEntry) => !singleEntry.includes("/webpack-hot-middleware/")
      );
    }
    return config;
  },
  framework: {
    name: "@storybook/web-components-webpack5",
    options: {},
  },
  docs: {},
};
export default config;
