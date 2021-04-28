import {
  Component,
  Host,
  h,
  Listen,
  State,
  Event,
  EventEmitter,
  Method,
  Element,
} from "@stencil/core";
import { fromRectangle, Handler } from "../../../../cropper/Handler";
import {
  Rectangle,
  move,
  transform,
  fromAlt,
  scaleWithSized,
} from "../../../../geometry/Rectangle";
import {
  Point,
  fromMouseEvent,
  pointDiffSemigroup,
} from "../../../../geometry/Point";
import { IonItem, foldIonItem } from "../../../../network/ionClient";
import { DetectedObject } from "../../../../searchSession/searchSession";

@Component({
  tag: "image-cropper",
  styleUrl: "image-cropper.css",
  shadow: true,
})
export class ImageCropper {
  @Element() el: HTMLElement;

  @State() cropArea: Rectangle = {
    x: 0,
    y: 0,
    width: 0,
    height: 0,
  };

  @State() handlers: Handler[] = fromRectangle(this.cropArea);
  @State() handleMove: boolean = false;

  private mouseStartPoint: Point | undefined = undefined;
  private bounds: DOMRect;

  @Event() mouseRelease: EventEmitter<void>;
  @Event() cropperMoved: EventEmitter<Rectangle>;

  @Listen("detectedObjectSelected", { target: "document" })
  handleObjectSelection({ detail }: CustomEvent<IonItem<DetectedObject>>) {
    const scale = scaleWithSized(this.bounds);
    const rect = fromAlt(foldIonItem(detail).rectangle);

    this.cropArea = scale(rect);
    this.handlers = fromRectangle(this.cropArea);
  }

  @Listen("imageSelected", { target: "document" })
  handleImageSelect() {
    this.setInitialSize();
  }

  @Listen("resetSearchArea", { target: "document" })
  handleResetting() {
    this.setInitialSize();
  }

  @Listen("handlerMoved")
  handleHandlerMove(event: CustomEvent<Handler>) {
    const newCropArea = transform(this.cropArea, event.detail);

    if (!this.checkBounds(newCropArea)) {
      return;
    }

    this.cropArea = newCropArea;
    this.handlers = fromRectangle(this.cropArea);
    this.cropperMoved.emit(this.cropArea);
  }

  @Listen("mousemove")
  handleMouseMove(ev: MouseEvent) {
    if (!this.handleMove) return;

    const destination = fromMouseEvent(ev);
    const distance = pointDiffSemigroup.concat(
      destination,
      this.mouseStartPoint
    );

    const newCropArea = move(this.cropArea, distance);

    if (!this.checkBounds(newCropArea)) {
      return;
    }

    this.cropArea = newCropArea;
    this.handlers = fromRectangle(this.cropArea);
    this.mouseStartPoint = destination;
    this.cropperMoved.emit(this.cropArea);
  }

  connectedCallback() {
    const resizeObserver = new ResizeObserver(() => this.setInitialSize());
    resizeObserver.observe(this.el);
  }

  private setInitialSize() {
    this.bounds = this.el.getBoundingClientRect();

    const { width, height } = this.bounds;
    this.cropArea = {
      x: 0,
      y: 0,
      width: width,
      height: height,
    };
    this.handlers = fromRectangle(this.cropArea);
    this.cropperMoved.emit(this.cropArea);
  }

  @Method()
  async getSelection(): Promise<Rectangle> {
    return this.cropArea;
  }

  private handleMouseUp() {
    this.handleMove = false;
    this.mouseStartPoint = undefined;
    this.mouseRelease.emit();
  }

  private handleMouseDown(event: MouseEvent) {
    this.handleMove = true;
    this.mouseStartPoint = fromMouseEvent(event);
  }

  private checkBounds(rectangle: Rectangle): boolean {
    const bounds = this.el.getBoundingClientRect();
    const inTopBound = rectangle.y >= 0;
    const inLeftBound = rectangle.x >= 0;
    const inRightBound = rectangle.x + rectangle.width <= bounds.width;
    const inBottomBound = rectangle.y + rectangle.height <= bounds.height;

    return inTopBound && inLeftBound && inRightBound && inBottomBound;
  }

  render() {
    return (
      <Host>
        <div
          class="crop-area"
          style={{
            width: `${this.cropArea.width}px`,
            height: `${this.cropArea.height}px`,
            transform: `translate(${this.cropArea.x}px, ${this.cropArea.y}px)`,
            cursor: this.handleMove ? "move" : "default",
          }}
          onMouseDown={(ev) => this.handleMouseDown(ev)}
          onMouseUp={() => this.handleMouseUp()}
        ></div>
        <div class="wrapper">
          {this.handlers.map((handler) => (
            <cropper-handler
              handler={handler}
              bounds={this.bounds}
            ></cropper-handler>
          ))}
        </div>
      </Host>
    );
  }
}
