import { Component, Host, h, Prop, Event, State, } from "@stencil/core";
import { pipe } from "fp-ts/lib/function";
import { toFile } from "../../../Image/toFile";
import { imageSearchState, processSelectedFile, } from "../../../store/imageSearch.store";
import * as E from "fp-ts/lib/Either";
export class VviinnExampleImage {
  constructor() {
    this.src = "";
    this.width = 0;
    this.height = 0;
    this.selected = false;
  }
  async selectImage(_event) {
    this.selected = true;
    const file = await toFile(this.src);
    const processResult = await processSelectedFile(file);
    pipe(processResult, E.match(() => this.exampleImageError.emit(), () => this.exampleImageSelected.emit()));
    this.selected = false;
  }
  showPreloader() {
    return ((imageSearchState.objectDetectionInProgress ||
      imageSearchState.loading) &&
      this.selected);
  }
  render() {
    return (h(Host, null,
      this.showPreloader() ? (h("div", { class: "image-preloader" },
        h("vviinn-preloader", null))) : null,
      h("img", { onClick: (ev) => this.selectImage(ev), src: this.src, width: this.width, height: this.height })));
  }
  static get is() { return "vviinn-example-image"; }
  static get encapsulation() { return "shadow"; }
  static get originalStyleUrls() { return {
    "$": ["vviinn-example-image.css"]
  }; }
  static get styleUrls() { return {
    "$": ["vviinn-example-image.css"]
  }; }
  static get properties() { return {
    "src": {
      "type": "string",
      "mutable": false,
      "complexType": {
        "original": "string",
        "resolved": "string",
        "references": {}
      },
      "required": false,
      "optional": false,
      "docs": {
        "tags": [],
        "text": ""
      },
      "attribute": "src",
      "reflect": false,
      "defaultValue": "\"\""
    },
    "width": {
      "type": "number",
      "mutable": false,
      "complexType": {
        "original": "number",
        "resolved": "number",
        "references": {}
      },
      "required": false,
      "optional": false,
      "docs": {
        "tags": [],
        "text": ""
      },
      "attribute": "width",
      "reflect": false,
      "defaultValue": "0"
    },
    "height": {
      "type": "number",
      "mutable": false,
      "complexType": {
        "original": "number",
        "resolved": "number",
        "references": {}
      },
      "required": false,
      "optional": false,
      "docs": {
        "tags": [],
        "text": ""
      },
      "attribute": "height",
      "reflect": false,
      "defaultValue": "0"
    }
  }; }
  static get states() { return {
    "selected": {}
  }; }
  static get events() { return [{
      "method": "exampleImageSelected",
      "name": "exampleImageSelected",
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
      "method": "exampleImageError",
      "name": "exampleImageError",
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
}
