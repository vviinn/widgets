import docJson from "../../docs.json";
import {
  extractArgTypes,
  extractComponentDescription,
  setStencilDocJson,
} from "@kurbar/storybook-addon-docs-stencil";

let loader;
let vviinnWidgets;
let isLocalEnv = import.meta.env.STORYBOOK_ENV === "local";

(async () => {
  if (isLocalEnv) {
    loader = await import("../../dist/loader");
    loader.defineCustomElements();
    vviinnWidgets = await import("../../dist");
  } else {
    loader = await import("../node_modules/vviinn-widgets/dist/loader");
    loader.defineCustomElements();
    vviinnWidgets = await import("../node_modules/vviinn-widgets");
  }
})();

// Set Stencil documentation for automatic prop documentation
setStencilDocJson(docJson);

export const parameters = {
  actions: { argTypesRegex: "^on[A-Z].*" },
  controls: { hideNoControlsWarning: true, expanded: true },
  docs: {
    extractArgTypes,
    extractComponentDescription,
    toc: { headingSelector: "h2, h3", disable: false },
  },
  options: {
    storySort: {
      order: [
        "Welcome to vviinn widgets",
        "Getting Started",
        "Widgets",
        "Components",
        "Installation",
        "Customization",
        "Events",
        "Playground",
        "Changelog",
      ],
    },
  },
};
