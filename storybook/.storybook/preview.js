import docJson from "../../docs.json";
import {
  extractArgTypes,
  extractComponentDescription,
  setStencilDocJson,
} from "@pxtrn/storybook-addon-docs-stencil";

import { defineCustomElements } from "../node_modules/vviinn-widgets/dist/loader";
import "../node_modules/vviinn-widgets";

if (docJson) setStencilDocJson(docJson);

defineCustomElements();

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
