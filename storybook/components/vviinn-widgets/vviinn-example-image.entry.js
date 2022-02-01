import { r as registerInstance, k as createEvent, h, f as Host } from './index-42e4cfd6.js';
import { _ as _function } from './NonEmptyArray-6ef0d207.js';
import { w as toFile, p as processSelectedFile, E as Either, i as imageSearchState } from './imageSearch.store-074cab22.js';
import './number-98d54dd6.js';
import './Handler-47db9890.js';
import './Array-4b9f84cf.js';

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

export { VviinnExampleImage as vviinn_example_image };
