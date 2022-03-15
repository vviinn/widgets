module.exports = {
  stories: ["../../src/components/**/*.stories.@(js|jsx|ts|tsx)"],
  addons: [
    "@storybook/addon-links",
    "@storybook/addon-essentials",
    "@pxtrn/storybook-addon-docs-stencil",
    "storybook-addon-designs",
  ],
  framework: "@storybook/web-components",
  core: {
    builder: "webpack5",
  },
};
