import { Configuration } from "webpack";
import { resolve } from "path";
const config = {
  stories: ["../../src/components/**/*.stories.@(js|jsx|ts|tsx)", "../documentation/**/*.stories.mdx"],
  addons: ["@storybook/addon-links", "@storybook/addon-essentials", "@pxtrn/storybook-addon-docs-stencil"],
  features: {
    previewMdx2: true,
    storyStoreV7: true,
  },
  core: {
    disableTelemetry: true
  },
  webpackFinal: async (config: Configuration) => {
    if(config && config.module && config.module.rules){
      config.module.rules = [{
        test: /\.stories\.mdx$/,
        use: {
          loader: resolve("./stories.loader.ts")
        }
      }, ...config.module.rules];
    }
    if(config && config.entry && Array.isArray(config.entry)){
      config.entry = config.entry.filter(singleEntry => !singleEntry.includes('/webpack-hot-middleware/'))
    }
    return config;
  },
  framework: {
    name: "@storybook/web-components-webpack5",
    options: {}
  },
  docs: {
    autodocs: "tag"
  }
};
export default config;