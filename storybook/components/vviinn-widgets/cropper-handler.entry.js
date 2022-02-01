import { r as registerInstance, h, f as Host } from './index-42e4cfd6.js';
import { Q as getCursorValue } from './Handler-47db9890.js';

const cropperHandlerCss = ":host{--size:20px;background:transparent;border:4px solid white;box-sizing:content-box;display:block;height:var(--size);touch-action:none;position:absolute;width:var(--size);z-index:4;-webkit-user-select:none;-moz-user-select:none;-ms-user-select:none;user-select:none}:host(.disabled){opacity:0.25}:host(.nw-resize){border-bottom:none;border-right:none;top:0;left:0}:host(.ne-resize){border-left:none;border-bottom:none;right:0;top:0}:host(.sw-resize){border-right:none;border-top:none;left:0;bottom:0}:host(.se-resize){border-left:none;border-top:none;bottom:0;right:0}";

let CropperHandler = class {
  constructor(hostRef) {
    registerInstance(this, hostRef);
    this.disabled = false;
  }
  render() {
    return (h(Host, { part: `handle ${getCursorValue(this.handler.direction)}`, class: {
        disabled: this.disabled,
        [getCursorValue(this.handler.direction)]: true,
      }, style: {
        "--size": "20px",
        cursor: getCursorValue(this.handler.direction),
      }, draggable: false }));
  }
};
CropperHandler.style = cropperHandlerCss;

export { CropperHandler as cropper_handler };
