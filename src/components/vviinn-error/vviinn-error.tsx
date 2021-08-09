import { Component, Host, h } from "@stencil/core";

@Component({
  tag: "vviinn-error",
  styleUrl: "vviinn-error.css",
  shadow: true,
})
export class VviinnError {
  render() {
    return (
      <Host>
        <slot name="title"></slot>
        <slot name="text"></slot>
        <slot name="action"></slot>
      </Host>
    );
  }
}
