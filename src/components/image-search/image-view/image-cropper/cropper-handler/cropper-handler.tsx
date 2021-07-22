import {
  Component,
  Host,
  h,
  Prop,
  Listen,
  Event,
  EventEmitter,
  State,
} from "@stencil/core";
import { Handler, getCursorValue } from "../../../../../cropper/Handler";
import {
  Point,
  fromMouseEvent,
  pointDiffSemigroup,
} from "../../../../../geometry/Point";

@Component({
  tag: "cropper-handler",
  styleUrl: "cropper-handler.css",
  shadow: true,
})
export class CropperHandler {
  private startPoint: Point | undefined;
  private id: number | undefined;

  @State() handleMove: boolean = false;

  @Prop() handler: Handler;
  @Prop() bounds: DOMRect;
  @Prop() disabled: boolean = false;

  @Event() handlerMoved: EventEmitter<Handler>;
  @Event() searchAreaChangeStart: EventEmitter<boolean>;
  @Event() handlerReleased: EventEmitter<void>;

  @Listen("pointerdown")
  handlePointerStart(event: PointerEvent) {
    event.preventDefault();
    event.stopPropagation();

    this.id = event.pointerId;
    this.handleMove = true;
    this.startPoint = fromMouseEvent(event);
    this.searchAreaChangeStart.emit(true);
  }

  @Listen("pointerup", { target: "window" })
  handlePointerEnd(event: PointerEvent) {
    event.stopPropagation();

    const { pointerId } = event;
    if (pointerId !== this.id) {
      return;
    }

    this.searchAreaChangeStart.emit(false);
    this.handlerReleased.emit();
    this.handleMove = false;
    this.startPoint = undefined;
  }

  @Listen("pointermove", { target: "window" })
  handlePointerMove(event: PointerEvent) {
    if (!this.handleMove) return;

    requestAnimationFrame(() => {
      const destination = fromMouseEvent(event);

      if (this.startPoint !== undefined) {
        const distance = pointDiffSemigroup.concat(destination, this.startPoint);

        this.handlerMoved.emit({
          position: distance,
          direction: this.handler.direction,
        });
      }

      this.startPoint = destination;
    });
  }

  render() {
    return (
      <Host part={`handle ${getCursorValue(this.handler.direction)}`}
        class={{
          active: this.handleMove,
          disabled: this.disabled,
          [getCursorValue(this.handler.direction)]: true,
        }}
        style={{
          "--x": `${this.handler.position.x}px`,
          "--y": `${this.handler.position.y}px`,
          "--size": "20px",
          cursor: getCursorValue(this.handler.direction),
        }}
      ></Host>
    );
  }
}
