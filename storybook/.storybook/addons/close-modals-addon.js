import { addons } from "storybook/manager-api";

// Register addon to close modals on story changes
addons.register("vviinn/close-modals-on-story-change", (api) => {
  const dispatchCloseEvent = () => {
    try {
      const previewFrame = document.querySelector("#storybook-preview-iframe");
      if (
        previewFrame &&
        previewFrame.contentWindow &&
        previewFrame.contentDocument
      ) {
        const previewEvent = new previewFrame.contentWindow.CustomEvent(
          "vviinnStorybookStoryChanged",
          { bubbles: true, composed: true },
        );
        previewFrame.contentDocument.dispatchEvent(previewEvent);
      }
    } catch (error) {
      // Silent fail
    }
  };

  const events = ["storyChanged", "setCurrentStory"];
  events.forEach((eventName) => {
    api.on(eventName, dispatchCloseEvent);
  });
});
