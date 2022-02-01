import { Component, Host, h, State, Event, Prop } from "@stencil/core";
export class VviinnModal {
  constructor() {
    this.active = false;
    this.slider = false;
  }
  close() {
    this.active = false;
    setTimeout(() => {
      this.modalClosed.emit();
    }, this.slider ? 500 : 0);
  }
  handleAnimationEnd(ev) {
    if (ev.animationName !== "fade-in")
      return;
    this.slider = true;
  }
  render() {
    return (h(Host, { exportparts: "secondary-action, title, close-button", class: { closed: !this.active }, onAnimationEnd: (ev) => this.handleAnimationEnd(ev) },
      h("div", { class: "head" },
        h("button", { part: "secondary-action", onClick: () => this.secondaryActionClicked.emit() },
          h("svg", { width: "24", height: "24", viewBox: "0 0 24 24", fill: "none", xmlns: "http://www.w3.org/2000/svg" },
            h("path", { d: "M20.25 12H3.75", stroke: "#161616", "stroke-width": "2", "stroke-linecap": "round", "stroke-linejoin": "round" }),
            h("path", { d: "M10.5 5.25L3.75 12L10.5 18.75", stroke: "#161616", "stroke-width": "2", "stroke-linecap": "round", "stroke-linejoin": "round" }))),
        h("div", { class: "title", part: "title" }, "Bildsuche"),
        h("button", { onClick: () => this.close(), class: "close-button", part: "close-button" },
          h("svg", { width: "16", height: "16", viewBox: "0 0 16 16", fill: "none", xmlns: "http://www.w3.org/2000/svg" },
            h("path", { d: "M16 1.4L14.6 0L8 6.6L1.4 0L0 1.4L6.6 8L0 14.6L1.4 16L8 9.4L14.6 16L16 14.6L9.4 8L16 1.4Z", fill: "#333333" })))),
      h("div", { class: "body" },
        h("slot", null))));
  }
  static get is() { return "vviinn-modal"; }
  static get encapsulation() { return "shadow"; }
  static get originalStyleUrls() { return {
    "$": ["vviinn-modal.css"]
  }; }
  static get styleUrls() { return {
    "$": ["vviinn-modal.css"]
  }; }
  static get properties() { return {
    "active": {
      "type": "boolean",
      "mutable": true,
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
      "reflect": true,
      "defaultValue": "false"
    }
  }; }
  static get states() { return {
    "slider": {}
  }; }
  static get events() { return [{
      "method": "modalClosed",
      "name": "modalClosed",
      "bubbles": true,
      "cancelable": true,
      "composed": true,
      "docs": {
        "tags": [],
        "text": "Event emitted when close button clicked and close animation ends"
      },
      "complexType": {
        "original": "AnimationEvent",
        "resolved": "AnimationEvent",
        "references": {
          "AnimationEvent": {
            "location": "global"
          }
        }
      }
    }, {
      "method": "secondaryActionClicked",
      "name": "secondaryActionClicked",
      "bubbles": true,
      "cancelable": true,
      "composed": true,
      "docs": {
        "tags": [],
        "text": "Event emitted when secondary action button clicked"
      },
      "complexType": {
        "original": "void",
        "resolved": "void",
        "references": {}
      }
    }]; }
}
