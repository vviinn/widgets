import { Component, Host, h, Event } from "@stencil/core";
export class VviinnWrongFormat {
  render() {
    return (h(Host, null,
      h("vviinn-error", null,
        h("h4", { slot: "title" }, "Dateityp wird nicht unterst\u00FCtzt"),
        h("span", { slot: "text" }, "Leider unterst\u00FCtzen wir dieses Format nicht. Bitte laden Sie eine .jpg, .png oder .webp Bilddatei hoch."),
        h("button", { slot: "action", onClick: () => this.actionClick.emit() }, "Neues Bild hochladen"))));
  }
  static get is() { return "vviinn-wrong-format"; }
  static get encapsulation() { return "shadow"; }
  static get originalStyleUrls() { return {
    "$": ["vviinn-wrong-format.css"]
  }; }
  static get styleUrls() { return {
    "$": ["vviinn-wrong-format.css"]
  }; }
  static get events() { return [{
      "method": "actionClick",
      "name": "actionClick",
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
