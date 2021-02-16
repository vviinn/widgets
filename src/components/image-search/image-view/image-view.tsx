import { Component, Host, h, Listen } from "@stencil/core";
import { fromFile } from "../../../Image/fromFile";

@Component({
  tag: "image-view",
  styleUrl: "image-view.css",
  shadow: false,
})
export class ImageView {
  private imageContainer: HTMLImageElement | undefined;

  @Listen("imageSelected", { target: "document" })
  async handleImageSelect({ detail }: CustomEvent<File>) {
    const image = await fromFile(detail);
    this.imageContainer.src = image.src;
  }

  render() {
    return (
      <Host>
        <img ref={(el) => (this.imageContainer = el)} />
      </Host>
    );
  }
}
