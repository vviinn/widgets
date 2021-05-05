import {
  Component,
  Host,
  h,
  Listen,
  State,
  Event,
  EventEmitter,
  Prop,
} from "@stencil/core";
import { fromFile } from "../../../Image/fromFile";
import {
  Rectangle,
  divideOnSized,
  fromAlt,
  center,
  scaleWithSized,
} from "../../../geometry/Rectangle";
import {
  DetectedObject,
  ObjectsDetectedEvent,
} from "../../../searchSession/searchSession";
import { ValueObject, foldValueObject } from "../../../network/ion/ValueObject";

@Component({
  tag: "image-view",
  styleUrl: "image-view.css",
  shadow: true,
})
export class ImageView {
  @Prop() loading: boolean = false;

  @State() cropArea: Rectangle;
  @State() imageContainer: HTMLImageElement | undefined;
  @State() detectedObjects: ValueObject<DetectedObject>[] = [];

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

  private renderDetectedObject(object: ValueObject<DetectedObject>): HTMLElement {
    return (
      <detected-object-view
        style={{ opacity: this.loading ? "0.5" : "1" }}
        detectedObject={object}
        referenceImage={this.imageContainer}
        onDetectedObjectSelected={({
          detail,
        }: CustomEvent<ValueObject<DetectedObject>>) => {
          this.cropArea = fromAlt(foldValueObject(detail).rectangle);
        }}
      />
    );
  }

  private renderLoader(): HTMLElement {
    const scale = scaleWithSized(this.imageContainer);
    const { x, y } = center(scale(this.cropArea));

    return (
      <div class="loader" style={{ top: `${y}px`, left: `${x}px` }}>
        <svg
          aria-hidden="true"
          focusable="false"
          role="img"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 512 512"
        >
          <path d="M304 48c0 26.51-21.49 48-48 48s-48-21.49-48-48 21.49-48 48-48 48 21.49 48 48zm-48 368c-26.51 0-48 21.49-48 48s21.49 48 48 48 48-21.49 48-48-21.49-48-48-48zm208-208c-26.51 0-48 21.49-48 48s21.49 48 48 48 48-21.49 48-48-21.49-48-48-48zM96 256c0-26.51-21.49-48-48-48S0 229.49 0 256s21.49 48 48 48 48-21.49 48-48zm12.922 99.078c-26.51 0-48 21.49-48 48s21.49 48 48 48 48-21.49 48-48c0-26.509-21.491-48-48-48zm294.156 0c-26.51 0-48 21.49-48 48s21.49 48 48 48 48-21.49 48-48c0-26.509-21.49-48-48-48zM108.922 60.922c-26.51 0-48 21.49-48 48s21.49 48 48 48 48-21.49 48-48-21.491-48-48-48z" />
        </svg>
      </div>
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
          disabled={this.loading}
          onCropperMoved={({ detail }: CustomEvent<Rectangle>) =>
            this.handleCropperMove(detail)
          }
        />
        {this.detectedObjects.map((o) => this.renderDetectedObject(o))}
        {this.loading ? this.renderLoader() : null}
      </Host>
    );
  }
}
