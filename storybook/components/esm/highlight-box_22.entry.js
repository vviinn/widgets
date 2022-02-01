import { r as registerInstance, h, H as Host, g as getElement, c as createEvent } from './index-d92b0799.js';
import { O as Option, h as sequenceToOption, i as imageSearchState, a as _function, t as transform, j as move, k as makeRectangularSearchRequest, l as fromAlt, n as foldValueObject, o as scaleWithSized, p as center, q as detectedObjectEq, r as toFile, u as processSelectedFile, E as Either, v as match, w as fromImage, x as dimensionsFromImage, y as scaleByLargestSide, N as NonEmptyArray } from './imageSearch.store-0d870770.js';
import { p as pipe, m as pointDiffSemigroup, o as fromMouseEvent } from './Handler-639a4cb3.js';
import { b as CheckIcon, O as OnboardingCard1Icon, c as OnboardingCard2Icon, d as OnboardingCard3Icon, A as ArrowIcon } from './index-ba7b7672.js';
import { s as slotChangeListener } from './customized-slots-06a5874a.js';

// -------------------------------------------------------------------------------------
// -------------------------------------------------------------------------------------
// instances
// -------------------------------------------------------------------------------------
/**
 * @category instances
 * @since 2.10.0
 */
var Eq = {
    equals: function (first, second) { return first === second; }
};
/**
 * @category instances
 * @since 2.10.0
 */
var Ord = {
    equals: Eq.equals,
    compare: function (first, second) { return (first < second ? -1 : first > second ? 1 : 0); }
};

const fromRectangle = (shape, target) => {
  const top = `${shape.y}px`;
  const left = `${shape.x}px`;
  const right = `${target.width - (shape.x + shape.width)}px`;
  const bottom = `${target.height - (shape.y + shape.height)}px`;
  return {
    top,
    right,
    bottom,
    left,
  };
};
const printClip = (clip) => `inset(${clip.top} ${clip.right} ${clip.bottom} ${clip.left})`;
const getClipValue = (shape, target) => printClip(fromRectangle(shape, target));

const highlightBoxCss = ":host{display:grid;position:absolute;box-sizing:border-box;border:none;width:100%;height:100%;-webkit-user-select:none;-moz-user-select:none;-ms-user-select:none;user-select:none;--size:10px;--x-position:0;--y-position:0}img{-webkit-user-select:none;-moz-user-select:none;-ms-user-select:none;user-select:none}.pointer{position:absolute;width:var(--size);height:var(--size);background:black;border-radius:50%;z-index:2;cursor:pointer;transform:translate(var(--x-position), var(--y-position)) scale(0);-webkit-animation:0.25s linear fadein;animation:0.25s linear fadein;-webkit-animation-fill-mode:forwards;animation-fill-mode:forwards}.pointer::after{content:\"\";cursor:pointer;border:5px solid black;border-radius:50%;width:var(--size);height:var(--size);display:block;transform:translate(calc(-50% + var(--size) * 0.5), calc(-50% + var(--size) * 0.5));padding:calc(var(--size) * 0.5);opacity:.75}@-webkit-keyframes fadein{from{transform:translate(var(--x-position), var(--y-position)) scale(0)}to{transform:translate(var(--x-position), var(--y-position)) scale(1)}}@keyframes fadein{from{transform:translate(var(--x-position), var(--y-position)) scale(0)}to{transform:translate(var(--x-position), var(--y-position)) scale(1)}}";

let HighlightBox = class {
  constructor(hostRef) {
    registerInstance(this, hostRef);
  }
  getInsetValue() {
    return pipe(sequenceToOption(imageSearchState.searchArea, imageSearchState.imageBounds), Option.map(([selection, image]) => getClipValue(selection, image)), Option.getOrElse(() => ""));
  }
  renderImage() {
    return pipe(sequenceToOption(imageSearchState.imageUrl, imageSearchState.imageBounds), Option.map(([url, bounds]) => (h("img", { src: url, width: bounds.width, height: bounds.height, style: { "clip-path": `${this.getInsetValue()}` } }))), Option.getOrElse(() => ""));
  }
  render() {
    return h(Host, null, this.renderImage());
  }
};
HighlightBox.style = highlightBoxCss;

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

const searchFiltersCss = ":host{display:grid;grid-gap:1rem}.filters{display:flex;flex-direction:row;flex-wrap:wrap;gap:0.5rem}.filter{align-items:center;-webkit-animation-duration:0.25s;animation-duration:0.25s;-webkit-animation-fill-mode:forwards;animation-fill-mode:forwards;-webkit-animation-name:scalein;animation-name:scalein;border:1px solid lightgray;cursor:pointer;display:flex;flex-direction:row;grid-gap:8px;height:-webkit-max-content;height:-moz-max-content;height:max-content;min-width:-webkit-max-content;min-width:-moz-max-content;min-width:max-content;padding:0.1rem;transform:scale(0);transition-property:background;transition-duration:0.25s;transition-timing-function:ease-in-out;-webkit-user-select:none;-moz-user-select:none;-ms-user-select:none;user-select:none;padding:6px 16px}.filter.active{border:1px solid black;padding:6px 8px}.filter:hover{border:1px solid gray}.show-more{display:flex}.show-more.hidden{display:none}.show-more::after{content:url(\"data:image/svg+xml,%3Csvg width='16' height='16' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M8 12.2l-6-6L3.2 5 8 9.8 12.8 5 14 6.2l-6 6z' fill='%23525252'/%3E%3C/svg%3E\");display:block;height:16px;margin-top:1px;margin-left:8px}.show-more.active::after{transform:rotateX(180deg)}@-webkit-keyframes scalein{from{opacity:0;transform:scale(0.5)}to{opacity:1;transform:scale(1)}}@keyframes scalein{from{opacity:0;transform:scale(0.5)}to{opacity:1;transform:scale(1)}}@media (max-width: 415px){.show-more::after{transform:rotate(-90deg)}.show-more.active::after{transform:rotate(90deg)}}@media (max-width: 800px){.filters{flex-wrap:nowrap;overflow-x:scroll;-ms-scroll-snap-type:x mandatory;scroll-snap-type:x mandatory;grid-gap:unset}.filter{scroll-snap-align:end;margin-right:0.5rem}}";

