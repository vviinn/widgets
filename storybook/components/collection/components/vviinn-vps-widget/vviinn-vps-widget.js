import { Component, Host, h, State, Prop, Element, Watch } from "@stencil/core";
import state from "../../store/store";
import { imageSearchState } from "../../store/imageSearch.store";
import * as O from "fp-ts/lib/Option";
/**
 * @prop --color-primary: color used for action button, slider bullets and selected detected object;
 *
 * @part close-button - close button on modal header.
 * @part secondary-action - back button on modal header.
 * @part title - modal window title.
 *
 * @part select-image_button
 *
 * @part product-card - product card.
 * @part product-card_brand - product card brand.
 * @part product-card_currency - currency sign. Renders after price-amount inside product card.
 * @part product-card_deeplink - anchor element for title. Rendered only if "deeplink" property filled.
 * @part product-card_image - product image inside product card.
 * @part product-card_image-link - anchor element for image. Rendered only if "deeplink" property filled.
 * @part product-card_price-amount - numeric part of price inside product card.
 * @part product-card_price-container - block contains all prices inside product card.
 * @part product-card_price-outdated - renders inside price-container when "sale-price" property filled. Contains regular price.
 * @part product-card_price-prefix - renders before price-amount. Can be set with "price-prefix" property or inherited from parent component.
 * @part product-card_price-regular - renders inside price-container when "sale-price" property is empty.
 * @part product-card_price-sale - renders inside price-container when "sale-price" property filled. Contains sale price.
 * @part product-card_title - product title
 */
