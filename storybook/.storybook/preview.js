import docJson from "../../docs.json";
import { fn } from "@storybook/test";
import {
  extractArgTypes,
  extractComponentDescription,
  setStencilDocJson,
} from "@pxtrn/storybook-addon-docs-stencil";

let loader;
let vviinnWidgets;
let isLocalEnv = process.env.STORYBOOK_ENV === "local";

if (docJson) setStencilDocJson(docJson);

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
        "Vviinn Widgets",
        "Installation",
        "Getting Started",
        "Styling and Customization",
        "Widgets",
        "Elements",
      ],
    },
  },
};
