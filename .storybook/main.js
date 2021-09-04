module.exports = {
  stories: ["../src/**/*.stories.mdx", "../src/**/*.stories.@(js|jsx|ts|tsx)"],
  addons: [
    "@storybook/addon-essentials",
    "@pxtrn/storybook-addon-docs-stencil",
    "storybook-addon-designs"
  ],
  features: {
    postcss: false,
    babelModeV7: true,
  },
};
