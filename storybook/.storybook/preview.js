import docJson from "../../docs.json";
import { fn } from "@storybook/test";

let loader;
let vviinnWidgets;
let isLocalEnv = process.env.STORYBOOK_ENV === "local";

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
