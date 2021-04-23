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
import { fromRectangle, Handler } from "../../../cropper/Handler";
import { Rectangle, move, transform } from "../../../geometry/Rectangle";
import {
  Point,
  fromMouseEvent,
  pointDiffSemigroup,
} from "../../../geometry/Point";
import { fromFile } from "../../../Image/fromFile";

@Component({
  tag: "image-cropper",
  styleUrl: "image-cropper.css",
  shadow: true,
})
export class ImageCropper {
  @Element() el: HTMLElement;

  @State() cropArea: Rectangle = {
    x: 100,
    y: 100,
    width: 25,
    height: 25,
  };

  @State() handlers: Handler[] = fromRectangle(this.cropArea);
  @State() handleMove: boolean = false;

  private mouseStartPoint: Point | undefined = undefined;
  private bounds: DOMRect;

  @Event() mouseRelease: EventEmitter<void>;
  @Event() cropperMoved: EventEmitter<Rectangle>;

  @Listen("imageSelected", { target: "document" })
  async handleImageSelect({ detail }: CustomEvent<File>) {
    const image = await fromFile(detail);
    image.onload = () => {
      this.cropArea = {
        x: image.width * 0.25,
        y: image.height * 0.25,
        width: image.width * 0.5,
        height: image.height * 0.5
      };
      this.handlers = fromRectangle(this.cropArea);
      this.cropperMoved.emit(this.cropArea);
    }
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

  componentDidLoad() {
    this.bounds = this.el.getBoundingClientRect();
    const { width, height } = this.bounds;
    this.cropArea = {
      x: 20,
      y: 20,
      width: width * 0.5,
      height: height * 0.5,
    };

    this.handlers = fromRectangle(this.cropArea);
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
    const inTopBound = rectangle.y > 0;
    const inLeftBound = rectangle.x > 0;
    const inRightBound = rectangle.x + rectangle.width < bounds.width;
    const inBottomBound =
      rectangle.y + rectangle.height < bounds.height;

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
