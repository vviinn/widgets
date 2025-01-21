import { Component, Host, h } from "@stencil/core";

@Component({
  tag: "vviinn-overlay",
  styleUrl: "vviinn-overlay.css",
  shadow: true,
})
export class VviinnOverlay {
  render() {
    return (
      <Host>
        <slot></slot>
      </Host>
    );
  }
}
