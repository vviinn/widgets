import { Component, Host, h, Element, State, Prop, Watch } from "@stencil/core";
import { range } from "fp-ts/lib/NonEmptyArray";
import { pipe } from "fp-ts/lib/function";
import * as O from "fp-ts/lib/Option";
import * as N from "fp-ts/number";
import { sequenceToOption } from "../../utils/option/option";
import { Arrow } from "./arrow";
export class VviinnSlider {
  constructor() {
    this.elementsCount = 0;
    this.internalPosition = 0;
    this.swipeStartPosition = O.none;
    this.showBullets = true;
    this.position = 0;
    this.showArrows = false;
  }
  positionWatchHandler(newValue) {
    this.internalPosition = newValue;
    this.el.style.setProperty("--position", `${newValue}`);
    this.setActiveCssClassToSlide(newValue);
  }
  connectedCallback() {
    this.handleDomContentChanges();
  }
  handleDomContentChanges() {
    const items = this.el.querySelectorAll("vviinn-slide");
    this.elementsCount = items.length;
    this.el.style.setProperty("--num-items", `${this.elementsCount}`);
    this.setActiveCssClassToSlide(0);
  }
  setActiveCssClassToSlide(index) {
    const items = this.el.querySelectorAll("vviinn-slide");
    items.forEach((i) => i.classList.remove("active"));
    items[index].classList.add("active");
  }
  goToSlide(index) {
    this.internalPosition = index;
    this.el.style.setProperty("--position", `${index}`);
    this.setActiveCssClassToSlide(index);
  }
  renderBullets() {
    return this.showBullets ? (h("div", { class: "controls" }, range(0, this.elementsCount - 1).map((i) => (h("div", { class: {
        bullet: true,
        active: i == this.internalPosition % this.elementsCount,
      }, onClick: () => this.goToSlide(i) }))))) : null;
  }
  nextSlide() {
    this.internalPosition++;
    this.renderSlidePosition();
  }
  prevSlide() {
    const nextPostion = this.internalPosition - 1;
    this.internalPosition =
      nextPostion > -1 ? nextPostion : this.elementsCount - 1;
    this.renderSlidePosition();
  }
  renderSlidePosition() {
    requestAnimationFrame(() => {
      this.el.style.setProperty("--position", `${this.internalPosition % this.elementsCount}`);
    });
  }
  handleKeyDown(event) {
    if (event.key !== "Space" && event.key !== "Enter")
      return;
    const target = event.target;
    const direction = target.className.includes("prev") ? "prev" : "next";
    switch (direction) {
      case "prev":
        this.prevSlide();
        break;
      case "next":
        this.nextSlide();
        break;
    }
  }
  handleTouchStart(event) {
    if (!this.showBullets)
      return;
    this.swipeStartPosition = pipe(event.touches[0], O.fromNullable, O.map((t) => t.clientX));
  }
  handleTouchEnd(event) {
    if (!this.showBullets)
      return;
    const swipeEndPosition = pipe(event.changedTouches[0], O.fromNullable, O.map((t) => t.clientX));
    pipe(sequenceToOption(this.swipeStartPosition, swipeEndPosition), O.map(([start, end]) => N.Ord.compare(start, end)), O.map((swipeDirection) => {
      switch (swipeDirection) {
        case 1:
          return this.nextSlide();
        case -1:
          return this.prevSlide();
      }
    }));
  }
  render() {
    return (h(Host, null,
      h("div", { class: "items-wrapper" },
        h("div", { class: "items", onTouchStart: (e) => this.handleTouchStart(e), onTouchEnd: (e) => this.handleTouchEnd(e) },
          h("slot", null))),
      this.showArrows
        ? [
          h(Arrow, { kind: "prev", onClick: () => this.prevSlide(), onKeyDown: (ev) => this.handleKeyDown(ev), tabindex: 1, disabled: false }),
          h(Arrow, { kind: "next", onClick: () => this.nextSlide(), onKeyDown: (ev) => this.handleKeyDown(ev), tabindex: 0, disabled: false }),
        ]
        : null,
      this.renderBullets()));
  }
  static get is() { return "vviinn-slider"; }
  static get encapsulation() { return "shadow"; }
  static get originalStyleUrls() { return {
    "$": ["vviinn-slider.css"]
  }; }
  static get styleUrls() { return {
    "$": ["vviinn-slider.css"]
  }; }
  static get properties() { return {
    "showBullets": {
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
      "attribute": "show-bullets",
      "reflect": false,
      "defaultValue": "true"
    },
    "position": {
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
      "attribute": "position",
      "reflect": true,
      "defaultValue": "0"
    },
    "showArrows": {
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
      "attribute": "show-arrows",
      "reflect": false,
      "defaultValue": "false"
    }
  }; }
  static get states() { return {
    "elementsCount": {},
    "internalPosition": {},
    "swipeStartPosition": {}
  }; }
  static get elementRef() { return "el"; }
  static get watchers() { return [{
      "propName": "position",
      "methodName": "positionWatchHandler"
    }]; }
}
