'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

const index = require('./index-e4714cef.js');
const imageSearch_store = require('./imageSearch.store-f6f89b7b.js');
require('./Handler-d1a8a86a.js');

const vviinnVpsWidgetCss = ":host{--color-primary-system:#0F62FE;--color-primary-hover-system:#014CDA;--color-icons-system:#2F8EDF;--spacer:8px}:host{display:block}.hidden{visibility:hidden;height:1px}vviinn-overlayed-modal.first-screen::part(title),vviinn-overlayed-modal.first-screen::part(secondary-action){visibility:hidden}.start-page{display:grid;grid-template-columns:repeat(2, 1fr);min-height:580px}.start-page_block{align-content:start;border-right:1px solid #F4F4F4;display:grid;padding:48px}.start-page_block.error{align-content:center}#onboarding-block{border-right:unset;box-sizing:border-box;grid-gap:24px;overflow-y:auto;position:relative;width:100%}vviinn-teaser{margin-bottom:32px;margin-top:-24px}vviinn-image-selector{align-items:center;background:var(--color-primary, var(--color-primary-system));border-color:var(--color-primary, var(--color-primary-system));border-radius:2px;color:white;display:grid;font-size:16px;font-weight:600;height:56px;justify-items:center;margin-bottom:16px;transition:background 0.1s ease-in-out}vviinn-image-selector:hover{background:var(--color-primary-hover, var(--color-primary-hover-system));border-color:var(--color-primary-hover, var(--color-primary-hover-system))}vviinn-image-selector:active{border-color:black}.upload-button-content{display:grid;align-items:center;justify-items:start;justify-content:center;grid-template-columns:-webkit-max-content auto;grid-template-columns:max-content auto;grid-gap:16px}.results-page{display:grid;grid-template-columns:336px auto;box-sizing:border-box}.results-page>*{padding:24px;box-sizing:border-box}.products{align-content:center;align-items:start;box-sizing:border-box;display:grid;grid-gap:32px 16px;grid-template-columns:repeat(auto-fill, minmax(152px, 1fr));justify-items:center;padding:24px;padding-right:0;position:absolute;width:calc(100% - 16px)}.products.hidden{display:none}vviinn-empty-results{width:280px;align-self:center;justify-self:center}.products-wrapper{display:grid;overflow-y:auto;overflow-x:hidden;padding:unset;position:relative;width:100%}.image-wrapper{border-right:1px solid #F4F4F4;display:grid;grid-template-rows:-webkit-min-content 170px;grid-template-rows:min-content 170px;grid-gap:24px;min-width:100%}.onboarding-wrapper{position:absolute;width:100%;padding:48px;box-sizing:border-box;display:grid;grid-gap:64px;padding-bottom:24px}vviinn-product-card{gap:0;width:100%}vviinn-product-card::part(image){border:1px solid #eaeaea;margin-bottom:8px}search-filters span{display:none}search-filters::part(filter){background:#F4F4F4;border-radius:4px;border:1px solid #F4F4F4;box-sizing:border-box;color:#161616;font-size:14px;font-weight:600;line-height:20px}search-filters::part(show-more-filters){border:1px solid #f4f4f4;border-radius:4px;box-sizing:border-box;color:#161616;font-size:14px;font-weight:600;line-height:20px;padding:6px 16px}search-filters::part(show-more-filters):hover{background:#EAEAEA}search-filters::part(filter):hover{background:#EAEAEA}search-filters::part(filter):focus{outline:none;border:1px solid var(--color-primary, var(--color-primary-system))}search-filters::part(filter active){background:rgba(15, 98, 254, 0.15);color:var(--color-primary, var(--color-primary-system))}.filters-wrapper{overflow:auto}.results-page:not(.active){display:none}.nothing-found{display:grid;grid-gap:64px;justify-self:center;padding-top:64px;padding-bottom:16px;position:absolute;width:60%}@media (max-width: 768px){.start-page_block{padding:24px}.onboarding-wrapper{padding:24px}}@media (max-width: 640px){.start-page{grid-template-rows:-webkit-min-content;grid-template-rows:min-content;grid-template-columns:unset;grid-gap:48px;padding:24px 0 48px 0}}@media (max-width: 640px) and (min-width: 415px){.onboarding-wrapper{position:unset}#onboarding-block{overflow:unset}.start-page.active{height:1px;overflow:auto}}@media (max-width: 415px){.results-page>*{box-sizing:border-box;padding:24px}vviinn-slide{padding-bottom:48px}.start-page_block:last-of-type{border-right:unset;overflow-y:unset;position:static;box-sizing:border-box;width:unset}.start-page_block{padding:0 24px}vviinn-teaser{margin-top:24px}.onboarding-wrapper{position:static;width:unset;padding:unset;box-sizing:border-box}.results-page{grid-template-columns:unset;grid-template-rows:-webkit-min-content auto;grid-template-rows:min-content auto}.image{margin-bottom:8px}.image-wrapper{grid-template-rows:-webkit-min-content auto;grid-template-rows:min-content auto;width:100%}.products-wrapper{align-content:start;position:static;overflow-y:unset;width:100%;padding-top:0}.products{position:static;padding:0;width:unset;grid-gap:32px 16px;justify-content:center}.nothing-found{position:static;grid-gap:64px;padding:unset;align-content:start;width:unset}}@media (max-width: 320px){.products{grid-template-columns:unset}}vviinn-wrong-format,vviinn-server-error{width:280px;align-self:center;justify-self:center}";

