import { Component, Host, h, Prop, State, Listen, Element, Event, } from "@stencil/core";
import { CameraIcon } from "../vviinn-icons";
import { SlotSkeleton } from "../customized-slots";
/**
 * @slot vviinn-onboarding-card-1-icon
 * @slot vviinn-onboarding-card-1-text
 * @slot vviinn-onboarding-card-2-icon
 * @slot vviinn-onboarding-card-2-text
 * @slot vviinn-onboarding-card-3-icon
 * @slot vviinn-onboarding-card-3-text
 * @slot vviinn-example-images-1
 * @slot vviinn-example-images-2
 * @slot vviinn-example-images-3
 * @slot vviinn-example-images-4
 *
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
export class VviinnVpsButton {
  constructor() {
    /** Currency sign will shown after price */
    this.currencySign = "€";
    /** Locale for currency formatting */
    this.locale = "de-DE";
    this.pressed = false;
  }
  handleModalClosed() {
    this.pressed = false;
  }
  componentDidLoad() {
    const slots = this.el.querySelectorAll("[slot]");
    this.globalSlotsChanged.emit(Array.from(slots));
  }
  handleKeyDown(ev) {
    if (ev.code !== "Enter" && ev.code !== "Space")
      return;
    this.pressed = true;
  }
  handleClick() {
    this.pressed = true;
  }
  render() {
    return (h(Host, { tabindex: "0", role: "button", pressed: this.pressed, onClick: () => this.handleClick(), onKeyDown: (ev) => this.handleKeyDown(ev) },
      h("slot", null,
        h(CameraIcon, null)),
      h(SlotSkeleton, null),
      h("vviinn-vps-widget", { active: this.pressed, "currency-sign": "\u20AC", token: this.token, locale: this.locale, apiPath: this.apiPath, exportparts: "brand, currency, deeplink, image, image-link, price-amount, price-container, price-outdated, price-prefix, price-regular, price-sale, title, product-card" })));
  }
  static get is() { return "vviinn-vps-button"; }
  static get encapsulation() { return "shadow"; }
  static get originalStyleUrls() { return {
    "$": ["vviinn-vps-button.css"]
  }; }
  static get styleUrls() { return {
    "$": ["vviinn-vps-button.css"]
  }; }
  static get properties() { return {
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
    }
  }; }
  static get states() { return {
    "pressed": {}
  }; }
  static get events() { return [{
      "method": "globalSlotsChanged",
      "name": "globalSlotsChanged",
      "bubbles": true,
      "cancelable": true,
      "composed": true,
      "docs": {
        "tags": [{
            "text": undefined,
            "name": "internal"
          }],
        "text": ""
      },
      "complexType": {
        "original": "any",
        "resolved": "any",
        "references": {}
      }
    }]; }
  static get elementRef() { return "el"; }
  static get listeners() { return [{
      "name": "modalClosed",
      "method": "handleModalClosed",
      "target": undefined,
      "capture": false,
      "passive": false
    }]; }
}
