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
import { Rectangle, divideOnSized, fromAlt } from "../../../geometry/Rectangle";
import {
  DetectedObject,
  ObjectsDetectedEvent,
} from "../../../searchSession/searchSession";
import { IonItem, foldIonItem } from "../../../network/ionClient";

@Component({
  tag: "image-view",
  styleUrl: "image-view.css",
  shadow: true,
})
export class ImageView {
  @State() cropArea: Rectangle;
  @State() imageContainer: HTMLImageElement | undefined;
  @State() detectedObjects: IonItem<DetectedObject>[] = [];

  @Event() cropAreaChanged: EventEmitter<Rectangle>;
  @Event() detectedObjectSelected: EventEmitter<Rectangle>;

  @Listen("imageSelected", { target: "document" })
  async handleImageSelect({ detail }: CustomEvent<File>) {
    const image = await fromFile(detail);
    this.imageContainer.src = image.src;
    this.detectedObjects = [];
  }

  @Listen("objectsDetected", { target: "document" })
  async handleObjectsDetected({ detail }: ObjectsDetectedEvent) {
    this.detectedObjects = detail;
  }

  handleCropperMove(rectangle: Rectangle) {
    this.cropArea = divideOnSized(this.imageContainer)(rectangle);
    this.cropAreaChanged.emit(this.cropArea);
  }

  private renderDetectedObject(object: IonItem<DetectedObject>): HTMLElement {
    return (
      <detected-object-view
        detectedObject={object}
        referenceImage={this.imageContainer}
        onDetectedObjectSelected={({
          detail,
        }: CustomEvent<IonItem<DetectedObject>>) => {
          this.cropArea = fromAlt(foldIonItem(detail).rectangle);
        }}
      />
    );
  }

  render() {
    return (
      <Host class="dimmed">
        <img ref={(el) => (this.imageContainer = el)} />
        {this.imageContainer ? (
          <highlight-box
            image={this.imageContainer}
            selection={this.cropArea}
          />
        ) : null}
        <image-cropper
          style={{
            width: `${this.imageContainer?.width}px`,
            height: `${this.imageContainer?.height}px`,
          }}
          onCropperMoved={({ detail }: CustomEvent<Rectangle>) =>
            this.handleCropperMove(detail)
          }
        />
        {this.detectedObjects.map((o) => this.renderDetectedObject(o))}
      </Host>
    );
  }
}
