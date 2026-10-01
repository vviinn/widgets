import { resolve } from "path";
import { loadEnv } from "vite";

// Each key here is inlined into the publicly served bundle, so a variable reaches
// the browser only by being listed — a build-side credential named STORYBOOK_*
// stays out of it.
const EXPOSED_ENV_KEYS = [
  "STORYBOOK_API_PATH",
  "STORYBOOK_CDN_PATH",
  "STORYBOOK_NPM_PACKAGE_NAME",
  "STORYBOOK_TOKEN_FASHION",
  "STORYBOOK_TOKEN_HOME_LIVING",
  "STORYBOOK_TOKEN_MANUFACTURER_SPARE_PARTS",
  "STORYBOOK_VPR_WIDGET_TAG",
  "STORYBOOK_VPS_WIDGET_TAG",
];

// Without these the widgets render with an empty token, which shows up only as a
// 401 in a visitor's browser — long after the build went green and deployed.
const REQUIRED_ENV_KEYS = [
  "STORYBOOK_TOKEN_FASHION",
  "STORYBOOK_TOKEN_HOME_LIVING",
  "STORYBOOK_TOKEN_MANUFACTURER_SPARE_PARTS",
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

    // Vite serialises every prefixed variable into import.meta.env in the output, which
    // would bypass the allowlist above.
    config.envPrefix = ["VITE_"];

    // A deployed build is always a static one, so configType tells it apart from `storybook dev`.
    if (configType === "PRODUCTION") {
      const missing = REQUIRED_ENV_KEYS.filter((key) => !env[key]);

      if (missing.length) {
        throw new Error(
          `Missing Storybook demo tokens: ${missing.join(", ")}. ` +
            "Locally they come from storybook/.env.local, on deploy from Cloud Build secretEnv.",
        );
      }
    }

    // Secrets arrive from .env.local locally and from Cloud Build secretEnv on deploy.
    const exposedEnv = Object.fromEntries(
      EXPOSED_ENV_KEYS.filter((key) => key in env).map((key) => [
        key,
        env[key],
      ]),
    );

    const storybookEnvDefines = Object.fromEntries(
      Object.entries(exposedEnv).map(([key, value]) => [
        `process.env.${key}`,
        JSON.stringify(value),
      ]),
    );

    config.define = {
      ...config.define,
      ...storybookEnvDefines,
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
            // Use our custom loader for .mdx files. It substitutes only what is passed
            // in, so the allowlist above governs the documentation output too.
            const loader = require(resolve("./stories.loader.ts"));
            return loader.default(fs.readFileSync(id, "utf-8"), exposedEnv);
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
