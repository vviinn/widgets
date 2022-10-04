import type { StorybookViteConfig } from "@storybook/builder-vite";
import { replaceCodePlugin } from "vite-plugin-replace";
import { mergeConfig, loadEnv } from "vite";

const config: StorybookViteConfig = {
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
  },
  core: {
    builder: "@storybook/builder-vite",
    disableTelemetry: true,
  },
  async viteFinal(config) {
    const env = loadEnv("development", process.cwd(), "");
    const replacements = Object.entries(env)
      .filter(([key]) => key.includes("STORYBOOK"))
      .map(([key, value]) => {
        return {
          from: new RegExp(key, "g"),
          to: value,
        };
      });

    return mergeConfig(config, {
      plugins: [
        replaceCodePlugin({
          replacements,
        }),
      ],
    });
  },
};

export default config;
