import {
  Component,
  Host,
  h,
  Listen,
  State,
  Element,
  Prop,
} from "@stencil/core";
import { HandlerDirection } from "../../../../cropper/Handler";
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
import { findTarget } from "../../../../dom";

@Component({
  tag: "image-cropper",
  styleUrl: "image-cropper.css",
  shadow: true,
})
export class ImageCropper {
  @Element() el: HTMLElement;

  @Prop() disabled: boolean = false;

  @State() handleMove: boolean = false;

  private handlerMoveDirection: HandlerDirection | null;
  private mouseStartPoint: Point | undefined = undefined;
  private bounds: DOMRect;
  private pointerMoveListener: EventListener;
  private pointerReleaseListener: EventListener;

  @Listen("detectedObjectSelected", { target: "document" })
  handleObjectSelection({ detail }: CustomEvent<ValueObject<DetectedObject>>) {
    const scale = scaleWithSized(this.bounds);
    const rect = fromAlt(foldValueObject(detail).rectangle);

    imageSearchState.searchArea = O.some(scale(rect));
  }

  private handleHandlerMove(event: PointerEvent) {
    if (!imageSearchState.searchArea) return;

    const destination = fromMouseEvent(event);
    const distance = pointDiffSemigroup.concat(
      destination,
      this.mouseStartPoint
    );

    const transformedHandler = {
      position: distance,
      direction: this.handlerMoveDirection,
    };

    pipe(
      imageSearchState.searchArea,
      O.map((area) => {
        const newSearchArea = transform(area, transformedHandler);

        if (!this.checkBounds(newSearchArea)) {
          return;
        }

        requestAnimationFrame(() => {
          imageSearchState.searchArea = O.some(newSearchArea);
          this.mouseStartPoint = destination;
        });

        imageSearchState.detectedObject = undefined;
      })
    )
  }

  private handleCropperMove(ev: MouseEvent) {
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

        imageSearchState.detectedObject = undefined;

        requestAnimationFrame(() => {
          imageSearchState.searchArea = O.some(newSearchArea);
          this.mouseStartPoint = destination;
        });
      })
    )
  }

  private handlePointerDown(event: PointerEvent) {
    this.mouseStartPoint = fromMouseEvent(event);

    // should be htmlelement or handler
    const target = findTarget(event) as any;

    if (target.localName === "cropper-handler") {
      this.handlerMoveDirection = target.handler.direction;
      this.pointerMoveListener = this.handleHandlerMove.bind(this);
    } else {
      this.pointerMoveListener = this.handleCropperMove.bind(this);
    }

    this.pointerReleaseListener = this.handleSearchAreaRelease.bind(this);

    this.el.addEventListener("pointermove", this.pointerMoveListener);
    window.addEventListener("pointerup", this.pointerReleaseListener, { once: true });

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
    this.el.removeEventListener("pointermove", this.pointerMoveListener);
    document.removeEventListener("pointerup", this.pointerReleaseListener);
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
        <div onContextMenu={() => false}
          class={{
            "crop-area": true,
            active: this.handleMove,
            disabled: this.disabled,
          }}
          draggable={false}
          style={this.getStyleMap()}
          onPointerDown={(ev) => this.handlePointerDown(ev)}
        >
          {imageSearchState.cropperHandlers.map((handler) => (
            <cropper-handler
              disabled={this.disabled}
              handler={handler}
              bounds={this.bounds}
            ></cropper-handler>
          ))}

        </div>
      </Host>
    );
  }
}