const FILTERS_COUNT = 5;
const ACTIVE_FILTER_CLASSNAME = ".filter.active";
const getFilterId = (filter) => filter.href.split("/").reverse()[0];
let SearchFilters = class {
  constructor(hostRef) {
    registerInstance(this, hostRef);
    this.filter = null;
    this.selectedCategoryId = null;
    this.hideFilters = true;
  }
  handleFilterSelection(filter) {
    return this.isFilterSelected(filter)
      ? this.clearSelectedFilter()
      : this.selectFilter(filter);
  }
  selectFilter(filter) {
    this.selectedCategoryId = getFilterId(filter);
    imageSearchState.activeIonLink = filter;
  }
  clearSelectedFilter() {
    this.selectedCategoryId = null;
    imageSearchState.activeIonLink = undefined;
    this.findSelectedFilter().blur();
  }
  findSelectedFilter() {
    return this.el.shadowRoot.querySelector(ACTIVE_FILTER_CLASSNAME);
  }
  toggleFilters() {
    this.hideFilters = !this.hideFilters;
  }
  handleEnter(ev, f) {
    if (ev.key !== "Enter")
      return;
    this.handleFilterSelection(f);
  }
  isFilterSelected(filterLink) {
    return this.selectedCategoryId === getFilterId(filterLink);
  }
  render() {
    return (h(Host, { exportparts: "filter, show-more-filters" }, h("div", { class: "filters" }, this.filter.filters
      .filter((_, i) => (this.hideFilters ? i < FILTERS_COUNT : true))
      .map((f, n) => (h("div", { role: "button", tabindex: "0", part: this.isFilterSelected(f) ? "filter active" : "filter", class: {
        filter: true,
        active: this.selectedCategoryId === getFilterId(f),
      }, style: { "animation-delay": `${n * 10}ms` }, onPointerUp: (ev) => {
        ev.stopPropagation();
        this.handleFilterSelection(f);
      }, onKeyPress: (ev) => this.handleEnter(ev, f) }, this.isFilterSelected(f) ? h(CheckIcon, null) : null, f.name))), h("div", { class: {
        filter: true,
        "show-more": true,
        hidden: this.filter.filters.length <= FILTERS_COUNT,
        active: !this.hideFilters,
      }, role: "button", tabindex: "0", "aria-role": "button", onClick: () => this.toggleFilters(), onKeyPress: (ev) => {
        if (ev.key === "Enter") {
          this.toggleFilters();
        }
      }, part: "show-more-filters" }, this.hideFilters ? "Zeige mehr" : "Zeige weniger"))));
  }
  get el() { return getElement(this); }
};
SearchFilters.style = searchFiltersCss;

const vviinnDetectedObjectCss = ":host{--color-primary-system:#0F62FE;--color-primary-hover-system:#014CDA;--color-icons-system:#2F8EDF;--spacer:8px}:host{--size:32px;--x-position:0;--y-position:0;background:rgba(22, 22, 22, 0.5);border-radius:50%;border:none;cursor:pointer;display:block;height:var(--size);position:absolute;transition:opacity 0.25s;width:var(--size);z-index:2;transform:translate(calc(var(--x-position) - (var(--size) * 0.5)), calc(var(--y-position) - (var(--size) * 0.5)));transition:background 0.1 ease-in-out}:host(:hover){background:rgba(22, 22, 22, 0.75)}:host(.active){background:var(--color-primary, var(--color-primary-system))!important;border:2px solid white}:host::after{--size:32px;border-radius:50%;content:\"\";cursor:pointer;display:block;height:calc(var(--size) * 0.25);transform:translate(calc(-50% + var(--size) * 0.5), calc(-50% + var(--size) * 0.5));width:calc(var(--size) * 0.25);background:white}";

let VviinnDetectedObject = class {
  constructor(hostRef) {
    registerInstance(this, hostRef);
    this.position = ["0", "0"];
  }
  getObjectPosition() {
    return _function.pipe(imageSearchState.imageBounds, Option.map((bounds) => {
      const objectRectangle = fromAlt(foldValueObject(this.detectedObject).rectangle);
      const { x, y } = _function.pipe(objectRectangle, scaleWithSized(bounds), center);
      return [`${x}px`, `${y}px`];
    }), Option.getOrElse(() => ["0", "0"]));
  }
  selectDetectedObject() {
    _function.pipe(imageSearchState.imageBounds, Option.map((bounds) => {
      const rectangle = foldValueObject(this.detectedObject).rectangle;
      const transformedRect = fromAlt(rectangle);
      const scaledRect = scaleWithSized(bounds)(transformedRect);
      imageSearchState.detectedObject = this.detectedObject;
      imageSearchState.searchArea = Option.some(scaledRect);
    }));
    makeRectangularSearchRequest();
  }
  isActive() {
    if (!this.detectedObject)
      return false;
    if (!imageSearchState.detectedObject)
      return false;
    const thisObject = foldValueObject(this.detectedObject);
    const savedObject = foldValueObject(imageSearchState.detectedObject);
    return detectedObjectEq.equals(thisObject, savedObject);
  }
  render() {
    return (h(Host, { class: {
        active: this.isActive(),
      }, onClick: () => this.selectDetectedObject(), style: {
        "--x-position": this.getObjectPosition()[0],
        "--y-position": this.getObjectPosition()[1],
      } }));
  }
};
VviinnDetectedObject.style = vviinnDetectedObjectCss;

