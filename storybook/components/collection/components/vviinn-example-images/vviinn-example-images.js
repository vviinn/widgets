import { Component, Host, h, Event, Listen, Element } from "@stencil/core";
import { slotChangeListener } from "../customized-slots";
export class VviinnExampleImages {
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
    return (h(Host, null,
      h("h3", null, "Mit den Beispielbildern die Suche direkt ausprobieren"),
      h("div", { class: "images" },
        h("slot", { name: "vviinn-example-images-1" },
          h("vviinn-example-image", { width: 240, height: 320, src: "https://cdn.vviinn.com/0/fit/240/0/ce/0/Z3M6Ly9haWFhcy1pbWdwcm94eS9leGFtcGxlcy9pbWctaW5zcGlyYXRpb24tMDEtTC5qcGc=" })),
        h("slot", { name: "vviinn-example-images-2" },
          h("vviinn-example-image", { width: 240, height: 240, src: "https://cdn.vviinn.com/0/fit/240/0/ce/0/Z3M6Ly9haWFhcy1pbWdwcm94eS9leGFtcGxlcy9pbWctaW5zcGlyYXRpb24tMDItTS5qcGc=" })),
        h("slot", { name: "vviinn-example-images-3" },
          h("vviinn-example-image", { width: 240, height: 240, src: "https://cdn.vviinn.com/0/fit/240/0/ce/0/Z3M6Ly9haWFhcy1pbWdwcm94eS9leGFtcGxlcy9pbWctaW5zcGlyYXRpb24tMDMtTS5qcGc=" })),
        h("slot", { name: "vviinn-example-images-4" },
          h("vviinn-example-image", { width: 240, height: 320, src: "https://cdn.vviinn.com/0/fit/240/0/ce/0/Z3M6Ly9haWFhcy1pbWdwcm94eS9leGFtcGxlcy9pbWctaW5zcGlyYXRpb24tMDQtTC5qcGc=" })))));
  }
  static get is() { return "vviinn-example-images"; }
  static get encapsulation() { return "shadow"; }
  static get originalStyleUrls() { return {
    "$": ["vviinn-example-images.css"]
  }; }
  static get styleUrls() { return {
    "$": ["vviinn-example-images.css"]
  }; }
  static get events() { return [{
      "method": "imageSelected",
      "name": "imageSelected",
      "bubbles": true,
      "cancelable": true,
      "composed": true,
      "docs": {
        "tags": [],
        "text": ""
      },
      "complexType": {
        "original": "void",
        "resolved": "void",
        "references": {}
      }
    }, {
      "method": "imageSelectedError",
      "name": "imageSelectedError",
      "bubbles": true,
      "cancelable": true,
      "composed": true,
      "docs": {
        "tags": [],
        "text": ""
      },
      "complexType": {
        "original": "void",
        "resolved": "void",
        "references": {}
      }
    }]; }
  static get elementRef() { return "el"; }
  static get listeners() { return [{
      "name": "exampleImageSelected",
      "method": "handleImageSelection",
      "target": undefined,
      "capture": false,
      "passive": false
    }, {
      "name": "exampleImageError",
      "method": "handleImageSelectionError",
      "target": undefined,
      "capture": false,
      "passive": false
    }]; }
}
