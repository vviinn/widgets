import { r as registerInstance, h, f as Host, g as getElement } from './index-42e4cfd6.js';
import { d as state, i as imageSearchState } from './imageSearch.store-074cab22.js';
import { O as Option } from './number-98d54dd6.js';
import './Handler-47db9890.js';
import './NonEmptyArray-6ef0d207.js';
import './Array-4b9f84cf.js';

const vviinnVpsWidgetCss = ":host{--color-primary-system:#0F62FE;--color-primary-hover-system:#014CDA;--color-icons-system:#2F8EDF;--spacer:8px}:host{display:block}.hidden{visibility:hidden;height:1px}vviinn-overlayed-modal.first-screen::part(title),vviinn-overlayed-modal.first-screen::part(secondary-action){visibility:hidden}.start-page{display:grid;grid-template-columns:repeat(2, 1fr);min-height:580px}.start-page_block{align-content:start;border-right:1px solid #F4F4F4;display:grid;padding:48px}.start-page_block.error{align-content:center}#onboarding-block{border-right:unset;box-sizing:border-box;grid-gap:24px;overflow-y:auto;position:relative;width:100%}vviinn-teaser{margin-bottom:32px;margin-top:-24px}vviinn-image-selector{align-items:center;background:var(--color-primary, var(--color-primary-system));border-color:var(--color-primary, var(--color-primary-system));border-radius:2px;color:white;display:grid;font-size:16px;font-weight:600;height:56px;justify-items:center;margin-bottom:16px;transition:background 0.1s ease-in-out}vviinn-image-selector:hover{background:var(--color-primary-hover, var(--color-primary-hover-system));border-color:var(--color-primary-hover, var(--color-primary-hover-system))}vviinn-image-selector:active{border-color:black}.upload-button-content{display:grid;align-items:center;justify-items:start;justify-content:center;grid-template-columns:-webkit-max-content auto;grid-template-columns:max-content auto;grid-gap:16px}.results-page{display:grid;grid-template-columns:336px auto;box-sizing:border-box}.results-page>*{padding:24px;box-sizing:border-box}.products{align-content:center;align-items:start;box-sizing:border-box;display:grid;grid-gap:32px 16px;grid-template-columns:repeat(auto-fill, minmax(152px, 1fr));justify-items:center;padding:24px;padding-right:0;position:absolute;width:calc(100% - 16px)}.products.hidden{display:none}vviinn-empty-results{width:280px;align-self:center;justify-self:center}.products-wrapper{display:grid;overflow-y:auto;overflow-x:hidden;padding:unset;position:relative;width:100%}.image-wrapper{border-right:1px solid #F4F4F4;display:grid;grid-template-rows:-webkit-min-content 170px;grid-template-rows:min-content 170px;grid-gap:24px;min-width:100%}.onboarding-wrapper{position:absolute;width:100%;padding:48px;box-sizing:border-box;display:grid;grid-gap:64px;padding-bottom:24px}vviinn-product-card{gap:0;width:100%}vviinn-product-card::part(image){border:1px solid #eaeaea;margin-bottom:8px}search-filters span{display:none}search-filters::part(filter){background:#F4F4F4;border-radius:4px;border:1px solid #F4F4F4;box-sizing:border-box;color:#161616;font-size:14px;font-weight:600;line-height:20px}search-filters::part(show-more-filters){border:1px solid #f4f4f4;border-radius:4px;box-sizing:border-box;color:#161616;font-size:14px;font-weight:600;line-height:20px;padding:6px 16px}search-filters::part(show-more-filters):hover{background:#EAEAEA}search-filters::part(filter):hover{background:#EAEAEA}search-filters::part(filter):focus{outline:none;border:1px solid var(--color-primary, var(--color-primary-system))}search-filters::part(filter active){background:rgba(15, 98, 254, 0.15);color:var(--color-primary, var(--color-primary-system))}.filters-wrapper{overflow:auto}.results-page:not(.active){display:none}.nothing-found{display:grid;grid-gap:64px;justify-self:center;padding-top:64px;padding-bottom:16px;position:absolute;width:60%}@media (max-width: 768px){.start-page_block{padding:24px}.onboarding-wrapper{padding:24px}}@media (max-width: 640px){.start-page{grid-template-rows:-webkit-min-content;grid-template-rows:min-content;grid-template-columns:unset;grid-gap:48px;padding:24px 0 48px 0}}@media (max-width: 640px) and (min-width: 415px){.onboarding-wrapper{position:unset}#onboarding-block{overflow:unset}.start-page.active{height:1px;overflow:auto}}@media (max-width: 415px){.results-page>*{box-sizing:border-box;padding:24px}vviinn-slide{padding-bottom:48px}.start-page_block:last-of-type{border-right:unset;overflow-y:unset;position:static;box-sizing:border-box;width:unset}.start-page_block{padding:0 24px}vviinn-teaser{margin-top:24px}.onboarding-wrapper{position:static;width:unset;padding:unset;box-sizing:border-box}.results-page{grid-template-columns:unset;grid-template-rows:-webkit-min-content auto;grid-template-rows:min-content auto}.image{margin-bottom:8px}.image-wrapper{grid-template-rows:-webkit-min-content auto;grid-template-rows:min-content auto;width:100%}.products-wrapper{align-content:start;position:static;overflow-y:unset;width:100%;padding-top:0}.products{position:static;padding:0;width:unset;grid-gap:32px 16px;justify-content:center}.nothing-found{position:static;grid-gap:64px;padding:unset;align-content:start;width:unset}}@media (max-width: 320px){.products{grid-template-columns:unset}}vviinn-wrong-format,vviinn-server-error{width:280px;align-self:center;justify-self:center}";

