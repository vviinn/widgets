import { addons } from "@storybook/addons";
import { DOCS_RENDERED } from "@storybook/core-events";

addons.register("expand-sidebar", (api) => {
  let isExpanded = false;

  api.on(DOCS_RENDERED, () => {
    if (isExpanded) return;
    const buttons = document.querySelectorAll("button.sidebar-item");
    buttons.forEach((button) => button.click());
    isExpanded = true;
  });
});
