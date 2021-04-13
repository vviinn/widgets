import { Component, Host, h, Listen, State } from "@stencil/core";
import { fromFile } from "../../../Image/fromFile";
import * as Rect from "../../../geometry/Rectangle";
import { DetectedObject } from "../../../searchSession/searchSession";
import * as RectAlt from "../../../geometry/RectangleAlt";
import { ClipShape, ordClipShape } from "../../../geometry/Clip";
import * as Arr from "fp-ts/Array";

type Mode = "objects" | "crop";

@Component({
  tag: "image-view",
  styleUrl: "image-view.css",
  shadow: true,
})
export class ImageView {
  private imageContainer: HTMLImageElement | undefined;
  private image: HTMLImageElement | undefined;
  private detectedObjects: RectAlt.RectangleAlt[] = [];
  private cropView: Rect.Rectangle;
  private mode: Mode = "objects";

  @State() selections: ClipShape[] = [];

  @Listen("toggleCropping", { target: "document" })
  async handleTogglingCropper({ detail }: CustomEvent<boolean>) {
    this.selections = detail
      ? [Rect.of(this.cropView)]
      : this.detectedObjects.map(RectAlt.of);

    this.mode = detail ? "crop" : "objects";
  }

  @Listen("imageSelected", { target: "document" })
  async handleImageSelect({ detail }: CustomEvent<File>) {
    this.image = await fromFile(detail);
    this.imageContainer.src = this.image.src;

    this.detectedObjects = [];
    this.selections = [];
    this.mode = "objects";
  }

  @Listen("objectsDetected", { target: "document" })
  async handleObjectsDetected({ detail }: CustomEvent<DetectedObject[]>) {
    this.detectedObjects = detail.map((x) => x.rectangle);

    if (this.mode === "objects") {
      this.selections = this.detectedObjects.map(RectAlt.of);
    }
  }

  @Listen("cropperMoved", { target: "document" })
  handleCropping({ detail }: CustomEvent<Rect.Rectangle>) {
    this.cropView = detail;
    this.selections = [Rect.of(this.cropView)];
  }

  render() {
    return (
      <Host exportparts="selection">
        {Arr.sort(ordClipShape)(this.selections)
          .reverse()
          .map((s, i) => (
            <highlight-box
              image={this.image}
              selection={s}
              style={{ "z-index": `${i + 1}` }}
            />
          ))}
        <img ref={(el) => (this.imageContainer = el)} />
      </Host>
    );
  }
}