let VviinnVpsWidget = class {
  constructor(hostRef) {
    registerInstance(this, hostRef);
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
    imageSearchState.image = Option.none;
    imageSearchState.imageUrl = Option.none;
    imageSearchState.imageBounds = Option.none;
    imageSearchState.searchArea = Option.none;
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
    return (h(Host, null, h("vviinn-overlayed-modal", { class: { "first-screen": this.slidePosition === 0 }, active: this.active, onSecondaryActionClicked: () => this.resetState(), onModalClosed: () => this.handleModalClose(), exportparts: "secondary-action, title, close-button" }, h("vviinn-slider", { showBullets: false, position: this.slidePosition }, h("vviinn-slide", { class: { "start-page": true } }, h("div", { class: {
        error: this.haveErrors(),
        "start-page_block": true,
      } }, h("vviinn-wrong-format", { class: { hidden: !this.wrongImageFormat }, onActionClick: () => (this.wrongImageFormat = false) }), h("vviinn-server-error", { class: { hidden: !imageSearchState.serverError }, onActionClick: () => (imageSearchState.serverError = false) }), h("vviinn-teaser", { class: { hidden: this.haveErrors() } }), h("vviinn-image-selector", { class: { hidden: this.haveErrors() }, onImageSelected: () => this.handleImageSelection(), onImageSelectedError: () => (this.wrongImageFormat = true), part: "select-image_button" }, h("span", { slot: "upload-button-text", class: "upload-button-content" }, h("svg", { xmlns: "http://www.w3.org/2000/svg", width: "29", height: "28", fill: "none" }, h("defs", null), h("path", { fill: "#fff", "fill-rule": "evenodd", d: "M10.271 3.89A.875.875 0 0111 3.5h7c.293 0 .566.146.728.39l1.49 2.235h3.033a2.625 2.625 0 012.625 2.625V21a2.625 2.625 0 01-2.625 2.625H5.75A2.625 2.625 0 013.125 21V8.75A2.625 2.625 0 015.75 6.125h3.031l1.49-2.235zm1.197 1.36l-1.49 2.235a.875.875 0 01-.729.39H5.75a.875.875 0 00-.875.875V21a.875.875 0 00.875.875h17.5a.875.875 0 00.875-.875V8.75a.875.875 0 00-.875-.875h-3.5a.875.875 0 01-.729-.39l-1.49-2.235h-6.063z", "clip-rule": "evenodd" }), h("path", { fill: "#fff", "fill-rule": "evenodd", d: "M14.5 11.375a3.062 3.062 0 100 6.125 3.062 3.062 0 000-6.125zm-4.813 3.063a4.812 4.812 0 119.625 0 4.812 4.812 0 01-9.625 0z", "clip-rule": "evenodd" })), h("span", null, "Kamera oder Bild ausw\u00E4hlen"))), h("vviinn-privacy-badge", { class: { hidden: this.haveErrors() } })), h("div", { id: "onboarding-block", class: "start-page_block" }, h("div", { class: "onboarding-wrapper" }, h("vviinn-onboarding", null), h("vviinn-example-images", { onImageSelected: () => this.handleImageSelection(), onImageSelectedError: () => this.resetScroll("onboarding-block", "smooth") })))), h("vviinn-slide", { class: { "results-page": true, active: this.slidePosition == 1 } }, h("div", { class: "image-wrapper" }, h("vviinn-image-view", null), h("div", { class: "filters-wrapper" }, h("div", { class: "filters" }, imageSearchState.filters.map((filter) => (h("search-filters", { filter: filter })))))), h("div", { id: "results-block", class: "products-wrapper" }, h("div", { class: { "nothing-found": true, hidden: imageSearchState.results.length > 0 } }, h("vviinn-empty-results", null), h("vviinn-onboarding", null)), h("div", { class: {
        hidden: imageSearchState.results.length <= 0,
        products: true,
      } }, imageSearchState.results.map((p) => {
      var _a;
      return (h("vviinn-product-card", { hidden: true, productTitle: p.title, productId: p.productId, brand: p.brand, deeplink: p.deeplink, price: p.price.actual, salePrice: p.price.sale, imageWidth: 160, image: (_a = p.image.thumbnail) !== null && _a !== void 0 ? _a : p.image.original, part: "product-card" }));
    }))))))));
  }
  get el() { return getElement(this); }
  static get watchers() { return {
    "active": ["activeWatcher"]
  }; }
};
VviinnVpsWidget.style = vviinnVpsWidgetCss;

export { VviinnVpsWidget as vviinn_vps_widget };
