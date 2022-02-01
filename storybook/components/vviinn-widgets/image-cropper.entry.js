import { r as registerInstance, h, f as Host, g as getElement } from './index-42e4cfd6.js';
import { i as imageSearchState, t as transform, l as move, n as makeRectangularSearchRequest } from './imageSearch.store-074cab22.js';
import { O as fromMouseEvent, P as pointDiffSemigroup } from './Handler-47db9890.js';
import { _ as _function } from './NonEmptyArray-6ef0d207.js';
import { O as Option } from './number-98d54dd6.js';
import './Array-4b9f84cf.js';

const findTarget = (ev) => {
  return ev.target;
};

const imageCropperCss = ":host{display:block;height:100%;left:0;position:absolute;top:0;width:100%}:host(.hidden){visibility:hidden}.crop-area{border:1px solid white;box-sizing:border-box;position:absolute;touch-action:none;transition-property:border-color, opacity;transition-duration:.25s;transition-timing-function:ease-in-out;z-index:2;position:relative;will-change:transform}.crop-area.active{border-color:whitesmoke}.crop-area.disabled{opacity:0.25}";

const MIN_SEARCHAREA_SIZE = 40;
let ImageCropper = class {
  constructor(hostRef) {
    registerInstance(this, hostRef);
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
    _function.pipe(imageSearchState.searchArea, Option.map((area) => {
      const newSearchArea = transform(area, transformedHandler);
      if (newSearchArea.width < MIN_SEARCHAREA_SIZE ||
        newSearchArea.height < MIN_SEARCHAREA_SIZE ||
        newSearchArea.x < 0 ||
        newSearchArea.y < 0 ||
        this.bounds.height - (newSearchArea.y + newSearchArea.height) < 0 ||
        this.bounds.width - (newSearchArea.x + newSearchArea.width) < 0)
        return;
      imageSearchState.searchArea = Option.some(newSearchArea);
      this.mouseStartPoint = destination;
      imageSearchState.detectedObject = undefined;
    }));
  }
  handleCropperMove(ev) {
    ev.preventDefault();
    ev.stopPropagation();
    const destination = fromMouseEvent(ev);
    const distance = pointDiffSemigroup.concat(destination, this.mouseStartPoint);
    _function.pipe(imageSearchState.searchArea, Option.map((searchArea) => {
      const newSearchArea = move(searchArea, distance);
      if (newSearchArea.x < 0 ||
        newSearchArea.y < 0 ||
        this.bounds.height - (newSearchArea.y + newSearchArea.height) < 0 ||
        this.bounds.width - (newSearchArea.x + newSearchArea.width) < 0)
        return;
      imageSearchState.detectedObject = undefined;
      imageSearchState.searchArea = Option.some(newSearchArea);
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
    return _function.pipe(imageSearchState.searchArea, Option.map((rectangle) => {
      return {
        width: `${rectangle.width}px`,
        height: `${rectangle.height}px`,
        transform: `translate3d(${rectangle.x}px, ${rectangle.y}px, 0)`,
        cursor: this.handleMove ? "move" : "default",
      };
    }), Option.getOrElse(() => {
      return {};
    }));
  }
  render() {
    return (h(Host, { exportparts: "handle, e-resize, n-resize, ne-resize, nw-resize, s-resize, se-resize, sw-resize, w-resize" }, h("div", { class: {
        "crop-area": true,
        active: this.handleMove,
        disabled: this.disabled,
      }, draggable: false, style: this.getStyleMap(), onContextMenu: () => false, onPointerDown: (ev) => this.handlePointerDown(ev) }, imageSearchState.cropperHandlers.map((handler) => (h("cropper-handler", { disabled: this.disabled, handler: handler, onPointerDown: (ev) => this.handlePointerDown(ev) }))))));
  }
  get el() { return getElement(this); }
};
ImageCropper.style = imageCropperCss;

export { ImageCropper as image_cropper };
