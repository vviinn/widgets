import { Component, ComponentInterface, Host, h } from "@stencil/core";

@Component({
  tag: "vpr-slidable",
  styleUrl: "vpr-slidable.css",
  shadow: true,
})
export class VprSlidable implements ComponentInterface {
  render() {
    return (
      <Host>
        <slider-mouse>
          <slot></slot>
        </slider-mouse>
      </Host>
    );
  }
}