const vviinnEmptyResultsCss = ":host{display:grid}vviinn-error{justify-items:center}";

let VviinnEmptyResults = class {
  constructor(hostRef) {
    registerInstance(this, hostRef);
    this.actionClick = createEvent(this, "actionClick", 7);
  }
  render() {
    return (h(Host, null, h("vviinn-error", null, h("svg", { slot: "icon", class: "icon", width: "32", height: "32", fill: "none", xmlns: "http://www.w3.org/2000/svg" }, h("path", { d: "M16 2a14 14 0 1 0 0 28 14 14 0 0 0 0-28Zm0 26a12 12 0 1 1 0-24 12 12 0 0 1 0 24Z", fill: "#525252" }), h("path", { d: "M17 8h-2v11h2V8Zm-1 14a1.5 1.5 0 1 0 0 3 1.5 1.5 0 0 0 0-3Z", fill: "#525252" })), h("h4", { slot: "title" }, "Leider nichts gefunden"), h("span", { slot: "text" }, "Leider konnten wir keine passenden Produkte finden. Bitte versuche es mit einem anderen Bildausschnitt noch einmal."))));
  }
};
VviinnEmptyResults.style = vviinnEmptyResultsCss;

const vviinnExampleImageCss = ":host{display:block;margin-bottom:8px;position:relative}img{width:100%;height:auto;cursor:pointer}.image-preloader{background:rgba(0, 0, 0, 0.25);border-radius:4px;bottom:12px;display:none;padding:4px 6px;pointer-events:none;position:absolute;right:12px;z-index:4}vviinn-preloader{--preloader-size:12px}@media (max-width: 640px){.image-preloader{display:block}}";

let VviinnExampleImage = class {
  constructor(hostRef) {
    registerInstance(this, hostRef);
    this.exampleImageSelected = createEvent(this, "exampleImageSelected", 7);
    this.exampleImageError = createEvent(this, "exampleImageError", 7);
    this.src = "";
    this.width = 0;
    this.height = 0;
    this.selected = false;
  }
  async selectImage(_event) {
    this.selected = true;
    const file = await toFile(this.src);
    const processResult = await processSelectedFile(file);
    _function.pipe(processResult, Either.match(() => this.exampleImageError.emit(), () => this.exampleImageSelected.emit()));
    this.selected = false;
  }
  showPreloader() {
    return ((imageSearchState.objectDetectionInProgress ||
      imageSearchState.loading) &&
      this.selected);
  }
  render() {
    return (h(Host, null, this.showPreloader() ? (h("div", { class: "image-preloader" }, h("vviinn-preloader", null))) : null, h("img", { onClick: (ev) => this.selectImage(ev), src: this.src, width: this.width, height: this.height })));
  }
};
VviinnExampleImage.style = vviinnExampleImageCss;

const vviinnExampleImagesCss = "h3{font-size:22px;font-weight:600;line-height:32px;margin:0;margin-bottom:16px;text-align:center}.images{display:block;-moz-column-count:2;column-count:2;-moz-column-gap:16px;column-gap:16px}";

let VviinnExampleImages = class {
  constructor(hostRef) {
    registerInstance(this, hostRef);
    this.imageSelected = createEvent(this, "imageSelected", 7);
    this.imageSelectedError = createEvent(this, "imageSelectedError", 7);
  }
  handleImageSelection() {
    this.imageSelected.emit();
  }
  handleImageSelectionError() {
    this.imageSelectedError.emit();
  }
  componentWillLoad() {
    slotChangeListener(this, this.el);
  }
  render() {
    return (h(Host, null, h("h3", null, "Mit den Beispielbildern die Suche direkt ausprobieren"), h("div", { class: "images" }, h("slot", { name: "vviinn-example-images-1" }, h("vviinn-example-image", { width: 240, height: 320, src: "https://cdn.vviinn.com/0/fit/240/0/ce/0/Z3M6Ly9haWFhcy1pbWdwcm94eS9leGFtcGxlcy9pbWctaW5zcGlyYXRpb24tMDEtTC5qcGc=" })), h("slot", { name: "vviinn-example-images-2" }, h("vviinn-example-image", { width: 240, height: 240, src: "https://cdn.vviinn.com/0/fit/240/0/ce/0/Z3M6Ly9haWFhcy1pbWdwcm94eS9leGFtcGxlcy9pbWctaW5zcGlyYXRpb24tMDItTS5qcGc=" })), h("slot", { name: "vviinn-example-images-3" }, h("vviinn-example-image", { width: 240, height: 240, src: "https://cdn.vviinn.com/0/fit/240/0/ce/0/Z3M6Ly9haWFhcy1pbWdwcm94eS9leGFtcGxlcy9pbWctaW5zcGlyYXRpb24tMDMtTS5qcGc=" })), h("slot", { name: "vviinn-example-images-4" }, h("vviinn-example-image", { width: 240, height: 320, src: "https://cdn.vviinn.com/0/fit/240/0/ce/0/Z3M6Ly9haWFhcy1pbWdwcm94eS9leGFtcGxlcy9pbWctaW5zcGlyYXRpb24tMDQtTC5qcGc=" })))));
  }
  get el() { return getElement(this); }
};
VviinnExampleImages.style = vviinnExampleImagesCss;

