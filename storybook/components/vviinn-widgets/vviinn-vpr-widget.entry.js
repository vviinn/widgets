import { r as registerInstance, h, f as Host, g as getElement } from './index-42e4cfd6.js';
import { _ as _function } from './NonEmptyArray-6ef0d207.js';
import { s as sequenceT, A as Apply, g as getApiPath, c as createInitGetRequest, f as fromEither, a as chainW, m as makeRequest, b as createInitPostRequest, d as state, T as TaskEither, E as Either, i as imageSearchState } from './imageSearch.store-074cab22.js';
import { p as pipe } from './Handler-47db9890.js';
import './number-98d54dd6.js';
import './Array-4b9f84cf.js';

const createBearerString = (x) => `Bearer ${x}`;
const createAuthedHeader = (x) => new Headers({
  Authorization: x,
});
const createFetchAuthOptions = (x) => {
  return {
    headers: x,
  };
};
const createBearAuthedHeader = _function.flow(createBearerString, createAuthedHeader, createFetchAuthOptions);

const isVPR = (c) => c._tag === "VPR";
const isVCS = (c) => c._tag === "VCS";
function fold(onVPR, onVCS) {
  return (c) => (isVPR(c) ? onVPR() : onVCS());
}
function fromString(s) {
  return s === "VPR" ? { _tag: "VPR" } : { _tag: "VCS" };
}

const sequenceToEither = sequenceT(Apply);
const apiGet = (path, data = {}) => pipe(sequenceToEither(getApiPath(), createInitGetRequest), fromEither, chainW(makeRequest(path, data)));
const apiPost = (path, data = {}) => pipe(sequenceToEither(getApiPath(), createInitPostRequest), fromEither, chainW(makeRequest(path, data)));

const getVPRRecommendations = (productId) => (options) => {
  const url = `product/${productId}/similar-products`;
  return apiGet(url, options);
};

const getVCSRecommendations = (productId) => (options) => {
  const url = `product/${productId}/cross-selling-products`;
  return apiGet(url, options);
};

const getRecommendationsService = (campaignType) => _function.pipe(fromString(campaignType), fold(() => getVPRRecommendations, () => getVCSRecommendations));

const vviinnVprWidgetCss = ":host{display:grid;grid-gap:1rem;width:100%}:host(:not(.loaded)){position:absolute;visibility:hidden}.results{display:grid;grid-gap:1rem}.results[data-mode=\"grid\"]{grid-template-columns:repeat(var(--columns), var(--column-width))}.results[data-mode=\"auto\"]{grid-template-columns:repeat(auto-fill, var(--column-width))}.visually-hidden{position:absolute;top:0;left:0;z-index:-1;height:0;width:0}::part(shadow-parts-detect){height:10px!important;width:10px!important}";

let VviinnVprWidget = class {
  constructor(hostRef) {
    registerInstance(this, hostRef);
    /** Title for recommendations widget */
    this.blockTitle = "Recommended products";
    /** Ratio of each recommended product image */
    this.imageRatio = 1;
    /** Width of each recommended product image */
    this.imageWidth = 150;
    /** Currency sign will shown after price */
    this.currencySign = "€";
    /** Use slider or grid view */
    this.sliderMode = false;
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
    const request = _function.pipe(TaskEither.of(getRecommendationsService(this.campaignType)), TaskEither.ap(TaskEither.of(this.productId)), TaskEither.ap(TaskEither.of(headers)), TaskEither.flatten);
    const runRequest = await request();
    _function.pipe(runRequest, Either.fold((error) => this.handleError(error), (data) => this.handleRecommendationsSucces(data)));
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
    return (h(Host, { class: { loaded: this.loaded, empty: this.recommendations.length == 0 }, "aria-hidden": this.loaded ? "false" : "true" }, h("style", null, state.fallbackStyles), h("h2", { part: "recommendations-title" }, this.blockTitle), h("vviinn-carousel", { exportparts: "brand, currency, deeplink, image, type, image-link, price-amount, price-container, price-outdated, price-prefix, price-regular, price-sale, title, title: product-title", mode: this.sliderMode ? "classic" : "modern", imageWidth: this.imageWidth, showScroll: this.showScroll }, this.recommendations.map((r) => (h("vviinn-product-card", { productTitle: r.title, image: r.image.thumbnail, brand: r.brand, imageWidth: this.imageWidth, imageRatio: this.imageRatio, price: r.price.actual, salePrice: r.price.sale, responsive: this.sliderMode }))))));
  }
  get el() { return getElement(this); }
  static get watchers() { return {
    "productId": ["handleProductIdChange"]
  }; }
};
VviinnVprWidget.style = vviinnVprWidgetCss;

export { VviinnVprWidget as vviinn_vpr_widget };
