import {
  Component,
  Host,
  h,
  Prop,
  Listen,
  Event,
  EventEmitter,
} from "@stencil/core";
import { Handler, getCursorValue } from "../../../../cropper/Handler";
import {
  Point,
  fromMouseEvent,
  pointDiffSemigroup,
} from "../../../../geometry/Point";

@Component({
  tag: "cropper-handler",
  styleUrl: "cropper-handler.css",
  shadow: true,
})
export class CropperHandler {
  private handleMove: boolean = false;
  private mouseStartPoint: Point | undefined = undefined;

  @Prop() handler: Handler;
  @Prop() bounds: DOMRect;

  @Event() handlerMoved: EventEmitter<Handler>;

  @Listen("mousedown")
  handleMouseDown(event: MouseEvent) {
    this.handleMove = true;
    this.mouseStartPoint = fromMouseEvent(event);
  }

  @Listen("mouseup", { target: "window" })
  handleMouseUp() {
    this.handleMove = false;
    this.mouseStartPoint = undefined;
  }

  @Listen("mousemove", { target: "window" })
  handleMouseMove(event: MouseEvent) {
    if (!this.handleMove) return;

    // const x = event.clientX;
    // const y = event.clientY;
    // const leftBound = this.bounds?.x ?? Infinity;
    // const topBound = this.bounds?.y ?? Infinity;
    // const width = this.bounds?.width ?? -Infinity;
    // const height = this.bounds?.height ?? -Infinity;

    // const inXbounds = x > leftBound && x < (leftBound + width);
    // const inYbounds = y < topBound && y > (topBound - height);

    const destination = fromMouseEvent(event);

    const distance = pointDiffSemigroup.concat(
      destination,
      this.mouseStartPoint
    );

    this.handlerMoved.emit({
      position: distance,
      direction: this.handler.direction,
    });

    this.mouseStartPoint = destination;
  }

  render() {
    return (
      <Host
        style={{
          cursor: getCursorValue(this.handler.direction),
          transform: `translate(${this.handler.position.x}px, ${this.handler.position.y}px)`,
        }}
      ></Host>
    );
  }
}
