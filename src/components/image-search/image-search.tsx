import { Component, Host, h, Prop } from "@stencil/core";

@Component({
  tag: "image-search",
  styleUrl: "image-search.css",
  shadow: true,
})
export class ImageSearch {
  /** Mediaopt customer token */
  @Prop() token: string;

  render() {
    return (
      <Host>
        <slot></slot>
      </Host>
    );
  }
}
