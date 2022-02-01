import { Component, Host, h, Prop } from "@stencil/core";
import { getCursorValue } from "../../../../../cropper/Handler";
export class CropperHandler {
  constructor() {
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
  static get is() { return "cropper-handler"; }
  static get encapsulation() { return "shadow"; }
  static get originalStyleUrls() { return {
    "$": ["cropper-handler.css"]
  }; }
  static get styleUrls() { return {
    "$": ["cropper-handler.css"]
  }; }
  static get properties() { return {
    "handler": {
      "type": "unknown",
      "mutable": false,
      "complexType": {
        "original": "Handler",
        "resolved": "Handler",
        "references": {
          "Handler": {
            "location": "import",
            "path": "../../../../../cropper/Handler"
          }
        }
      },
      "required": false,
      "optional": false,
      "docs": {
        "tags": [],
        "text": ""
      }
    },
    "disabled": {
      "type": "boolean",
      "mutable": false,
      "complexType": {
        "original": "boolean",
        "resolved": "boolean",
        "references": {}
      },
      "required": false,
      "optional": false,
      "docs": {
        "tags": [],
        "text": ""
      },
      "attribute": "disabled",
      "reflect": false,
      "defaultValue": "false"
    }
  }; }
}
