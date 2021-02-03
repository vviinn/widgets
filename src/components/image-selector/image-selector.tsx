import { Component, Host, h } from "@stencil/core";

@Component({
  tag: "image-selector",
  styleUrl: "image-selector.css",
  shadow: true,
})
export class ImageSelector {
  render() {
    return (
      <Host>
        <input type="file" accept="image/png, image/jpeg, image/webp" />
      </Host>
    );
  }
}
