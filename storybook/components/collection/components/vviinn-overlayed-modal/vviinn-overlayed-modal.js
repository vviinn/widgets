import { Component, Host, h, Prop, Event } from "@stencil/core";
export class VviinnOverlayedModal {
  constructor() {
    this.active = false;
  }
  render() {
    return (h(Host, { class: { active: this.active } },
      h("vviinn-overlay", null,
        h("vviinn-modal", { onSecondaryActionClicked: () => this.secondaryActionClicked.emit(), active: this.active },
          h("slot", null, "CONTENT")))));
  }
  static get is() { return "vviinn-overlayed-modal"; }
  static get encapsulation() { return "shadow"; }
  static get originalStyleUrls() { return {
    "$": ["vviinn-overlayed-modal.css"]
  }; }
  static get styleUrls() { return {
    "$": ["vviinn-overlayed-modal.css"]
  }; }
  static get properties() { return {
    "active": {
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
      "attribute": "active",
      "reflect": false,
      "defaultValue": "false"
    }
  }; }
  static get events() { return [{
      "method": "secondaryActionClicked",
      "name": "secondaryActionClicked",
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
      "method": "modalClosed",
      "name": "modalClosed",
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
