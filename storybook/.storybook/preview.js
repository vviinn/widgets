import docJson from "../../docs.json";
import {
  extractArgTypes,
  extractComponentDescription,
  setStencilDocJson,
} from "@pxtrn/storybook-addon-docs-stencil";

import { defineCustomElements as loadProductionComponents } from "vviinn-widgets/dist/loader";
import { defineCustomElements as loadLocalComponents } from "../../dist/loader/index.js";

const env = process.env.NODE_ENV;

if (docJson) setStencilDocJson(docJson);

if (env === "production") {
  loadProductionComponents();
} else {
  loadLocalComponents();
  console.log("use repo components");
}

export const parameters = {
  actions: { argTypesRegex: "^on[A-Z].*" },
  controls: {
    controls: { hideNoControlsWarning: true },
  },
  docs: {
    extractArgTypes,
    extractComponentDescription,
  },
  options: {
    storySort: {
      method: "alphabetical",
      order: ["Installation", "Getting Started", "Widgets", "Elements"],
    },
  },
};
