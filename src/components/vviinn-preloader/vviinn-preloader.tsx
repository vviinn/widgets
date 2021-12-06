import { Component, Host, h } from "@stencil/core";
import { imageSearchState } from "../../store/imageSearch.store";

@Component({
  tag: "vviinn-preloader",
  styleUrl: "vviinn-preloader.css",
  shadow: true,
})
export class VviinnPreloader {
  private isActive(): boolean {
    return (
      imageSearchState.loading || imageSearchState.objectDetectionInProgress
    );
  }

  render() {
    return (
      <Host
        class={{
          active: this.isActive(),
        }}
      ></Host>
    );
  }
}
