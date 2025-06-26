import { resolve } from "path";

/** @type { import('@storybook/web-components-vite').StorybookConfig } */
const config = {
  stories: [
    "../stories/*.stories.@(js|jsx|ts|tsx)",
    "../documentation/**/*.mdx",
  ],
  addons: [
    "@storybook/addon-links",
    "../addons/docs-rendered/register.ts",
    "@storybook/addon-a11y",
    "@storybook/addon-docs",
  ],
  core: {
    disableTelemetry: true,
  },
  staticDirs: ["../public"],
  viteFinal: async (config) => {
    // Define globals for Node.js compatibility
    config.define = {
      ...config.define,
      "process.env": "import.meta.env",
      global: "globalThis",
    };

    // Custom MDX loader handling for Vite
    if (!config.plugins) config.plugins = [];

    config.plugins.push({
      name: "custom-mdx-loader",
      load(id) {
        if (id.endsWith(".mdx")) {
          const fs = require("fs");
          const path = require("path");

          if (fs.existsSync(id)) {
            // Use our custom loader for .mdx files
            const loader = require(resolve("./stories.loader.ts"));
            return loader.default(fs.readFileSync(id, "utf-8"));
          }
        }
      },
    });

    return config;
  },
  framework: {
    name: "@storybook/web-components-vite",
    options: {},
  },
  docs: {},
};
export default config;
