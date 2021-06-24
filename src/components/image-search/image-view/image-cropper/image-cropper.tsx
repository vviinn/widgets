import {
  Component,
  Host,
  h,
  Listen,
  State,
  Event,
  EventEmitter,
  Element,
  Prop,
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
import {
  ValueObject,
  foldValueObject,
} from "../../../../network/ion/ValueObject";
import { DetectedObject } from "../../../../searchSession/searchSession";
import { imageSearchState, makeRectangularSearchRequest } from "../../../../store/imageSearch.store";

@Component({
  tag: "image-cropper",
  styleUrl: "image-cropper.css",
  shadow: true,
})
export class ImageCropper {
  @Element() el: HTMLElement;

  @Prop() disabled: boolean = false;

  @State() handlers: Handler[] = fromRectangle(imageSearchState.searchArea);
  @State() handleMove: boolean = false;

  private mouseStartPoint: Point | undefined = undefined;
  private bounds: DOMRect;

  @Event() mouseRelease: EventEmitter<void>;
  @Event() cropperMoved: EventEmitter<Rectangle>;
  @Event() searchAreaChangeStart: EventEmitter<boolean>;

  @Listen("detectedObjectSelected", { target: "document" })
  handleObjectSelection({ detail }: CustomEvent<ValueObject<DetectedObject>>) {
    const scale = scaleWithSized(this.bounds);
    const rect = fromAlt(foldValueObject(detail).rectangle);

    imageSearchState.searchArea = scale(rect);
    this.handlers = fromRectangle(imageSearchState.searchArea);
  }

  handleHandlerMove(event: CustomEvent<Handler>) {
    const newSearchArea = transform(imageSearchState.searchArea, event.detail);

    if (!this.checkBounds(newSearchArea)) {
      return;
    }

    imageSearchState.searchArea = newSearchArea;
    this.handlers = fromRectangle(imageSearchState.searchArea);
  }

  @Listen("pointermove")
  handleMouseMove(ev: MouseEvent) {
    if (!this.handleMove) return;

    const destination = fromMouseEvent(ev);
    const distance = pointDiffSemigroup.concat(
      destination,
      this.mouseStartPoint
    );

    const newSearchArea = move(imageSearchState.searchArea, distance);

    if (!this.checkBounds(newSearchArea)) {
      return;
    }

    imageSearchState.searchArea = newSearchArea;
    this.handlers = fromRectangle(imageSearchState.searchArea);
    this.mouseStartPoint = destination;
  }

  private handlePointerDown(event: MouseEvent) {
    this.handleMove = true;
    this.mouseStartPoint = fromMouseEvent(event);
  }

  private checkBounds(rectangle: Rectangle): boolean {
    const bounds = this.el.getBoundingClientRect();
    const inTopBound = rectangle.y >= 0;
    const inLeftBound = rectangle.x >= 0;
    const inRightBound = rectangle.x + rectangle.width <= bounds.width;
    const inBottomBound = rectangle.y + rectangle.height <= bounds.height;
    const minWidth = rectangle.width > 20;
    const minHeight = rectangle.height > 20;

    return (
      inTopBound &&
      inLeftBound &&
      inRightBound &&
      inBottomBound &&
      minHeight &&
      minWidth
    );
  }

  private handleSearchAreaRelease() {
    this.handleMove = false;
    this.mouseStartPoint = undefined;

    makeRectangularSearchRequest();
  }

  render() {
    return (
      <Host exportparts="handle, e-resize, n-resize, ne-resize, nw-resize, s-resize, se-resize, sw-resize, w-resize">
        <div
          class={{
            "crop-area": true,
            active: this.handleMove,
            disabled: this.disabled,
          }}
          style={{
            width: `${imageSearchState.searchArea.width}px`,
            height: `${imageSearchState.searchArea.height}px`,
            transform: `translate(${imageSearchState.searchArea.x}px, ${imageSearchState.searchArea.y}px)`,
            cursor: this.handleMove ? "move" : "default",
          }}
          onPointerDown={(ev) => this.handlePointerDown(ev)}
          onPointerUp={(ev) => { ev.stopPropagation(); this.handleSearchAreaRelease() }}
        ></div>
        <div class="wrapper">
          {this.handlers.map((handler) => (
            <cropper-handler
              disabled={this.disabled}
              handler={handler}
              bounds={this.bounds}
              onHandlerMoved={(e) => this.handleHandlerMove(e)}
              onHandlerReleased={() => this.handleSearchAreaRelease()}
            ></cropper-handler>
          ))}
        </div>
      </Host>
    );
  }
}
