import { addons } from "storybook/manager-api";
import { DOCS_RENDERED } from "storybook/internal/core-events";

addons.register("docs-rendered", (api) => {
  api.on(DOCS_RENDERED, () => {
    const storybookPreviewIframeElement = document.querySelector(
      "#storybook-preview-iframe",
    ) as HTMLIFrameElement;

    const storybookBodyContainer =
      storybookPreviewIframeElement.contentDocument.body;
    storybookBodyContainer.style.overflow = "unset";
  });
});
