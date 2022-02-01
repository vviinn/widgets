import { Component, Host, h, Prop, Event, Element, State } from "@stencil/core";
import { pipe } from "fp-ts/lib/function";
import { getAnalyticsModule } from "../../analytics/GeneralAnalytics";
import { state } from "../../store/store";
import * as O from "fp-ts/lib/Option";
import { imageSearchState } from "../../store/imageSearch.store";
import { Linked, Price, ResponsiveImage, Image } from "./render-helpers";
/**
 * @part brand - product brand.
 * @part currency - currency sign. Renders after price-amount.
 * @part deeplink - anchor element for title. Rendered only if "deeplink" property filled.
 * @part image - product image.
 * @part image-link - anchor element for image. Rendered only if "deeplink" property filled.
 * @part price-amount - numeric part of price.
 * @part price-container - block contains all prices.
 * @part price-outdated - renders inside price-container when "sale-price" property filled. Contains regular price.
 * @part price-prefix - renders before price-amount. Can be set with "price-prefix" property or inherited from parent component.
 * @part price-regular - renders inside price-container when "sale-price" property is empty.
 * @part price-sale - renders inside price-container when "sale-price" property filled. Contains sale price.
 * @part title - product title
 */
export class VviinnProductCard {
  constructor() {
    this.currency = undefined;
    this.imageRatio = 1;
    this.imageWidth = 200;
    this.locale = undefined;
    this.pricePrefix = undefined;
    this.responsive = false;
    this.imageLoaded = false;
    this.intersectionObserver = new IntersectionObserver(this.intersectionCallback.bind(this), { threshold: 1.0 });
  }
  intersectionCallback(data) {
    if (data.some((entry) => entry.isIntersecting)) {
      pipe(getAnalyticsModule, O.map((analytics) => analytics.sendImpression(this.getProduct())));
      this.recommendationView.emit(this.productId);
      this.intersectionObserver.disconnect();
    }
  }
  componentDidLoad() {
    this.recommendationLoad.emit(this.productId);
    this.intersectionObserver.observe(this.el);
    const links = this.el.shadowRoot.querySelectorAll("a");
    links.forEach((link) => link.addEventListener("mousedown", (event) => {
      this.recommendationClick.emit(this.productId);
      if (window.ga) {
        event.preventDefault();
      }
      pipe(getAnalyticsModule, O.match(() => null, (analytics) => analytics.sendClick(this.getProduct())));
      if (window.ga) {
        ga("send", "event", "UX", "click", "Results", {
          hitCallback: function () {
            document.location.href = this.deeplink;
          },
        });
      }
    }));
  }
  getProduct() {
    return imageSearchState.results.find((r) => r.productId === this.productId);
  }
  renderImage() {
    const props = {
      width: this.imageWidth,
      height: this.imageWidth * this.imageRatio,
      src: this.image,
      title: this.productTitle
    };
    return this.responsive ? ResponsiveImage(props) : Image(props);
  }
  render() {
    var _a, _b, _c;
    return (h(Host, { exportparts: "brand, currency, deeplink, image, type, image-link, price-amount, price-container, price-outdated, price-prefix, price-regular, price-sale, title" },
      h(Linked, { deeplink: this.deeplink, part: "image-link" }, this.renderImage()),
      h(Linked, { deeplink: this.deeplink, part: "deeplink" },
        h("span", { class: "title", part: "title" }, this.productTitle)),
      h("span", { class: "brand", part: "brand" }, this.brand),
      h("span", { class: "type", part: "type" }, this.productType),
      h(Price, { prefix: (_a = this.pricePrefix) !== null && _a !== void 0 ? _a : state.pricePrefix, currency: (_b = this.currency) !== null && _b !== void 0 ? _b : state.currencySign, price: this.price, salePrice: this.salePrice, locale: (_c = this.locale) !== null && _c !== void 0 ? _c : state.locale })));
  }
  static get is() { return "vviinn-product-card"; }
  static get encapsulation() { return "shadow"; }
  static get originalStyleUrls() { return {
    "$": ["vviinn-product-card.css"]
  }; }
  static get styleUrls() { return {
    "$": ["vviinn-product-card.css"]
  }; }
  static get properties() { return {
    "brand": {
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
        "text": ""
      },
      "attribute": "brand",
      "reflect": false
    },
    "currency": {
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
        "text": ""
      },
      "attribute": "currency",
      "reflect": false,
      "defaultValue": "undefined"
    },
    "deeplink": {
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
        "text": ""
      },
      "attribute": "deeplink",
      "reflect": false
    },
    "image": {
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
        "text": ""
      },
      "attribute": "image",
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
        "text": ""
      },
      "attribute": "image-width",
      "reflect": false,
      "defaultValue": "200"
    },
    "locale": {
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
        "text": ""
      },
      "attribute": "locale",
      "reflect": false,
      "defaultValue": "undefined"
    },
    "price": {
      "type": "number",
      "mutable": false,
      "complexType": {
        "original": "number | undefined",
        "resolved": "number",
        "references": {}
      },
      "required": false,
      "optional": false,
      "docs": {
        "tags": [],
        "text": ""
      },
      "attribute": "price",
      "reflect": false
    },
    "pricePrefix": {
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
        "text": ""
      },
      "attribute": "price-prefix",
      "reflect": false,
      "defaultValue": "undefined"
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
        "text": ""
      },
      "attribute": "product-id",
      "reflect": false
    },
    "productTitle": {
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
        "text": ""
      },
      "attribute": "product-title",
      "reflect": false
    },
    "productType": {
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
        "text": ""
      },
      "attribute": "product-type",
      "reflect": false
    },
    "salePrice": {
      "type": "number",
      "mutable": false,
      "complexType": {
        "original": "number | undefined",
        "resolved": "number",
        "references": {}
      },
      "required": false,
      "optional": false,
      "docs": {
        "tags": [],
        "text": ""
      },
      "attribute": "sale-price",
      "reflect": false
    },
    "responsive": {
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
      "attribute": "responsive",
      "reflect": false,
      "defaultValue": "false"
    }
  }; }
  static get states() { return {
    "imageLoaded": {}
  }; }
  static get events() { return [{
      "method": "recommendationLoad",
      "name": "recommendationLoad",
      "bubbles": true,
      "cancelable": true,
      "composed": true,
      "docs": {
        "tags": [],
        "text": "Event fires ones when recommendation rendered on page"
      },
      "complexType": {
        "original": "string",
        "resolved": "string",
        "references": {}
      }
    }, {
      "method": "recommendationView",
      "name": "recommendationView",
      "bubbles": true,
      "cancelable": true,
      "composed": true,
      "docs": {
        "tags": [],
        "text": "Event fires ones when recommendation appears on the viewport"
      },
      "complexType": {
        "original": "string",
        "resolved": "string",
        "references": {}
      }
    }, {
      "method": "recommendationClick",
      "name": "recommendationClick",
      "bubbles": true,
      "cancelable": true,
      "composed": true,
      "docs": {
        "tags": [],
        "text": "Event fires ones when user click on deeplink"
      },
      "complexType": {
        "original": "string",
        "resolved": "string",
        "references": {}
      }
    }]; }
  static get elementRef() { return "el"; }
}
