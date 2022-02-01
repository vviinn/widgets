import { Component, Host, h } from "@stencil/core";
export class VviinnOnboarding {
  render() {
    return (h(Host, null,
      h("h3", null, "So funktioniert es"),
      h("vviinn-slider", { showArrows: true },
        h("vviinn-slide", null,
          h("vviinn-onboarding-card-1", null)),
        h("vviinn-slide", null,
          h("vviinn-onboarding-card-2", null)),
        h("vviinn-slide", null,
          h("vviinn-onboarding-card-3", null)))));
  }
  static get is() { return "vviinn-onboarding"; }
  static get originalStyleUrls() { return {
    "$": ["vviinn-onboarding.css"]
  }; }
  static get styleUrls() { return {
    "$": ["vviinn-onboarding.css"]
  }; }
}
