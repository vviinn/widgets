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
import { Handler } from "../../../../cropper/Handler";
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
import { pipe } from "fp-ts/lib/function";
import * as O from "fp-ts/lib/Option";

@Component({
  tag: "image-cropper",
  styleUrl: "image-cropper.css",
  shadow: true,
})
export class ImageCropper {
  @Element() el: HTMLElement;

  @Prop() disabled: boolean = false;
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

    imageSearchState.searchArea = O.some(scale(rect));
  }

  handleHandlerMove(event: CustomEvent<Handler>) {
    pipe(
      imageSearchState.searchArea,
      O.map((area) => {
        const newSearchArea = transform(area, event.detail);

        if (!this.checkBounds(newSearchArea)) {
          return;
        }

        requestAnimationFrame(() => {
          imageSearchState.searchArea = O.some(newSearchArea);
        });

        imageSearchState.detectedObject = undefined;
      })
    )
  }

  @Listen("pointermove")
  handleMouseMove(ev: MouseEvent) {
    if (!this.handleMove) return;

    const destination = fromMouseEvent(ev);
    const distance = pointDiffSemigroup.concat(
      destination,
      this.mouseStartPoint
    );

    pipe(
      imageSearchState.searchArea,
      O.map((searchArea) => {
        const newSearchArea = move(searchArea, distance);

        if (!this.checkBounds(newSearchArea)) {
          return;
        }

        imageSearchState.searchArea = O.some(newSearchArea);
        imageSearchState.detectedObject = undefined;
        this.mouseStartPoint = destination;
      })
    )
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

  private getStyleMap() {
    return pipe(
      imageSearchState.searchArea,
      O.map((rectangle) => {
        return {
          width: `${rectangle.width}px`,
          height: `${rectangle.height}px`,
          transform: `translate(${rectangle.x}px, ${rectangle.y}px)`,
          cursor: this.handleMove ? "move" : "default",
        }
      }),
      O.getOrElse(() => {
        return {}
      })
    )
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
          style={this.getStyleMap()}
          onPointerDown={(ev) => this.handlePointerDown(ev)}
          onPointerUp={(ev) => { ev.stopPropagation(); this.handleSearchAreaRelease() }}
        ></div>
        <div class="wrapper">
          {imageSearchState.cropperHandlers.map((handler) => (
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
