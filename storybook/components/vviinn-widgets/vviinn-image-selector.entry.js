import { r as registerInstance, k as createEvent, h, f as Host } from './index-42e4cfd6.js';
import { p as processSelectedFile, e as match, i as imageSearchState } from './imageSearch.store-074cab22.js';
import { _ as _function } from './NonEmptyArray-6ef0d207.js';
import './number-98d54dd6.js';
import './Handler-47db9890.js';
import './Array-4b9f84cf.js';

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

export { VviinnImageSelector as vviinn_image_selector };