const vviinnImageSelectorCss = ":host{display:block}:host(::hover){background:whitesmoke}.visually-hidden{clip:rect(0 0 0 0);-webkit-clip-path:inset(50%);clip-path:inset(50%);height:1px;overflow:hidden;position:absolute;white-space:nowrap;width:1px}label{cursor:pointer;display:grid;padding:0.5rem;transition:background 0.1s ease-in-out}";

let VviinnImageSelector = class {
  constructor(hostRef) {
    registerInstance(this, hostRef);
    this.imageSelected = createEvent(this, "imageSelected", 7);
    this.imageSelectedError = createEvent(this, "imageSelectedError", 7);
  }
  async handleInputChange(event) {
    const input = event.target;
    const processingResult = await processSelectedFile(input.files[0]);
    _function.pipe(processingResult, match(() => this.imageSelectedError.emit(), () => this.imageSelected.emit()));
    input.value = null;
  }
  isLoading() {
    return (imageSearchState.loading || imageSearchState.objectDetectionInProgress);
  }
  render() {
    return (h(Host, { exportparts: "button" }, this.isLoading() ? h("vviinn-preloader", null) : null, this.isLoading() ? null : (h("label", { htmlFor: "fileInput", part: "button" }, h("slot", { name: "upload-button-text" }, "Upload image"))), h("input", { id: "fileInput", class: "visually-hidden", type: "file", accept: "image/*", onChange: (event) => this.handleInputChange(event) })));
  }
};
VviinnImageSelector.style = vviinnImageSelectorCss;

const vviinnImageViewCss = ":host{display:grid;position:relative;justify-self:center}img{box-sizing:border-box;filter:brightness(60%);position:relative;-webkit-user-select:none;-moz-user-select:none;-ms-user-select:none;user-select:none;z-index:-1}.image-preloader{background:rgba(0, 0, 0, 0.25);border-radius:4px;bottom:18px;padding:4px 6px;pointer-events:none;position:absolute;right:18px;z-index:4}vviinn-preloader{--preloader-size:12px}";

const getImageSizes = (i) => {
  const dimensions = dimensionsFromImage(i);
  const resize = scaleByLargestSide(288);
  const newDimensions = resize(dimensions);
  const sizes = newDimensions.map(d => d.size);
  return [sizes[0], sizes[1]];
};
let VviinnImageView = class {
  constructor(hostRef) {
    registerInstance(this, hostRef);
  }
  handleInitialImageLoad(ev) {
    const target = ev.target;
    const imageBounds = fromImage(target);
    const padding = 12;
    const { x, y } = move(imageBounds, { x: padding, y: padding });
    const searchArea = {
      x,
      y,
      width: imageBounds.width - padding * 2,
      height: imageBounds.height - padding * 2,
    };
    imageSearchState.imageBounds = Option.some(imageBounds);
    imageSearchState.searchArea = Option.some(searchArea);
  }
  renderDetectedObject(object) {
    return h("vviinn-detected-object", { detectedObject: object });
  }
  renderImage() {
    return _function.pipe(sequenceToOption(imageSearchState.imageUrl, imageSearchState.image), Option.map(([url, refImage]) => {
      const [width, height] = getImageSizes(refImage);
      const image = (h("img", { decoding: "async", width: width, height: height, src: url, onLoad: (el) => this.handleInitialImageLoad(el), draggable: false }));
      return image;
    }), Option.getOrElse(() => null));
  }
  renderCropper() {
    return _function.pipe(imageSearchState.imageUrl, Option.map(() => h("image-cropper", null)), Option.getOrElse(() => null));
  }
  render() {
    return (h(Host, null, imageSearchState.loading ||
      imageSearchState.objectDetectionInProgress ? (h("div", { class: "image-preloader" }, h("vviinn-preloader", null))) : null, h("highlight-box", null), this.renderImage(), this.renderCropper(), imageSearchState.detectedObjects.map((o) => this.renderDetectedObject(o))));
  }
};
VviinnImageView.style = vviinnImageViewCss;

const vviinnModalCss = ":host{background:white;border-radius:4px;box-sizing:border-box;display:grid;grid-template-rows:-webkit-min-content auto;grid-template-rows:min-content auto;max-width:960px}@media (max-width: 415px){:host{-webkit-animation-name:fade-in;animation-name:fade-in;-webkit-animation-duration:0.5s;animation-duration:0.5s;-webkit-animation-fill-mode:forwards;animation-fill-mode:forwards}:host(.closed){-webkit-animation-name:fade-out;animation-name:fade-out;-webkit-animation-fill-mode:none;animation-fill-mode:none}.body{overflow-y:auto}}@media (max-width: 640px) and (min-width: 415px){:host{max-width:80%}}.head{align-items:center;border-bottom:1px solid #F4F4F4;display:grid;grid-gap:16px;grid-template-columns:-webkit-min-content auto -webkit-min-content;grid-template-columns:min-content auto min-content;justify-items:center;padding:16px}.title{font-weight:600;font-size:18px;line-height:24px}button{-webkit-appearance:none;-moz-appearance:none;appearance:none;background:none;border:none;cursor:pointer;display:grid;padding:unset}@-webkit-keyframes fade-in{from{transform:translateY(100%)}to{transform:translateY(0)}}@keyframes fade-in{from{transform:translateY(100%)}to{transform:translateY(0)}}@-webkit-keyframes fade-out{from{transform:translateY(0)}to{transform:translateY(100%)}}@keyframes fade-out{from{transform:translateY(0)}to{transform:translateY(100%)}}";

