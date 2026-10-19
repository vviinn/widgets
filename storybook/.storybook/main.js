import { loadEnv } from "vite";
import demoSites from "../helpers/demoSites.json";

// Each key here is inlined into the publicly served bundle, so a variable reaches
// the browser only by being listed — a build-side credential named STORYBOOK_*
// stays out of it.
const EXPOSED_ENV_KEYS = ["STORYBOOK_API_PATH"];

// The product-card playground reads its cards by name from the selected site,
// so each site has to carry the same set as the first one.
const cardSets = Object.entries(demoSites).map(([siteId, { productCards }]) => [
  siteId,
  Object.keys(productCards ?? {})
    .sort()
    .join(", "),
]);
const [[, referenceCards]] = cardSets;
const sitesWithOtherCards = cardSets
  .filter(([, cards]) => cards !== referenceCards)
  .map(([siteId]) => siteId);

if (sitesWithOtherCards.length) {
  throw new Error(
    `productCards of ${sitesWithOtherCards.join(", ")} differ from the first site's (${referenceCards}) in storybook/helpers/demoSites.json.`,
  );
}

/** @type { import('@storybook/web-components-vite').StorybookConfig } */
const config = {
  stories: [
    "../stories/*.stories.@(js|jsx|ts|tsx)",
    "../documentation/change-log/*.mdx",
  ],
  addons: [
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

    const demoTokens = Object.fromEntries(
      Object.entries(demoSites).map(([siteId, { tokenEnvKey }]) => [
        siteId,
        env[tokenEnvKey],
      ]),
    );

    // Without a token the widgets render empty, which shows up only as a 401 in a visitor's
    // browser — long after the build went green and deployed. A deployed build is always a
    // static one, so configType tells it apart from `storybook dev`.
    if (configType === "PRODUCTION") {
      const missing = Object.entries(demoSites)
        .filter(([siteId]) => !demoTokens[siteId])
        .map(([, { tokenEnvKey }]) => tokenEnvKey);

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
      __STORYBOOK_DEMO_TOKENS__: JSON.stringify(demoTokens),
      global: "globalThis",
    };

    return config;
  },
  framework: {
    name: "@storybook/web-components-vite",
    options: {},
  },
  docs: {},
};
export default config;
