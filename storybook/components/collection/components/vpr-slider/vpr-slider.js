import { Component, Host, h, Element, State, Method, Prop, } from "@stencil/core";
import { rebuildProducts, rewrapProducts } from "./products.worker";
import { animationFrameScheduler } from "rxjs";
import { fromEvent } from "rxjs";
import { debounceTime } from "rxjs/operators";
export class VprSlider {
  constructor() {
    this.imageRatio = 1.5;
    this.imageWidth = 100;
    this.productsInGrid = 4;
    this.wrappedItems = [[]];
    this.slidePosition = 0;
    this.sliderMode = "auto";
    this.products = [];
  }
  componentShouldUpdate() {
    this.updateSliderWrapperSize();
  }
  connectedCallback() {
    const resize = fromEvent(window, "resize");
    const resizeObserver = resize.pipe(debounceTime(50));
    resizeObserver.subscribe(() => {
      animationFrameScheduler.schedule(() => {
        this.updateSliderWrapperSize();
        this.sliderMode = Number.isNaN(this.getColumns())
          ? this.mode
          : "manual";
        switch (this.sliderMode) {
          case "auto":
            return this.rebuildSlides();
          case "manual":
            return this.wrapItems(this.products, this.getColumns());
        }
      });
    });
    this.sliderMode = Number.isNaN(this.getColumns()) ? this.mode : "manual";
  }
  componentDidLoad() {
    this.el.style.setProperty("--item-size", `${this.imageWidth}px`);
    this.updateSliderWrapperSize();
  }
  async resetSliderPosition() {
    this.slidePosition = 0;
    this.el.style.setProperty("--slide-position", `${this.slidePosition}`);
  }
  async loadProducts(products) {
    this.products = products;
    switch (this.sliderMode) {
      case "auto":
        return this.rebuildSlides();
      case "grid":
        return this.wrapItems(this.products, this.getProductsCount(products));
      case "manual":
        return this.wrapItems(this.products, this.getColumns());
    }
  }
  getColumns() {
    return parseInt(getComputedStyle(this.el).getPropertyValue("--columns"));
  }
  getProductsCount(products) {
    var _a, _b;
    return (_b = (_a = this.productsInGrid) !== null && _a !== void 0 ? _a : products.length) !== null && _b !== void 0 ? _b : 1;
  }
  async rebuildSlides() {
    const slideSize = this.getSlideSize();
    const margin = parseInt(getComputedStyle(this.el).getPropertyValue("font-size"));
    this.wrappedItems = await rebuildProducts(this.products, slideSize, margin, this.imageWidth);
    this.updateSliderWrapperSize();
  }
  getSlideSize() {
    return this.el.querySelector(".slides-wrapper").getBoundingClientRect()
      .width;
  }
  updateSliderWrapperSize() {
    requestAnimationFrame(() => {
      const size = this.getSlideSize();
      this.el.style.setProperty("--slide-size", `${size}px`);
    });
  }
  async wrapItems(items, columns = 1) {
    this.wrappedItems = await rewrapProducts(items, columns);
    this.updateSliderWrapperSize();
  }
  isPrevAvaible() {
    return this.slidePosition === 0;
  }
  isNextAvaible() {
    return Math.abs(this.slidePosition) === this.wrappedItems.length - 1;
  }
  prev() {
    this.slidePosition++;
    this.el.style.setProperty("--slide-position", `${this.slidePosition}`);
  }
  next() {
    this.slidePosition--;
    this.el.style.setProperty("--slide-position", `${this.slidePosition}`);
  }
  moveTo(position) {
    this.slidePosition = position * -1;
    this.el.style.setProperty("--slide-position", `${this.slidePosition}`);
  }
  isMultipleSlidesAvaible() {
    return this.wrappedItems.length > 1;
  }
  render() {
    return (h(Host, { class: { minimal: !this.isMultipleSlidesAvaible() } },
      this.isMultipleSlidesAvaible() ? (h("button", { class: "prev", onClick: () => this.prev(), disabled: this.isPrevAvaible() },
        h("svg", { xmlns: "http://www.w3.org/2000/svg", width: "30", height: "30", viewBox: "0 0 512 512" },
          h("title", null, "previous"),
          h("polyline", { points: "328 112 184 256 328 400" })))) : null,
      h("div", { class: "slides-wrapper" },
        h("div", { class: "body" }, this.wrappedItems.map((items) => (h("div", { class: { slide: true, [this.mode]: true } }, items.map((item) => {
          var _a;
          return (h("vviinn-product-card", { brand: item.brand, image: (_a = item.image.thumbnail) !== null && _a !== void 0 ? _a : item.image.original, imageRatio: this.imageRatio, imageWidth: this.imageWidth, price: item.price.actual, productTitle: item.title, productId: item.productId, productType: item.productType, salePrice: item.price.sale, deeplink: item.deeplink }));
        })))))),
      this.isMultipleSlidesAvaible() ? (h("button", { class: "next", onClick: () => this.next(), disabled: this.isNextAvaible() },
        h("svg", { xmlns: "http://www.w3.org/2000/svg", viewBox: "0 0 512 512", width: "30", height: "30" },
          h("title", null, "next"),
          h("polyline", { points: "184 112 328 256 184 400" })))) : null,
      this.isMultipleSlidesAvaible() ? (h("div", { class: "position-bullets" }, this.wrappedItems.map((_, i) => (h("div", { class: {
          "position-bullet": true,
          active: this.slidePosition === i * -1,
        }, onClick: () => this.moveTo(i) }))))) : null));
  }
  static get is() { return "vpr-slider"; }
  static get originalStyleUrls() { return {
    "$": ["vpr-slider.css"]
  }; }
  static get styleUrls() { return {
    "$": ["vpr-slider.css"]
  }; }
  static get properties() { return {
    "mode": {
      "type": "string",
      "mutable": false,
      "complexType": {
        "original": "GridMode",
        "resolved": "\"auto\" | \"grid\" | \"manual\"",
        "references": {
          "GridMode": {
            "location": "import",
            "path": "../../slider/GridMode"
          }
        }
      },
      "required": false,
      "optional": false,
      "docs": {
        "tags": [],
        "text": ""
      },
      "attribute": "mode",
      "reflect": false
    },
    "imageRatio": {
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
      "attribute": "image-ratio",
      "reflect": false,
      "defaultValue": "1.5"
    },
    "imageWidth": {
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
      "attribute": "image-width",
      "reflect": false,
      "defaultValue": "100"
    },
    "productsInGrid": {
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
      "attribute": "products-in-grid",
      "reflect": false,
      "defaultValue": "4"
    }
  }; }
  static get states() { return {
    "wrappedItems": {},
    "slidePosition": {}
  }; }
  static get methods() { return {
    "resetSliderPosition": {
      "complexType": {
        "signature": "() => Promise<void>",
        "parameters": [],
        "references": {
          "Promise": {
            "location": "global"
          }
        },
        "return": "Promise<void>"
      },
      "docs": {
        "text": "",
        "tags": []
      }
    },
    "loadProducts": {
      "complexType": {
        "signature": "(products: Recommendation[]) => Promise<void>",
        "parameters": [{
            "tags": [],
            "text": ""
          }],
        "references": {
          "Promise": {
            "location": "global"
          },
          "Recommendation": {
            "location": "import",
            "path": "../../recommendation/recommendation"
          }
        },
        "return": "Promise<void>"
      },
      "docs": {
        "text": "",
        "tags": []
      }
    }
  }; }
  static get elementRef() { return "el"; }
}
