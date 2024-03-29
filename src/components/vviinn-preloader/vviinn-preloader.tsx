import { Component, Host, h } from "@stencil/core";
import { searchState } from "../../store/search.store";

@Component({
  tag: "vviinn-preloader",
  styleUrl: "vviinn-preloader.css",
  shadow: true,
})
export class VviinnPreloader {
  private isActive(): boolean {
    return searchState.loading || searchState.objectDetectionInProgress;
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
