import { r as registerInstance, h, f as Host } from './index-42e4cfd6.js';
import { _ as _function } from './NonEmptyArray-6ef0d207.js';
import { O as Option } from './number-98d54dd6.js';
import { i as imageSearchState, o as fromAlt, q as foldValueObject, r as scaleWithSized, u as center, n as makeRectangularSearchRequest, v as detectedObjectEq } from './imageSearch.store-074cab22.js';
import './Handler-47db9890.js';
import './Array-4b9f84cf.js';

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

export { VviinnDetectedObject as vviinn_detected_object };