let VviinnModal = class {
  constructor(hostRef) {
    registerInstance(this, hostRef);
    this.modalClosed = createEvent(this, "modalClosed", 7);
    this.secondaryActionClicked = createEvent(this, "secondaryActionClicked", 7);
    this.active = false;
    this.slider = false;
  }
  close() {
    this.active = false;
    setTimeout(() => {
      this.modalClosed.emit();
    }, this.slider ? 500 : 0);
  }
  handleAnimationEnd(ev) {
    if (ev.animationName !== "fade-in")
      return;
    this.slider = true;
  }
  render() {
    return (h(Host, { exportparts: "secondary-action, title, close-button", class: { closed: !this.active }, onAnimationEnd: (ev) => this.handleAnimationEnd(ev) }, h("div", { class: "head" }, h("button", { part: "secondary-action", onClick: () => this.secondaryActionClicked.emit() }, h("svg", { width: "24", height: "24", viewBox: "0 0 24 24", fill: "none", xmlns: "http://www.w3.org/2000/svg" }, h("path", { d: "M20.25 12H3.75", stroke: "#161616", "stroke-width": "2", "stroke-linecap": "round", "stroke-linejoin": "round" }), h("path", { d: "M10.5 5.25L3.75 12L10.5 18.75", stroke: "#161616", "stroke-width": "2", "stroke-linecap": "round", "stroke-linejoin": "round" }))), h("div", { class: "title", part: "title" }, "Bildsuche"), h("button", { onClick: () => this.close(), class: "close-button", part: "close-button" }, h("svg", { width: "16", height: "16", viewBox: "0 0 16 16", fill: "none", xmlns: "http://www.w3.org/2000/svg" }, h("path", { d: "M16 1.4L14.6 0L8 6.6L1.4 0L0 1.4L6.6 8L0 14.6L1.4 16L8 9.4L14.6 16L16 14.6L9.4 8L16 1.4Z", fill: "#333333" })))), h("div", { class: "body" }, h("slot", null))));
  }
};
VviinnModal.style = vviinnModalCss;

const vviinnOnboardingCss = ":host{--color-primary-system:#0F62FE;--color-primary-hover-system:#014CDA;--color-icons-system:#2F8EDF;--spacer:8px}vviinn-onboarding{display:block}vviinn-onboarding h3{font-size:22px;font-weight:600;line-height:32px;margin:0;margin-bottom:16px;text-align:center}vviinn-onboarding vviinn-slide{background:#f4f4f4;padding:24px}vviinn-onboarding svg{padding:16px 0}vviinn-onboarding .text{display:grid;grid-gap:8px}vviinn-onboarding .text>h4{color:#161616;font-size:18px;font-weight:600;line-height:24px;margin:unset;text-align:center}vviinn-onboarding .text>p{color:#525252;font-size:14px;font-style:normal;font-weight:normal;line-height:20px;margin:unset;text-align:center}vviinn-onboarding .colored{fill:var(--color-icons, var(--color-icons-system))}";

let VviinnOnboarding = class {
  constructor(hostRef) {
    registerInstance(this, hostRef);
  }
  render() {
    return (h(Host, null, h("h3", null, "So funktioniert es"), h("vviinn-slider", { showArrows: true }, h("vviinn-slide", null, h("vviinn-onboarding-card-1", null)), h("vviinn-slide", null, h("vviinn-onboarding-card-2", null)), h("vviinn-slide", null, h("vviinn-onboarding-card-3", null)))));
  }
};
VviinnOnboarding.style = vviinnOnboardingCss;

const onboardingCardCss$2 = ":host{align-items:center;background:#f4f4f4;display:grid;grid-template-rows:repeat(2, 1fr);justify-items:center;padding:24px;width:100%}h4{color:#161616;font-size:18px;font-weight:600;line-height:24px;margin:unset;text-align:center}svg{padding:16px 0}p{color:#525252;font-size:14px;font-style:normal;font-weight:normal;line-height:20px;margin:unset;text-align:center}.colored{fill:var(--color-icons, var(--color-icons-system))}.text{display:grid;grid-gap:8px}";

let VviinnOnboardingCard1 = class {
  constructor(hostRef) {
    registerInstance(this, hostRef);
  }
  componentWillLoad() {
    slotChangeListener(this, this.el);
  }
  render() {
    return (h(Host, null, h("slot", { name: "onboarding-card-1-icon" }, h(OnboardingCard1Icon, null)), h("slot", { name: "onboarding-card-1-text" }, h("div", { class: "text" }, h("h4", null, "Starte die Bildsuche"), h("p", null, "Lade ein Bild aus Deiner Galerie hoch oder fotografiere ein Produkt mit Deiner Kamera.")))));
  }
  get el() { return getElement(this); }
};
VviinnOnboardingCard1.style = onboardingCardCss$2;

