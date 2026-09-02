import { resolve } from "path";
import { loadEnv } from "vite";

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
  viteFinal: async (config, { configType }) => {
    const env = loadEnv(configType, process.cwd(), ["STORYBOOK_"]);

    config.envPrefix = ["VITE_", "STORYBOOK_"];

    // Expose every STORYBOOK_* var, so adding one needs no build-config edit. Secrets
    // arrive from .env.local locally and from Cloud Build secretEnv on deploy.
    const storybookEnvDefines = Object.fromEntries(
      Object.entries(env).map(([key, value]) => [
        `process.env.${key}`,
        JSON.stringify(value),
      ]),
    );

    config.define = {
      ...config.define,
      ...storybookEnvDefines,
      "import.meta.env.STORYBOOK_ENV": JSON.stringify(
        env.STORYBOOK_ENV || process.env.STORYBOOK_ENV || "local",
      ),
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
