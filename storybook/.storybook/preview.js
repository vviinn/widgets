import docJson from "../../docs.json";
import { fn } from "@storybook/test";
import {
  extractArgTypes,
  extractComponentDescription,
  setStencilDocJson,
} from "@pxtrn/storybook-addon-docs-stencil";

let loader;
let vviinnWidgets;
let isLocalEnv = process.env.ENV === "local";

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

if (docJson) setStencilDocJson(docJson);

export const parameters = {
  actions: { onClick: fn() },
  controls: { hideNoControlsWarning: true, expanded: true },
  docs: {
    extractArgTypes,
    extractComponentDescription,
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
