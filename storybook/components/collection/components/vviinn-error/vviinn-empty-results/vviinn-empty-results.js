import { Component, Host, h, Event } from "@stencil/core";
export class VviinnEmptyResults {
  render() {
    return (h(Host, null,
      h("vviinn-error", null,
        h("svg", { slot: "icon", class: "icon", width: "32", height: "32", fill: "none", xmlns: "http://www.w3.org/2000/svg" },
          h("path", { d: "M16 2a14 14 0 1 0 0 28 14 14 0 0 0 0-28Zm0 26a12 12 0 1 1 0-24 12 12 0 0 1 0 24Z", fill: "#525252" }),
          h("path", { d: "M17 8h-2v11h2V8Zm-1 14a1.5 1.5 0 1 0 0 3 1.5 1.5 0 0 0 0-3Z", fill: "#525252" })),
        h("h4", { slot: "title" }, "Leider nichts gefunden"),
        h("span", { slot: "text" }, "Leider konnten wir keine passenden Produkte finden. Bitte versuche es mit einem anderen Bildausschnitt noch einmal."))));
  }
  static get is() { return "vviinn-empty-results"; }
  static get encapsulation() { return "shadow"; }
  static get originalStyleUrls() { return {
    "$": ["vviinn-empty-results.css"]
  }; }
  static get styleUrls() { return {
    "$": ["vviinn-empty-results.css"]
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
