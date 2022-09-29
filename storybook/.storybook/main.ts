import type { StorybookViteConfig } from "@storybook/builder-vite";

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
  core: {
    builder: "@storybook/builder-vite",
    disableTelemetry: true,
  },
  async viteFinal(config) {
    return config;
  },
};

export default config;
