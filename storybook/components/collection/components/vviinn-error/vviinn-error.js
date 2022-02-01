import { Component, Host, h } from "@stencil/core";
export class VviinnError {
  render() {
    return (h(Host, null,
      h("slot", { name: "icon" }),
      h("slot", { name: "title" }),
      h("slot", { name: "text" }),
      h("slot", { name: "action" })));
  }
  static get is() { return "vviinn-error"; }
  static get encapsulation() { return "shadow"; }
  static get originalStyleUrls() { return {
    "$": ["vviinn-error.css"]
  }; }
  static get styleUrls() { return {
    "$": ["vviinn-error.css"]
  }; }
}
