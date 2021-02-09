import {
  Component,
  Host,
  h,
  Listen,
  State,
  Event,
  EventEmitter,
} from "@stencil/core";
import { fromRectangle, Handler } from "../../cropper/Handler";
import { Rectangle, move, transform } from "../../geometry/Rectangle";
import {
  Point,
  fromMouseEvent,
  pointDiffSemigroup,
} from "../../geometry/Point";

@Component({
  tag: "image-cropper",
  styleUrl: "image-cropper.css",
  shadow: true,
})
export class ImageCropper {
  @State() cropArea: Rectangle = {
    position: { x: 100, y: 100 },
    width: 150,
    height: 150,
  };

  @State() handlers: Handler[] = fromRectangle(this.cropArea);
  @State() handleMove: boolean = false;

  private mouseStartPoint: Point | undefined = undefined;

  @Event() mouseRelease: EventEmitter<void>;

  @Listen("handlerMoved")
  handleHandlerMove(event: CustomEvent<Handler>) {
    this.cropArea = transform(this.cropArea, event.detail);
    this.handlers = fromRectangle(this.cropArea);
  }

  @Listen("mousemove")
  handleMouseMove(ev: MouseEvent) {
    if (!this.handleMove) return;

    const destination = fromMouseEvent(ev);
    const distance = pointDiffSemigroup.concat(
      destination,
      this.mouseStartPoint
    );

    this.cropArea = move(this.cropArea, distance);
    this.handlers = fromRectangle(this.cropArea);
    this.mouseStartPoint = destination;
  }

  handleMouseUp() {
    this.handleMove = false;
    this.mouseStartPoint = undefined;
    this.mouseRelease.emit();
  }

  private handleMouseDown(event: MouseEvent) {
    this.handleMove = true;
    this.mouseStartPoint = fromMouseEvent(event);
  }

  render() {
    return (
      <Host>
        <div
          class="crop-area"
          style={{
            width: `${this.cropArea.width}px`,
            height: `${this.cropArea.height}px`,
            transform: `translate(${this.cropArea.position.x}px, ${this.cropArea.position.y}px)`,
            cursor: this.handleMove ? "move" : "default",
          }}
          onMouseDown={(ev) => this.handleMouseDown(ev)}
          onMouseUp={() => this.handleMouseUp()}
        ></div>
        <div class="wrapper">
          {this.handlers.map((handler) => (
            <cropper-handler handler={handler}></cropper-handler>
          ))}
        </div>
      </Host>
    );
  }
}
