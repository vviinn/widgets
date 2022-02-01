import { r as registerInstance, k as createEvent, h, f as Host, g as getElement } from './index-42e4cfd6.js';
import { s as slotChangeListener } from './customized-slots-f3745585.js';

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

export { VviinnExampleImages as vviinn_example_images };
