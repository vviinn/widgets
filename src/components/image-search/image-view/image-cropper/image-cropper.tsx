import {
  Component,
  Host,
  h,
  State,
  Element,
  Prop,
  Event,
  EventEmitter,
} from "@stencil/core";
import { HandlerDirection } from "../../../../cropper/Handler";
import { move, Rectangle, transform } from "../../../../geometry/Rectangle";
import {
  Point,
  fromMouseEvent,
  pointDiffSemigroup,
} from "../../../../geometry/Point";
import {
  imageSearchState,
  makeRectangularSearchRequest,
} from "../../../../store/imageSearch.store";
import { pipe } from "fp-ts/lib/function";
import * as O from "fp-ts/lib/Option";
import { findTarget } from "../../../../dom";

const MIN_SEARCHAREA_SIZE = 40;

@Component({
  tag: "image-cropper",
  styleUrl: "image-cropper.css",
  shadow: true,
})
export class ImageCropper {
  @Element() el: HTMLElement;

  @Prop() disabled: boolean = false;

  @State() handleMove: boolean = false;

  @Event() cropperChanged: EventEmitter;

  private handlerMoveDirection: HandlerDirection | null;
  private mouseStartPoint: Point | undefined = undefined;
  private pointerMoveListener: EventListener;
  private pointerReleaseListener: EventListener;
  private bounds: DOMRect | undefined = undefined;
  private resizeObserver = new ResizeObserver(() => {
    this.bounds = this.el.getBoundingClientRect();
  });

  componentDidLoad() {
    this.resizeObserver.observe(this.el);
  }

  disconnectedCallback() {
    this.resizeObserver.disconnect();
  }

  private handleHandlerMove(event: PointerEvent) {
    event.preventDefault();
    event.stopPropagation();

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

        if (this.outOfBounds(newSearchArea)) return;

        imageSearchState.searchArea = O.some(newSearchArea);
        this.mouseStartPoint = destination;
        imageSearchState.detectedObject = undefined;
      })
    );
  }

  private outOfBounds(area: Rectangle): boolean {
    return (
      area.width < MIN_SEARCHAREA_SIZE ||
      area.height < MIN_SEARCHAREA_SIZE ||
      area.x < 0 ||
      area.y < 0 ||
      this.bounds.height - (area.y + area.height) < 0 ||
      this.bounds.width - (area.x + area.width) < 0
    );
  }

  private handleCropperMove(ev: MouseEvent) {
    ev.preventDefault();
    ev.stopPropagation();
    const destination = fromMouseEvent(ev);

    const distance = pointDiffSemigroup.concat(
      destination,
      this.mouseStartPoint
    );

    pipe(
      imageSearchState.searchArea,
      O.map((searchArea) => {
        const newSearchArea = move(searchArea, distance);

        if (
          newSearchArea.x < 0 ||
          newSearchArea.y < 0 ||
          this.bounds.height - (newSearchArea.y + newSearchArea.height) < 0 ||
          this.bounds.width - (newSearchArea.x + newSearchArea.width) < 0
        )
          return;

        imageSearchState.detectedObject = undefined;
        imageSearchState.searchArea = O.some(newSearchArea);
        this.mouseStartPoint = destination;
      })
    );
  }

  private handlePointerDown(event: PointerEvent) {
    event.stopPropagation();
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
    window.addEventListener("pointerup", this.pointerReleaseListener, {
      once: true,
    });
  }

  private handleSearchAreaRelease() {
    this.el.removeEventListener("pointermove", this.pointerMoveListener);
    document.removeEventListener("pointerup", this.pointerReleaseListener);
    this.mouseStartPoint = undefined;
    makeRectangularSearchRequest();
    this.cropperChanged.emit();
  }

  private getStyleMap() {
    return pipe(
      imageSearchState.searchArea,
      O.map((rectangle) => {
        return {
          width: `${rectangle.width}px`,
          height: `${rectangle.height}px`,
          transform: `translate3d(${rectangle.x}px, ${rectangle.y}px, 0)`,
          cursor: this.handleMove ? "move" : "default",
        };
      }),
      O.getOrElse(() => {
        return {};
      })
    );
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
          draggable={false}
          style={this.getStyleMap()}
          onContextMenu={() => false}
          onPointerDown={(ev) => this.handlePointerDown(ev)}
        >
          {imageSearchState.cropperHandlers.map((handler) => (
            <cropper-handler
              disabled={this.disabled}
              handler={handler}
              onPointerDown={(ev) => this.handlePointerDown(ev)}
            ></cropper-handler>
          ))}
        </div>
      </Host>
    );
  }
}
