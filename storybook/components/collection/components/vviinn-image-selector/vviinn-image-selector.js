import { Component, Host, h, Event } from "@stencil/core";
import * as E from "fp-ts/Either";
import { pipe } from "fp-ts/lib/function";
import { imageSearchState, processSelectedFile, } from "../../store/imageSearch.store";
/**
 * @part button -  button look and feel
 */
export class VviinnImageSelector {
  async handleInputChange(event) {
    const input = event.target;
    const processingResult = await processSelectedFile(input.files[0]);
    pipe(processingResult, E.match(() => this.imageSelectedError.emit(), () => this.imageSelected.emit()));
    input.value = null;
  }
  isLoading() {
    return (imageSearchState.loading || imageSearchState.objectDetectionInProgress);
  }
  render() {
    return (h(Host, { exportparts: "button" },
      this.isLoading() ? h("vviinn-preloader", null) : null,
      this.isLoading() ? null : (h("label", { htmlFor: "fileInput", part: "button" },
        h("slot", { name: "upload-button-text" }, "Upload image"))),
      h("input", { id: "fileInput", class: "visually-hidden", type: "file", accept: "image/*", onChange: (event) => this.handleInputChange(event) })));
  }
  static get is() { return "vviinn-image-selector"; }
  static get encapsulation() { return "shadow"; }
  static get originalStyleUrls() { return {
    "$": ["vviinn-image-selector.css"]
  }; }
  static get styleUrls() { return {
    "$": ["vviinn-image-selector.css"]
  }; }
  static get events() { return [{
      "method": "imageSelected",
      "name": "imageSelected",
      "bubbles": true,
      "cancelable": true,
      "composed": true,
      "docs": {
        "tags": [],
        "text": "Event fires when user select file"
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
        "text": "Event fires when user select file that no .jpg, .jpeg or png"
      },
      "complexType": {
        "original": "void",
        "resolved": "void",
        "references": {}
      }
    }]; }
}
