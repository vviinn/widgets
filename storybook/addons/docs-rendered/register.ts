import { addons } from "@storybook/addons";
import { DOCS_RENDERED } from "@storybook/core-events";

addons.register("docs-rendered", (api) => {
  api.on(DOCS_RENDERED, () => {
    const storybookPreviewIframeElement = document.querySelector(
      "#storybook-preview-iframe"
    ) as HTMLIFrameElement;

    const storybookBodyContainer =
      storybookPreviewIframeElement.contentDocument.body;
    storybookBodyContainer.style.overflow = "unset";
  });
});
