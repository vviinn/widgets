import { Component, Host, h, Listen } from "@stencil/core";
import { fromFile } from "../../../Image/fromFile";
import { Rectangle } from "../../../geometry/Rectangle";

@Component({
  tag: "image-view",
  styleUrl: "image-view.css",
  shadow: false,
})
export class ImageView {
  private imageContainer: HTMLImageElement | undefined;
  private image: HTMLImageElement | undefined;

  selections: Rectangle[] = [
    {
      position: { x: 10, y: 10 },
      width: 100,
      height: 50,
    },
  ];

  @Listen("imageSelected", { target: "document" })
  async handleImageSelect({ detail }: CustomEvent<File>) {
    this.image = await fromFile(detail);
    this.imageContainer.src = this.image.src;
  }

  render() {
    return (
      <Host>
        {this.selections.map((s) => (
          <selection-box selection={s} />
        ))}
        <img ref={(el) => (this.imageContainer = el)} />
      </Host>
    );
  }
}