const onboardingCardCss$1 = ":host{align-items:center;background:#f4f4f4;display:grid;grid-template-rows:repeat(2, 1fr);justify-items:center;padding:24px;width:100%}h4{color:#161616;font-size:18px;font-weight:600;line-height:24px;margin:unset;text-align:center}svg{padding:16px 0}p{color:#525252;font-size:14px;font-style:normal;font-weight:normal;line-height:20px;margin:unset;text-align:center}.colored{fill:var(--color-icons, var(--color-icons-system))}.text{display:grid;grid-gap:8px}";

let VviinnOnboardingCard2 = class {
  constructor(hostRef) {
    registerInstance(this, hostRef);
  }
  componentWillLoad() {
    slotChangeListener(this, this.el);
  }
  render() {
    return (h(Host, null, h("slot", { name: "onboarding-card-2-icon" }, h(OnboardingCard2Icon, null)), h("slot", { name: "onboarding-card-2-text" }, h("div", { class: "text" }, h("h4", null, "Verfeiner deine Suche"), h("p", null, "Du kannst den Bildrahmen selber festlegen und so die Produkte genau ausw\u00E4hlen.")))));
  }
  get el() { return getElement(this); }
};
VviinnOnboardingCard2.style = onboardingCardCss$1;

const onboardingCardCss = ":host{align-items:center;background:#f4f4f4;display:grid;grid-template-rows:repeat(2, 1fr);justify-items:center;padding:24px;width:100%}h4{color:#161616;font-size:18px;font-weight:600;line-height:24px;margin:unset;text-align:center}svg{padding:16px 0}p{color:#525252;font-size:14px;font-style:normal;font-weight:normal;line-height:20px;margin:unset;text-align:center}.colored{fill:var(--color-icons, var(--color-icons-system))}.text{display:grid;grid-gap:8px}";

let VviinnOnboardingCard3 = class {
  constructor(hostRef) {
    registerInstance(this, hostRef);
  }
  componentWillLoad() {
    slotChangeListener(this, this.el);
  }
  render() {
    return (h(Host, null, h("slot", { name: "onboarding-card-3-icon" }, h(OnboardingCard3Icon, null)), h("slot", { name: "onboarding-card-3-text" }, h("div", { class: "text" }, h("h4", null, "Ohne Hintergrund"), h("p", null, "Die besten Ergebnisse erh\u00E4ltst Du, wenn das gesuchte Objekt mit einfarbigem und hellem Hintergrund zu sehen ist.")))));
  }
  get el() { return getElement(this); }
};
VviinnOnboardingCard3.style = onboardingCardCss;

const vviinnOverlayCss = ":host{-webkit-animation:fade-in 0.5s ease-in-out;animation:fade-in 0.5s ease-in-out;background:rgba(0, 0, 0, 0.5);display:block;height:100vh;left:0;overflow:hidden;position:fixed;top:0;width:100vw;z-index:9999}@-webkit-keyframes fade-in{from{opacity:0.1}to{opacity:1}}@keyframes fade-in{from{opacity:0.1}to{opacity:1}}";

let VviinnOverlay = class {
  constructor(hostRef) {
    registerInstance(this, hostRef);
  }
  render() {
    return (h(Host, null, h("slot", null)));
  }
};
VviinnOverlay.style = vviinnOverlayCss;

const vviinnOverlayedModalCss = ":host{display:none}:host(.active){display:block}vviinn-overlay{align-items:center;display:grid;justify-items:center}@media (max-width: 415px){vviinn-modal{border-radius:4px 4px 0 0;height:100vh;margin-top:32px;transform:translateY(100%);width:100vw}vviinn-overlay{align-items:end;display:grid;justify-items:center}}";

let VviinnOverlayedModal = class {
  constructor(hostRef) {
    registerInstance(this, hostRef);
    this.secondaryActionClicked = createEvent(this, "secondaryActionClicked", 7);
    this.modalClosed = createEvent(this, "modalClosed", 7);
    this.active = false;
  }
  render() {
    return (h(Host, { class: { active: this.active } }, h("vviinn-overlay", null, h("vviinn-modal", { onSecondaryActionClicked: () => this.secondaryActionClicked.emit(), active: this.active }, h("slot", null, "CONTENT")))));
  }
};
VviinnOverlayedModal.style = vviinnOverlayedModalCss;

const vviinnPrivacyBadgeCss = ":host{display:block;background:#F4F4F4;padding:17px}.content{display:grid;grid-template-columns:-webkit-min-content auto;grid-template-columns:min-content auto;grid-gap:9px}.content p{color:#525252;font-size:12px;line-height:16px;margin:unset}";

let VviinnPrivacyBadge = class {
  constructor(hostRef) {
    registerInstance(this, hostRef);
  }
  render() {
    return (h(Host, null, h("slot", null, h("div", { class: "content" }, h("svg", { xmlns: "http://www.w3.org/2000/svg", width: "16", height: "16", fill: "none" }, h("defs", null), h("path", { fill: "#525252", d: "M8.5 11V7h-2v1h1v3H6v1h4v-1H8.5zM8 4a.75.75 0 100 1.5A.75.75 0 008 4z" }), h("path", { fill: "#525252", d: "M8 15A7 7 0 118 1a7 7 0 010 14zM8 2a6 6 0 100 12A6 6 0 008 2z" })), h("p", null, "Wir gehen sorgf\u00E4ltig mit Deinen Daten um. Deine Bilder werden nur zum Zweck der Bildsuche gespeichert.")))));
  }
};
VviinnPrivacyBadge.style = vviinnPrivacyBadgeCss;

