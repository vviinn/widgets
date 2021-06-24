import { Component, Host, h } from "@stencil/core";

@Component({
  tag: "vviinn-slide",
  styleUrl: "vviinn-slide.css",
  shadow: true,
})
export class VviinnSlide {
  render() {
    return (
      <Host>
        <slot></slot>
      </Host>
    );
  }
}
