import docJson from "../../docs.json";
import {
  extractArgTypes,
  extractComponentDescription,
  setStencilDocJson,
} from "@kurbar/storybook-addon-docs-stencil";

let loader;
let vviinnWidgets;

// `storybook dev` renders the working tree. A static build renders the installed package,
// which Cloud Build points at the branch build on stage and leaves on the npm release in production.
(async () => {
  if (import.meta.env.DEV) {
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
  },
  options: {
    storySort: {
      order: ["Welcome", "Playground", "Changelog"],
    },
  },
};
