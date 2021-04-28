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
import { Rectangle, divideOnSized } from "../../../geometry/Rectangle";
import {
  DetectedObject,
  ObjectsDetectedEvent,
} from "../../../searchSession/searchSession";
import { IonItem } from "../../../network/ionClient";

@Component({
  tag: "image-view",
  styleUrl: "image-view.css",
  shadow: true,
})
export class ImageView {
  private image: HTMLImageElement | undefined;

  @State() cropArea: Rectangle;
  @State() imageContainer: HTMLImageElement | undefined;
  @State() detectedObjects: IonItem<DetectedObject>[] = [];
  @Event() cropAreaChanged: EventEmitter<Rectangle>;

  @Listen("imageSelected", { target: "document" })
  async handleImageSelect({ detail }: CustomEvent<File>) {
    this.image = await fromFile(detail);
    this.imageContainer.src = this.image.src;

    this.detectedObjects = [];
  }

  @Listen("objectsDetected", { target: "document" })
  async handleObjectsDetected({ detail }: ObjectsDetectedEvent) {
    this.detectedObjects = detail;
  }

  @Listen("cropperMoved", { target: "document" })
  handleCropping({ detail }: CustomEvent<Rectangle>) {
    this.cropArea = divideOnSized(this.imageContainer)(detail);
    this.cropAreaChanged.emit(this.cropArea);
  }

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
        />
        {this.detectedObjects.map((o) => this.renderDetectedObject(o))}
      </Host>
    );
  }
}