export class VviinnVpsWidget {
  constructor() {
    /** When true modal window with widget will be shown */
    this.active = false;
    /** Currency sign will shown after price */
    this.currencySign = "€";
    /** Locale for currency formatting */
    this.locale = "de-DE";
    this.slidePosition = 0;
    this.width = 0;
    this.wrongImageFormat = false;
  }
  activeWatcher(value) {
    if (value) {
      this.overflow = document.body.style.overflow;
      document.body.style.overflow = "hidden";
    }
    else {
      document.body.style.overflow = this.overflow;
    }
  }
  connectedCallback() {
    state.apiPath = this.apiPath;
    state.currencySign = this.currencySign;
    state.locale = this.locale;
    imageSearchState.token = this.token;
  }
  handleImageSelection() {
    this.slidePosition = 1;
    const root = this.el.shadowRoot.querySelector("vviinn-overlayed-modal");
    const overlay = root.shadowRoot.querySelector("vviinn-overlay");
    const modal = overlay.querySelector("vviinn-modal");
    const modalBody = modal.shadowRoot.querySelector(".body");
    modalBody.scrollTop = 0;
  }
  resetState() {
    this.resetScroll("onboarding-block");
    this.slidePosition = 0;
    imageSearchState.image = O.none;
    imageSearchState.imageUrl = O.none;
    imageSearchState.imageBounds = O.none;
    imageSearchState.searchArea = O.none;
    imageSearchState.results = [];
    imageSearchState.filters = [];
    imageSearchState.detectedObjects = [];
    imageSearchState.activeIonLink = undefined;
    imageSearchState.rectangleSearchForm = undefined;
    this.resetScroll("results-block");
  }
  haveErrors() {
    return this.wrongImageFormat || imageSearchState.serverError;
  }
  resetScroll(elementId, behavior = "auto") {
    const element = this.el.shadowRoot.getElementById(elementId);
    element.scroll({ top: 0, left: 0, behavior });
  }
  handleModalClose() {
    this.active = false;
    this.resetState();
    const elementsToReset = ["onboarding-block", "results-block"];
    elementsToReset.forEach((name) => this.resetScroll(name));
  }
  render() {
    return (h(Host, null,
      h("vviinn-overlayed-modal", { class: { "first-screen": this.slidePosition === 0 }, active: this.active, onSecondaryActionClicked: () => this.resetState(), onModalClosed: () => this.handleModalClose(), exportparts: "secondary-action, title, close-button" },
        h("vviinn-slider", { showBullets: false, position: this.slidePosition },
          h("vviinn-slide", { class: { "start-page": true } },
            h("div", { class: {
                error: this.haveErrors(),
                "start-page_block": true,
              } },
              h("vviinn-wrong-format", { class: { hidden: !this.wrongImageFormat }, onActionClick: () => (this.wrongImageFormat = false) }),
              h("vviinn-server-error", { class: { hidden: !imageSearchState.serverError }, onActionClick: () => (imageSearchState.serverError = false) }),
              h("vviinn-teaser", { class: { hidden: this.haveErrors() } }),
              h("vviinn-image-selector", { class: { hidden: this.haveErrors() }, onImageSelected: () => this.handleImageSelection(), onImageSelectedError: () => (this.wrongImageFormat = true), part: "select-image_button" },
                h("span", { slot: "upload-button-text", class: "upload-button-content" },
                  h("svg", { xmlns: "http://www.w3.org/2000/svg", width: "29", height: "28", fill: "none" },
                    h("defs", null),
                    h("path", { fill: "#fff", "fill-rule": "evenodd", d: "M10.271 3.89A.875.875 0 0111 3.5h7c.293 0 .566.146.728.39l1.49 2.235h3.033a2.625 2.625 0 012.625 2.625V21a2.625 2.625 0 01-2.625 2.625H5.75A2.625 2.625 0 013.125 21V8.75A2.625 2.625 0 015.75 6.125h3.031l1.49-2.235zm1.197 1.36l-1.49 2.235a.875.875 0 01-.729.39H5.75a.875.875 0 00-.875.875V21a.875.875 0 00.875.875h17.5a.875.875 0 00.875-.875V8.75a.875.875 0 00-.875-.875h-3.5a.875.875 0 01-.729-.39l-1.49-2.235h-6.063z", "clip-rule": "evenodd" }),
                    h("path", { fill: "#fff", "fill-rule": "evenodd", d: "M14.5 11.375a3.062 3.062 0 100 6.125 3.062 3.062 0 000-6.125zm-4.813 3.063a4.812 4.812 0 119.625 0 4.812 4.812 0 01-9.625 0z", "clip-rule": "evenodd" })),
                  h("span", null, "Kamera oder Bild ausw\u00E4hlen"))),
              h("vviinn-privacy-badge", { class: { hidden: this.haveErrors() } })),
            h("div", { id: "onboarding-block", class: "start-page_block" },
              h("div", { class: "onboarding-wrapper" },
                h("vviinn-onboarding", null),
                h("vviinn-example-images", { onImageSelected: () => this.handleImageSelection(), onImageSelectedError: () => this.resetScroll("onboarding-block", "smooth") })))),
          h("vviinn-slide", { class: { "results-page": true, active: this.slidePosition == 1 } },
            h("div", { class: "image-wrapper" },
              h("vviinn-image-view", null),
              h("div", { class: "filters-wrapper" },
                h("div", { class: "filters" }, imageSearchState.filters.map((filter) => (h("search-filters", { filter: filter })))))),
            h("div", { id: "results-block", class: "products-wrapper" },
              h("div", { class: { "nothing-found": true, hidden: imageSearchState.results.length > 0 } },
                h("vviinn-empty-results", null),
                h("vviinn-onboarding", null)),
              h("div", { class: {
                  hidden: imageSearchState.results.length <= 0,
                  products: true,
                } }, imageSearchState.results.map((p) => {
                var _a;
                return (h("vviinn-product-card", { hidden: true, productTitle: p.title, productId: p.productId, brand: p.brand, deeplink: p.deeplink, price: p.price.actual, salePrice: p.price.sale, imageWidth: 160, image: (_a = p.image.thumbnail) !== null && _a !== void 0 ? _a : p.image.original, part: "product-card" }));
              }))))))));
  }
  static get is() { return "vviinn-vps-widget"; }
  static get encapsulation() { return "shadow"; }
  static get originalStyleUrls() { return {
    "$": ["vviinn-vps-widget.css"]
  }; }
  static get styleUrls() { return {
    "$": ["vviinn-vps-widget.css"]
  }; }
  static get properties() { return {
    "token": {
      "type": "string",
      "mutable": false,
      "complexType": {
        "original": "string | undefined",
        "resolved": "string",
        "references": {}
      },
      "required": false,
      "optional": false,
      "docs": {
        "tags": [],
        "text": "vviinn customer token"
      },
      "attribute": "token",
      "reflect": false
    },
    "apiPath": {
      "type": "string",
      "mutable": false,
      "complexType": {
        "original": "string | undefined",
        "resolved": "string",
        "references": {}
      },
      "required": false,
      "optional": false,
      "docs": {
        "tags": [{
            "text": undefined,
            "name": "internal"
          }],
        "text": ""
      },
      "attribute": "api-path",
      "reflect": false
    },
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
        "text": "When true modal window with widget will be shown"
      },
      "attribute": "active",
      "reflect": false,
      "defaultValue": "false"
    },
    "currencySign": {
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
        "text": "Currency sign will shown after price"
      },
      "attribute": "currency-sign",
      "reflect": false,
      "defaultValue": "\"\u20AC\""
    },
    "locale": {
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
        "text": "Locale for currency formatting"
      },
      "attribute": "locale",
      "reflect": false,
      "defaultValue": "\"de-DE\""
    }
  }; }
  static get states() { return {
    "slidePosition": {},
    "width": {},
    "wrongImageFormat": {}
  }; }
  static get elementRef() { return "el"; }
  static get watchers() { return [{
      "propName": "active",
      "methodName": "activeWatcher"
    }]; }
}
