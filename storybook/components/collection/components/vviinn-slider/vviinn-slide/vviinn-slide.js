import { Component, Host, h } from "@stencil/core";
export class VviinnSlide {
  render() {
    return (h(Host, null,
      h("slot", null)));
  }
  static get is() { return "vviinn-slide"; }
  static get encapsulation() { return "shadow"; }
  static get originalStyleUrls() { return {
    "$": ["vviinn-slide.css"]
  }; }
  static get styleUrls() { return {
    "$": ["vviinn-slide.css"]
  }; }
}
