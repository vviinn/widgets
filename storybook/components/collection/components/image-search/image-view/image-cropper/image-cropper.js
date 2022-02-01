import { Component, Host, h, State, Element, Prop } from "@stencil/core";
import { move, transform } from "../../../../geometry/Rectangle";
import { fromMouseEvent, pointDiffSemigroup, } from "../../../../geometry/Point";
import { imageSearchState, makeRectangularSearchRequest, } from "../../../../store/imageSearch.store";
import { pipe } from "fp-ts/lib/function";
import * as O from "fp-ts/lib/Option";
import { findTarget } from "../../../../dom";
const MIN_SEARCHAREA_SIZE = 40;
export class ImageCropper {
  constructor() {
    this.disabled = false;
    this.handleMove = false;
    this.mouseStartPoint = undefined;
    this.bounds = undefined;
  }
  componentDidLoad() {
    this.bounds = this.el.getBoundingClientRect();
  }
  handleHandlerMove(event) {
    event.preventDefault();
    event.stopPropagation();
    const destination = fromMouseEvent(event);
    const distance = pointDiffSemigroup.concat(destination, this.mouseStartPoint);
    const transformedHandler = {
      position: distance,
      direction: this.handlerMoveDirection,
    };
    pipe(imageSearchState.searchArea, O.map((area) => {
      const newSearchArea = transform(area, transformedHandler);
      if (newSearchArea.width < MIN_SEARCHAREA_SIZE ||
        newSearchArea.height < MIN_SEARCHAREA_SIZE ||
        newSearchArea.x < 0 ||
        newSearchArea.y < 0 ||
        this.bounds.height - (newSearchArea.y + newSearchArea.height) < 0 ||
        this.bounds.width - (newSearchArea.x + newSearchArea.width) < 0)
        return;
      imageSearchState.searchArea = O.some(newSearchArea);
      this.mouseStartPoint = destination;
      imageSearchState.detectedObject = undefined;
    }));
  }
  handleCropperMove(ev) {
    ev.preventDefault();
    ev.stopPropagation();
    const destination = fromMouseEvent(ev);
    const distance = pointDiffSemigroup.concat(destination, this.mouseStartPoint);
    pipe(imageSearchState.searchArea, O.map((searchArea) => {
      const newSearchArea = move(searchArea, distance);
      if (newSearchArea.x < 0 ||
        newSearchArea.y < 0 ||
        this.bounds.height - (newSearchArea.y + newSearchArea.height) < 0 ||
        this.bounds.width - (newSearchArea.x + newSearchArea.width) < 0)
        return;
      imageSearchState.detectedObject = undefined;
      imageSearchState.searchArea = O.some(newSearchArea);
      this.mouseStartPoint = destination;
    }));
  }
  handlePointerDown(event) {
    event.stopPropagation();
    this.mouseStartPoint = fromMouseEvent(event);
    // should be htmlelement or handler
    const target = findTarget(event);
    if (target.localName === "cropper-handler") {
      this.handlerMoveDirection = target.handler.direction;
      this.pointerMoveListener = this.handleHandlerMove.bind(this);
    }
    else {
      this.pointerMoveListener = this.handleCropperMove.bind(this);
    }
    this.pointerReleaseListener = this.handleSearchAreaRelease.bind(this);
    this.el.addEventListener("pointermove", this.pointerMoveListener);
    window.addEventListener("pointerup", this.pointerReleaseListener, {
      once: true,
    });
  }
  handleSearchAreaRelease() {
    this.el.removeEventListener("pointermove", this.pointerMoveListener);
    document.removeEventListener("pointerup", this.pointerReleaseListener);
    this.mouseStartPoint = undefined;
    makeRectangularSearchRequest();
  }
  getStyleMap() {
    return pipe(imageSearchState.searchArea, O.map((rectangle) => {
      return {
        width: `${rectangle.width}px`,
        height: `${rectangle.height}px`,
        transform: `translate3d(${rectangle.x}px, ${rectangle.y}px, 0)`,
        cursor: this.handleMove ? "move" : "default",
      };
    }), O.getOrElse(() => {
      return {};
    }));
  }
  render() {
    return (h(Host, { exportparts: "handle, e-resize, n-resize, ne-resize, nw-resize, s-resize, se-resize, sw-resize, w-resize" },
      h("div", { class: {
          "crop-area": true,
          active: this.handleMove,
          disabled: this.disabled,
        }, draggable: false, style: this.getStyleMap(), onContextMenu: () => false, onPointerDown: (ev) => this.handlePointerDown(ev) }, imageSearchState.cropperHandlers.map((handler) => (h("cropper-handler", { disabled: this.disabled, handler: handler, onPointerDown: (ev) => this.handlePointerDown(ev) }))))));
  }
  static get is() { return "image-cropper"; }
  static get encapsulation() { return "shadow"; }
  static get originalStyleUrls() { return {
    "$": ["image-cropper.css"]
  }; }
  static get styleUrls() { return {
    "$": ["image-cropper.css"]
  }; }
  static get properties() { return {
    "disabled": {
      "type": "boolean",
      "mutable": false,
      "complexType": {
        "original": "boolean",
        "resolved": "boolean",
        "references": {}
      },
      "required": false,
      "optional": false,
      "docs": {
        "tags": [],
        "text": ""
      },
      "attribute": "disabled",
      "reflect": false,
      "defaultValue": "false"
    }
  }; }
  static get states() { return {
    "handleMove": {}
  }; }
  static get elementRef() { return "el"; }
}
