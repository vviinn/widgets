import { Component, Host, h, Prop, State, Element, Watch, } from "@stencil/core";
import { pipe } from "fp-ts/lib/function";
import * as TE from "fp-ts/lib/TaskEither";
import * as E from "fp-ts/lib/Either";
import { createBearAuthedHeader } from "./token-helpers";
import state from "../../store/store";
import { getRecommendationsService } from "../../campaign/CampaignService";
import { imageSearchState } from "../../store/imageSearch.store";
export class VviinnVprWidget {
  constructor() {
    /** Title for recommendations widget */
    this.blockTitle = "Recommended products";
    /** Ratio of each recommended product image */
    this.imageRatio = 1;
    /** Width of each recommended product image */
    this.imageWidth = 300;
    /** Currency sign will shown after price */
    this.currencySign = "€";
    /** Use slider or grid view */
    this.mode = "modern";
    /** Campaign type */
    this.campaignType = "VPR";
    /** Locale for currency formatting */
    this.locale = "de-DE";
    this.showScroll = true;
    this.recommendations = [];
    this.loaded = false;
  }
  handleProductIdChange() {
    this.getRecommendations();
  }
  connectedCallback() {
    state.apiPath = this.apiPath;
    state.currencySign = this.currencySign;
    state.locale = this.locale;
  }
  async componentWillLoad() {
    state.pricePrefix = this.pricePrefix;
    state.currencySign = this.currencySign;
    this.getRecommendations();
  }
  async getRecommendations() {
    if (this.productId === undefined || this.token === undefined)
      return;
    const headers = createBearAuthedHeader(this.token);
    const request = pipe(TE.of(getRecommendationsService(this.campaignType)), TE.ap(TE.of(this.productId)), TE.ap(TE.of(headers)), TE.flatten);
    const runRequest = await request();
    pipe(runRequest, E.fold((error) => this.handleError(error), (data) => this.handleRecommendationsSucces(data)));
  }
  handleError(error) {
    console.log("ERROR:", error);
  }
  handleRecommendationsSucces(data) {
    var _a;
    this.recommendations = (_a = data === null || data === void 0 ? void 0 : data.extended) !== null && _a !== void 0 ? _a : data;
    imageSearchState.results = this.recommendations;
    this.loaded = true;
  }
  render() {
    return (h(Host, { class: { loaded: this.loaded, empty: this.recommendations.length == 0, [this.mode]: true }, "aria-hidden": this.loaded ? "false" : "true" },
      h("style", null, state.fallbackStyles),
      h("h2", { part: "recommendations-title" }, this.blockTitle),
      h("vviinn-carousel", { exportparts: "brand, currency, deeplink, image, type, image-link, price-amount, price-container, price-outdated, price-prefix, price-regular, price-sale, title, title: product-title", mode: this.mode, imageWidth: this.imageWidth, showScroll: this.showScroll }, this.recommendations.map((r) => (h("vviinn-product-card", { productTitle: r.title, image: r.image.thumbnail, brand: r.brand, imageWidth: this.imageWidth, imageRatio: this.imageRatio, price: r.price.actual, salePrice: r.price.sale, responsive: this.mode === "classic" }))))));
  }
  static get is() { return "vviinn-vpr-widget"; }
  static get encapsulation() { return "shadow"; }
  static get originalStyleUrls() { return {
    "$": ["vviinn-vpr-widget.css"]
  }; }
  static get styleUrls() { return {
    "$": ["vviinn-vpr-widget.css"]
  }; }
  static get properties() { return {
    "blockTitle": {
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
        "text": "Title for recommendations widget"
      },
      "attribute": "block-title",
      "reflect": false,
      "defaultValue": "\"Recommended products\""
    },
    "columns": {
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
        "text": "Number of columns for recommendations"
      },
      "attribute": "columns",
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
        "text": "Ratio of each recommended product image"
      },
      "attribute": "image-ratio",
      "reflect": false,
      "defaultValue": "1"
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
        "text": "Width of each recommended product image"
      },
      "attribute": "image-width",
      "reflect": false,
      "defaultValue": "300"
    },
    "productId": {
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
        "text": "Id of product you need recommendations for"
      },
      "attribute": "product-id",
      "reflect": false
    },
    "token": {
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
        "text": "vviinn customer token"
      },
      "attribute": "token",
      "reflect": false
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
    "pricePrefix": {
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
        "text": "prefix will shown before price"
      },
      "attribute": "price-prefix",
      "reflect": false
    },
    "mode": {
      "type": "string",
      "mutable": false,
      "complexType": {
        "original": "\"classic\" | \"modern\"",
        "resolved": "\"classic\" | \"modern\"",
        "references": {}
      },
      "required": false,
      "optional": false,
      "docs": {
        "tags": [],
        "text": "Use slider or grid view"
      },
      "attribute": "mode",
      "reflect": false,
      "defaultValue": "\"modern\""
    },
    "campaignType": {
      "type": "string",
      "mutable": false,
      "complexType": {
        "original": "CampaignName",
        "resolved": "\"VPR\" | \"VSC\"",
        "references": {
          "CampaignName": {
            "location": "import",
            "path": "../../campaign/Campaign"
          }
        }
      },
      "required": false,
      "optional": false,
      "docs": {
        "tags": [],
        "text": "Campaign type"
      },
      "attribute": "campaign-type",
      "reflect": false,
      "defaultValue": "\"VPR\""
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
    "showScroll": {
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
      "attribute": "show-scroll",
      "reflect": false,
      "defaultValue": "true"
    }
  }; }
  static get states() { return {
    "recommendations": {},
    "loaded": {}
  }; }
  static get elementRef() { return "el"; }
  static get watchers() { return [{
      "propName": "productId",
      "methodName": "handleProductIdChange"
    }]; }
}