const vviinnServerErrorCss = ":host{display:block}";

let VviinnServerError = class {
  constructor(hostRef) {
    registerInstance(this, hostRef);
    this.actionClick = createEvent(this, "actionClick", 7);
  }
  render() {
    return (h(Host, null, h("vviinn-error", null, h("h4", { slot: "title" }, "Keine Verbindung"), h("span", { slot: "text" }, "Etwas hat leider nicht funktioniert. Bitte pr\u00FCfen Sie Ihre Internetverbindung und laden Sie das Bild noch einmal hoch."), h("button", { slot: "action", onClick: () => this.actionClick.emit() }, "Erneut versuchen"))));
  }
};
VviinnServerError.style = vviinnServerErrorCss;

const vviinnSlideCss = ":host{display:grid;justify-items:center}";

let VviinnSlide = class {
  constructor(hostRef) {
    registerInstance(this, hostRef);
  }
  render() {
    return (h(Host, null, h("slot", null)));
  }
};
VviinnSlide.style = vviinnSlideCss;

const getStyleMap = (data) => {
  return {
    "arrow-wrapper": true,
    [data.kind]: true,
    disabled: data.disabled,
  };
};
const Arrow = ({ kind, tabindex, disabled, onClick, onKeyDown, }) => (h("div", { class: getStyleMap({ kind, disabled }), onClick: onClick, tabindex: tabindex, onKeyDown: onKeyDown },
  h(ArrowIcon, null)));

const vviinnSliderCss = ":host{--color-primary-system:#0F62FE;--color-primary-hover-system:#014CDA;--color-icons-system:#2F8EDF;--spacer:8px}:host{--num-items:0;--position:0;display:grid;grid-gap:20px;justify-items:center;position:relative}.items-wrapper{overflow:hidden;width:100%}.items{box-sizing:border-box;display:grid;grid-auto-flow:column;grid-template-columns:repeat(var(--num-items), 100%);transform:translateX(calc(-100% * var(--position)));transition:transform 0.33s ease-in-out}.controls{display:grid;grid-gap:16px;grid-template-columns:repeat(var(--num-items), -webkit-min-content);grid-template-columns:repeat(var(--num-items), min-content)}.bullet{background:#E0E0E0;border-radius:50%;box-sizing:border-box;cursor:pointer;height:8px;width:8px;transition:background 0.1s ease-in-out}.bullet:hover{background:#C6C6C6}.bullet.active{background:var(--color-primary, var(--color-primary-system))}.bullet:active{background:transparent;border:2px solid var(--color-primary, var(--color-primary-system))}.arrow-wrapper{align-items:center;background:white;border:2px solid white;bottom:0;box-sizing:border-box;display:grid;height:calc(var(--spacer) * 6);justify-items:center;margin:auto;position:absolute;top:0;transform:translate3d(0, -50%, 0);transition:border 0.25ms ease-in-out;width:calc(var(--spacer) * 4)}.arrow-wrapper:active{border-color:var(--color-primary, var(--color-primary-system));opacity:0.75}.arrow-wrapper:focus{border-color:var(--color-primary, var(--color-primary-system));opacity:0.5;outline:none}.prev{left:0}.next{right:0}.next>svg{transform:rotate3d(0, 1, 0, 180deg)}.arrow-wrapper>svg{transition:fill 0.25ms ease-in-out;fill:#A8A8A8}.arrow-wrapper:hover>svg{fill:#8D8D8D}";