let VviinnVpsWidget = class {
  constructor(hostRef) {
    index.registerInstance(this, hostRef);
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
    imageSearch_store.state$1.apiPath = this.apiPath;
    imageSearch_store.state$1.currencySign = this.currencySign;
    imageSearch_store.state$1.locale = this.locale;
    imageSearch_store.imageSearchState.token = this.token;
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
    imageSearch_store.imageSearchState.image = imageSearch_store.Option.none;
    imageSearch_store.imageSearchState.imageUrl = imageSearch_store.Option.none;
    imageSearch_store.imageSearchState.imageBounds = imageSearch_store.Option.none;
    imageSearch_store.imageSearchState.searchArea = imageSearch_store.Option.none;
    imageSearch_store.imageSearchState.results = [];
    imageSearch_store.imageSearchState.filters = [];
    imageSearch_store.imageSearchState.detectedObjects = [];
    imageSearch_store.imageSearchState.activeIonLink = undefined;
    imageSearch_store.imageSearchState.rectangleSearchForm = undefined;
    this.resetScroll("results-block");
  }
  haveErrors() {
    return this.wrongImageFormat || imageSearch_store.imageSearchState.serverError;
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
    return (index.h(index.Host, null, index.h("vviinn-overlayed-modal", { class: { "first-screen": this.slidePosition === 0 }, active: this.active, onSecondaryActionClicked: () => this.resetState(), onModalClosed: () => this.handleModalClose(), exportparts: "secondary-action, title, close-button" }, index.h("vviinn-slider", { showBullets: false, position: this.slidePosition }, index.h("vviinn-slide", { class: { "start-page": true } }, index.h("div", { class: {
        error: this.haveErrors(),
        "start-page_block": true,
      } }, index.h("vviinn-wrong-format", { class: { hidden: !this.wrongImageFormat }, onActionClick: () => (this.wrongImageFormat = false) }), index.h("vviinn-server-error", { class: { hidden: !imageSearch_store.imageSearchState.serverError }, onActionClick: () => (imageSearch_store.imageSearchState.serverError = false) }), index.h("vviinn-teaser", { class: { hidden: this.haveErrors() } }), index.h("vviinn-image-selector", { class: { hidden: this.haveErrors() }, onImageSelected: () => this.handleImageSelection(), onImageSelectedError: () => (this.wrongImageFormat = true), part: "select-image_button" }, index.h("span", { slot: "upload-button-text", class: "upload-button-content" }, index.h("svg", { xmlns: "http://www.w3.org/2000/svg", width: "29", height: "28", fill: "none" }, index.h("defs", null), index.h("path", { fill: "#fff", "fill-rule": "evenodd", d: "M10.271 3.89A.875.875 0 0111 3.5h7c.293 0 .566.146.728.39l1.49 2.235h3.033a2.625 2.625 0 012.625 2.625V21a2.625 2.625 0 01-2.625 2.625H5.75A2.625 2.625 0 013.125 21V8.75A2.625 2.625 0 015.75 6.125h3.031l1.49-2.235zm1.197 1.36l-1.49 2.235a.875.875 0 01-.729.39H5.75a.875.875 0 00-.875.875V21a.875.875 0 00.875.875h17.5a.875.875 0 00.875-.875V8.75a.875.875 0 00-.875-.875h-3.5a.875.875 0 01-.729-.39l-1.49-2.235h-6.063z", "clip-rule": "evenodd" }), index.h("path", { fill: "#fff", "fill-rule": "evenodd", d: "M14.5 11.375a3.062 3.062 0 100 6.125 3.062 3.062 0 000-6.125zm-4.813 3.063a4.812 4.812 0 119.625 0 4.812 4.812 0 01-9.625 0z", "clip-rule": "evenodd" })), index.h("span", null, "Kamera oder Bild ausw\u00E4hlen"))), index.h("vviinn-privacy-badge", { class: { hidden: this.haveErrors() } })), index.h("div", { id: "onboarding-block", class: "start-page_block" }, index.h("div", { class: "onboarding-wrapper" }, index.h("vviinn-onboarding", null), index.h("vviinn-example-images", { onImageSelected: () => this.handleImageSelection(), onImageSelectedError: () => this.resetScroll("onboarding-block", "smooth") })))), index.h("vviinn-slide", { class: { "results-page": true, active: this.slidePosition == 1 } }, index.h("div", { class: "image-wrapper" }, index.h("vviinn-image-view", null), index.h("div", { class: "filters-wrapper" }, index.h("div", { class: "filters" }, imageSearch_store.imageSearchState.filters.map((filter) => (index.h("search-filters", { filter: filter })))))), index.h("div", { id: "results-block", class: "products-wrapper" }, index.h("div", { class: { "nothing-found": true, hidden: imageSearch_store.imageSearchState.results.length > 0 } }, index.h("vviinn-empty-results", null), index.h("vviinn-onboarding", null)), index.h("div", { class: {
        hidden: imageSearch_store.imageSearchState.results.length <= 0,
        products: true,
      } }, imageSearch_store.imageSearchState.results.map((p) => {
      var _a;
      return (index.h("vviinn-product-card", { hidden: true, productTitle: p.title, productId: p.productId, brand: p.brand, deeplink: p.deeplink, price: p.price.actual, salePrice: p.price.sale, imageWidth: 160, image: (_a = p.image.thumbnail) !== null && _a !== void 0 ? _a : p.image.original, part: "product-card" }));
    }))))))));
  }
  get el() { return index.getElement(this); }
  static get watchers() { return {
    "active": ["activeWatcher"]
  }; }
};
VviinnVpsWidget.style = vviinnVpsWidgetCss;

exports.vviinn_vps_widget = VviinnVpsWidget;
