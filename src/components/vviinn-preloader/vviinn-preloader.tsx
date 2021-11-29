import { Component, Host, h } from "@stencil/core";
import { imageSearchState } from "../../store/imageSearch.store";

@Component({
  tag: "vviinn-preloader",
  styleUrl: "vviinn-preloader.css",
  shadow: true,
})
export class VviinnPreloader {
  render() {
    return (
      <Host
        class={{
          active:
            imageSearchState.loading ||
            imageSearchState.objectDetectionInProgress,
        }}
      ></Host>
    );
  }
}