let VviinnSlider = class {
  constructor(hostRef) {
    registerInstance(this, hostRef);
    this.elementsCount = 0;
    this.internalPosition = 0;
    this.swipeStartPosition = Option.none;
    this.showBullets = true;
    this.position = 0;
    this.showArrows = false;
  }
  positionWatchHandler(newValue) {
    this.internalPosition = newValue;
    this.el.style.setProperty("--position", `${newValue}`);
    this.setActiveCssClassToSlide(newValue);
  }
  connectedCallback() {
    this.handleDomContentChanges();
  }
  handleDomContentChanges() {
    const items = this.el.querySelectorAll("vviinn-slide");
    this.elementsCount = items.length;
    this.el.style.setProperty("--num-items", `${this.elementsCount}`);
    this.setActiveCssClassToSlide(0);
  }
  setActiveCssClassToSlide(index) {
    const items = this.el.querySelectorAll("vviinn-slide");
    items.forEach((i) => i.classList.remove("active"));
    items[index].classList.add("active");
  }
  goToSlide(index) {
    this.internalPosition = index;
    this.el.style.setProperty("--position", `${index}`);
    this.setActiveCssClassToSlide(index);
  }
  renderBullets() {
    return this.showBullets ? (h("div", { class: "controls" }, NonEmptyArray.range(0, this.elementsCount - 1).map((i) => (h("div", { class: {
        bullet: true,
        active: i == this.internalPosition % this.elementsCount,
      }, onClick: () => this.goToSlide(i) }))))) : null;
  }
  nextSlide() {
    this.internalPosition++;
    this.renderSlidePosition();
  }
  prevSlide() {
    const nextPostion = this.internalPosition - 1;
    this.internalPosition =
      nextPostion > -1 ? nextPostion : this.elementsCount - 1;
    this.renderSlidePosition();
  }
  renderSlidePosition() {
    requestAnimationFrame(() => {
      this.el.style.setProperty("--position", `${this.internalPosition % this.elementsCount}`);
    });
  }
  handleKeyDown(event) {
    if (event.key !== "Space" && event.key !== "Enter")
      return;
    const target = event.target;
    const direction = target.className.includes("prev") ? "prev" : "next";
    switch (direction) {
      case "prev":
        this.prevSlide();
        break;
      case "next":
        this.nextSlide();
        break;
    }
  }
  handleTouchStart(event) {
    if (!this.showBullets)
      return;
    this.swipeStartPosition = _function.pipe(event.touches[0], Option.fromNullable, Option.map((t) => t.clientX));
  }
  handleTouchEnd(event) {
    if (!this.showBullets)
      return;
    const swipeEndPosition = _function.pipe(event.changedTouches[0], Option.fromNullable, Option.map((t) => t.clientX));
    _function.pipe(sequenceToOption(this.swipeStartPosition, swipeEndPosition), Option.map(([start, end]) => Ord.compare(start, end)), Option.map((swipeDirection) => {
      switch (swipeDirection) {
        case 1:
          return this.nextSlide();
        case -1:
          return this.prevSlide();
      }
    }));
  }
  render() {
    return (h(Host, null, h("div", { class: "items-wrapper" }, h("div", { class: "items", onTouchStart: (e) => this.handleTouchStart(e), onTouchEnd: (e) => this.handleTouchEnd(e) }, h("slot", null))), this.showArrows
      ? [
        h(Arrow, { kind: "prev", onClick: () => this.prevSlide(), onKeyDown: (ev) => this.handleKeyDown(ev), tabindex: 1, disabled: false }),
        h(Arrow, { kind: "next", onClick: () => this.nextSlide(), onKeyDown: (ev) => this.handleKeyDown(ev), tabindex: 0, disabled: false }),
      ]
      : null, this.renderBullets()));
  }
  get el() { return getElement(this); }
  static get watchers() { return {
    "position": ["positionWatchHandler"]
  }; }
};
VviinnSlider.style = vviinnSliderCss;

const vviinnTeaserCss = ":host{align-items:center;display:grid;justify-items:center;grid-gap:16px}.vviinn-teaser-text{font-size:28px;font-weight:600;line-height:40px;size:28px;text-align:center}";

let VviinnTeaser = class {
  constructor(hostRef) {
    registerInstance(this, hostRef);
  }
  render() {
    return (h(Host, null, h("slot", null, h("svg", { xmlns: "http://www.w3.org/2000/svg", width: "64", height: "64", fill: "none" }, h("defs", null), h("path", { fill: "#C6C6C6", d: "M48 28a11.98 11.98 0 00-9.77 18.942L28 57.172 30.828 60l10.23-10.23A11.994 11.994 0 1048 28zm0 20a8 8 0 118-8 8.009 8.009 0 01-8 8zM34 24a6 6 0 10-6-6 6.006 6.006 0 006 6zm0-8a2 2 0 110 4 2 2 0 010-4z" }), h("path", { fill: "#C6C6C6", d: "M24 48H8V35.993L18 26l11.172 11.172L32 34.336 20.828 23.165a4 4 0 00-5.656 0L8 30.336V8h40v12h4V8a4.004 4.004 0 00-4-4H8a4.004 4.004 0 00-4 4v40a4.005 4.005 0 004 4h16v-4z" })), h("span", { class: "vviinn-teaser-text" }, "Finde Produkte auf ", h("br", null), " einem Foto"))));
  }
};
VviinnTeaser.style = vviinnTeaserCss;

const vviinnWrongFormatCss = ":host{display:block}";

let VviinnWrongFormat = class {
  constructor(hostRef) {
    registerInstance(this, hostRef);
    this.actionClick = createEvent(this, "actionClick", 7);
  }
  render() {
    return (h(Host, null, h("vviinn-error", null, h("h4", { slot: "title" }, "Dateityp wird nicht unterst\u00FCtzt"), h("span", { slot: "text" }, "Leider unterst\u00FCtzen wir dieses Format nicht. Bitte laden Sie eine .jpg, .png oder .webp Bilddatei hoch."), h("button", { slot: "action", onClick: () => this.actionClick.emit() }, "Neues Bild hochladen"))));
  }
};
VviinnWrongFormat.style = vviinnWrongFormatCss;

export { HighlightBox as highlight_box, ImageCropper as image_cropper, SearchFilters as search_filters, VviinnDetectedObject as vviinn_detected_object, VviinnEmptyResults as vviinn_empty_results, VviinnExampleImage as vviinn_example_image, VviinnExampleImages as vviinn_example_images, VviinnImageSelector as vviinn_image_selector, VviinnImageView as vviinn_image_view, VviinnModal as vviinn_modal, VviinnOnboarding as vviinn_onboarding, VviinnOnboardingCard1 as vviinn_onboarding_card_1, VviinnOnboardingCard2 as vviinn_onboarding_card_2, VviinnOnboardingCard3 as vviinn_onboarding_card_3, VviinnOverlay as vviinn_overlay, VviinnOverlayedModal as vviinn_overlayed_modal, VviinnPrivacyBadge as vviinn_privacy_badge, VviinnServerError as vviinn_server_error, VviinnSlide as vviinn_slide, VviinnSlider as vviinn_slider, VviinnTeaser as vviinn_teaser, VviinnWrongFormat as vviinn_wrong_format };
