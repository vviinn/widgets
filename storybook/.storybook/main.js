import { resolve } from "path";
import { loadEnv } from "vite";

// Each key here is inlined into the publicly served bundle, so a variable reaches
// the browser only by being listed — a build-side credential named STORYBOOK_*
// stays out of it.
const EXPOSED_ENV_KEYS = [
  "STORYBOOK_API_PATH",
  "STORYBOOK_CDN_PATH",
  "STORYBOOK_ENV",
  "STORYBOOK_NPM_PACKAGE_NAME",
  "STORYBOOK_TOKEN_FASHION",
  "STORYBOOK_TOKEN_HOME_LIVING",
  "STORYBOOK_TOKEN_MANUFACTURER_SPARE_PARTS",
  "STORYBOOK_VPR_WIDGET_TAG",
  "STORYBOOK_VPS_WIDGET_TAG",
];

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

    // Secrets arrive from .env.local locally and from Cloud Build secretEnv on deploy.
    const storybookEnvDefines = Object.fromEntries(
      EXPOSED_ENV_KEYS.filter((key) => key in env).map((key) => [
        `process.env.${key}`,
        JSON.stringify(env[key]),
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
