import { Component, Host, h, Event } from "@stencil/core";
export class VviinnServerError {
  render() {
    return (h(Host, null,
      h("vviinn-error", null,
        h("h4", { slot: "title" }, "Keine Verbindung"),
        h("span", { slot: "text" }, "Etwas hat leider nicht funktioniert. Bitte pr\u00FCfen Sie Ihre Internetverbindung und laden Sie das Bild noch einmal hoch."),
        h("button", { slot: "action", onClick: () => this.actionClick.emit() }, "Erneut versuchen"))));
  }
  static get is() { return "vviinn-server-error"; }
  static get encapsulation() { return "shadow"; }
  static get originalStyleUrls() { return {
    "$": ["vviinn-server-error.css"]
  }; }
  static get styleUrls() { return {
    "$": ["vviinn-server-error.css"]
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
