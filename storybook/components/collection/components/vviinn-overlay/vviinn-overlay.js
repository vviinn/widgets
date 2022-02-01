import { Component, Host, h } from '@stencil/core';
export class VviinnOverlay {
  render() {
    return (h(Host, null,
      h("slot", null)));
  }
  static get is() { return "vviinn-overlay"; }
  static get encapsulation() { return "shadow"; }
  static get originalStyleUrls() { return {
    "$": ["vviinn-overlay.css"]
  }; }
  static get styleUrls() { return {
    "$": ["vviinn-overlay.css"]
  }; }
}
