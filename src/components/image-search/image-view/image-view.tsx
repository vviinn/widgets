import { Component, Host, h, Listen, State } from "@stencil/core";
import { fromFile } from "../../../Image/fromFile";
import { fromAlt, Rectangle, divideOnSized } from "../../../geometry/Rectangle";
import { ObjectsDetectedEvent } from "../../../searchSession/searchSession";
import * as Arr from "fp-ts/Array";
import * as O from "fp-ts/Option";
import { getLink, IonLink } from "../../../network/ionClient";
import * as Ord from "fp-ts/Ord";
type Mode = "objects" | "crop";

type DetectedObjectWithLink = [Rectangle, O.Option<IonLink>];

const ordDetectedObjects: Ord.Ord<DetectedObjectWithLink> = Ord.contramap<
  number,
  DetectedObjectWithLink
>((s) => s[0].width * s[0].height)(Ord.ordNumber);

@Component({
  tag: "image-view",
  styleUrl: "image-view.css",
  shadow: true,
})
export class ImageView {
  private imageContainer: HTMLImageElement | undefined;
  private image: HTMLImageElement | undefined;
  private detectedObjects: DetectedObjectWithLink[] = [];
  private cropView: Rectangle;

  @State() selections: DetectedObjectWithLink[] = [];
  @State() mode: Mode = "objects";

  @Listen("toggleCropping", { target: "document" })
  async handleTogglingCropper({ detail }: CustomEvent<boolean>) {
    this.selections = detail ? [[this.cropView, O.none]] : this.detectedObjects;
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
  async handleObjectsDetected({ detail }: ObjectsDetectedEvent) {
    this.detectedObjects = detail.map((x) => [
      fromAlt(x.value.rectangle),
      getLink(x, "rectangle"),
    ]);

    if (this.mode === "objects") {
      this.selections = this.detectedObjects;
    }
  }

  @Listen("cropperMoved", { target: "document" })
  handleCropping({ detail }: CustomEvent<Rectangle>) {
    this.cropView = divideOnSized(this.image)(detail);
    this.selections = [[this.cropView, O.none]];
  }

  render() {
    return (
      <Host>
        {Arr.sort(ordDetectedObjects)(this.selections)
          .reverse()
          .map((s, i) => (
            <highlight-box
              image={this.image}
              selection={s[0]}
              link={s[1]}
              index={i + 1}
            />
          ))}
        <img ref={(el) => (this.imageContainer = el)} />
      </Host>
    );
  }
}
