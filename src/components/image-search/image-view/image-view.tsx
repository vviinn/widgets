import {
  Component,
  Host,
  h,
  Listen,
  State,
  Event,
  EventEmitter,
} from "@stencil/core";
import { fromFile } from "../../../Image/fromFile";
import { fromAlt, Rectangle, divideOnSized } from "../../../geometry/Rectangle";
import {
  DetectedObject,
  ObjectsDetectedEvent,
} from "../../../searchSession/searchSession";
import * as Arr from "fp-ts/Array";
import * as O from "fp-ts/Option";
import { getLink, IonLink, IonItem } from "../../../network/ionClient";
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
  //private detectedObjects: DetectedObjectWithLink[] = [];
  //private cropView: Rectangle;

  @State() selections: DetectedObjectWithLink[] = [];
  @State() mode: Mode = "objects";
  @State() showCropper: boolean = false;

  @State() detectedObjects: IonItem<DetectedObject>[] = [];

  @Event() cropAreaChanged: EventEmitter<Rectangle>;

  /* @Listen("toggleCropping", { target: "document" })
   * async handleTogglingCropper({ detail }: CustomEvent<boolean>) {
   *   this.showCropper = detail;
   *   this.selections = detail ? [[this.cropView, O.none]] : this.detectedObjects;
   *   this.mode = detail ? "crop" : "objects";
   * }
   */
  @Listen("imageSelected", { target: "document" })
  async handleImageSelect({ detail }: CustomEvent<File>) {
    this.image = await fromFile(detail);
    this.imageContainer.src = this.image.src;

    this.detectedObjects = [];
    this.selections = [];
    //this.mode = "objects";
  }

  @Listen("objectsDetected", { target: "document" })
  async handleObjectsDetected({ detail }: ObjectsDetectedEvent) {
    this.detectedObjects = detail;
  }

  /* @Listen("cropperMoved", { target: "document" })
   * handleCropping({ detail }: CustomEvent<Rectangle>) {
   *   this.cropView = divideOnSized(this.imageContainer)(detail);
   *   this.cropAreaChanged.emit(this.cropView);
   *   this.selections = [[this.cropView, O.none]];
   * }
   */
  private renderDetectedObject(object: IonItem<DetectedObject>): HTMLElement {
    return (
      <detected-object-view
        detectedObject={object}
        referenceImage={this.imageContainer}
      />
    );
  }

  render() {
    return (
      <Host
        class={{
          dimmed: this.mode === "crop" || !Arr.isEmpty(this.detectedObjects),
        }}
      >
        {this.detectedObjects.map((o) => this.renderDetectedObject(o))}
        {Arr.sort(ordDetectedObjects)(this.selections)
          .reverse()
          .map((s, i) => (
            <highlight-box
              image={this.imageContainer}
              selection={s[0]}
              link={s[1]}
              index={i + 1}
            />
          ))}
        <img ref={(el) => (this.imageContainer = el)} />
        <image-cropper
          style={{
            width: `${this.imageContainer?.width}px`,
            height: `${this.imageContainer?.height}px`,
          }}
          class={{ hidden: !this.showCropper }}
        />
      </Host>
    );
  }
}
