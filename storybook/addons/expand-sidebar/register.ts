import { addons } from "@storybook/addons";
import { DOCS_RENDERED } from "@storybook/core-events";

const expandButtons = () => {
  const buttons: NodeListOf<HTMLButtonElement> = document.querySelectorAll(
    "button.sidebar-item"
  );

  buttons.forEach((button) => {
    if (button.getAttribute("aria-expanded") === "false") {
      button.click();
      button.style.background = "none";
    }
  });
};

addons.register("expand-sidebar", (api) => {
  let isExpanded = false;

  api.on(DOCS_RENDERED, () => {
    if (isExpanded) return;
    expandButtons();
    isExpanded = true;
  });
});
