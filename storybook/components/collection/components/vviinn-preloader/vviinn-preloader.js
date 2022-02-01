import { Component, Host, h } from "@stencil/core";
import { imageSearchState } from "../../store/imageSearch.store";
export class VviinnPreloader {
  isActive() {
    return (imageSearchState.loading || imageSearchState.objectDetectionInProgress);
  }
  render() {
    return (h(Host, { class: {
        active: this.isActive(),
      } }));
  }
  static get is() { return "vviinn-preloader"; }
  static get encapsulation() { return "shadow"; }
  static get originalStyleUrls() { return {
    "$": ["vviinn-preloader.css"]
  }; }
  static get styleUrls() { return {
    "$": ["vviinn-preloader.css"]
  }; }
}
