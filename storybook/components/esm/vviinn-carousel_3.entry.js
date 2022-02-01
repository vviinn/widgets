import { r as registerInstance, h, H as Host, g as getElement, c as createEvent } from './index-d92b0799.js';
import { _ as _Array, O as Option, S as Semigroup, a as _function, E as Either, i as imageSearchState, s as state, c as chainW, m as makeRequest, f as fromEither, g as getApiPath, b as createInitGetRequest, d as sequenceT, A as Apply, e as state$1, T as TaskEither } from './imageSearch.store-0d870770.js';
import { C as ChevronIcon } from './index-ba7b7672.js';
import { p as pipe } from './Handler-639a4cb3.js';

const vviinnCarouselCss = ":host{--vviinn-progressbar-width:0;--vviinn-carousel-item-width:150px;--vviinn-carousel-columns:4;--vviinn-carousel-image-width-system:140px}.body{display:flex;position:relative;width:var(--vviinn-carousel-content-width);flex-direction:column}.content-wrapper *{box-sizing:border-box}.content-wrapper{overflow-y:hidden;overflow-x:auto;flex-grow:1}.bullets{margin-top:16px;display:flex;flex-direction:row;grid-gap:24px;justify-content:center}.bullet{width:10px;height:10px;background:#E0E0E0;border-radius:50%}.bullet.active{background:#161616}:host(:not(.show-scrollbar)) .content{-ms-overflow-style:none;scrollbar-width:none}@media (max-width: 480px){:host(.modern) button{display:none}}.content{display:flex;flex-direction:row;grid-gap:8px;-ms-scroll-snap-type:x mandatory;scroll-snap-type:x mandatory;overflow-y:hidden;overflow-x:auto;flex-grow:1}.content.left>*{scroll-snap-align:start}.content.right>*{scroll-snap-align:end}:host(.modern) button{border-radius:2px}:host(.classic) button{border-radius:50%}button{align-items:center;background-color:white;border:none;box-shadow:0px 2px 6px rgba(0, 0, 0, 0.15);cursor:pointer;display:grid;height:40px;justify-items:center;position:absolute;top:calc(50% - 20px);width:40px;z-index:1;padding:0;margin:0}button.prev svg{transform:rotate(180deg);margin-left:-5px}.prev{left:0}.next{right:0}.items-group{display:grid;min-width:100%;grid-template-columns:repeat(auto-fit, minmax(var(--vviinn-carousel-image-width, --vviinn-carousel-image-width-system), 1fr));align-items:center;justify-items:center;grid-gap:16px}.items-group.incomplete{grid-template-columns:repeat(auto-fill, minmax(var(--vviinn-carousel-image-width, --vviinn-carousel-image-width-system), 1fr))}vviinn-product-card::part(price-container){text-align:center}";

const COLUMNS_NUMBER_CSS_VAR = "--vviinn-carousel-columns";
const CAROUSEL_WIDTH_CSS_VAR = "--vviinn-carousel-content-width";
const CAROUSEL_IMAGE_WIDTH_CSS_VAR = "--vviinn-carousel-image-width";
const CONTENT_GROUP_CSS_CLASS = "items-group";
const INCOMPLETE_GROUP_CSS_CLASS = "incomplete";
let VviinnCarousel = class {
  constructor(hostRef) {
    registerInstance(this, hostRef);
    this.moveDirection = "right";
    this.contentGroups = [];
    this.activeContentGroup = 0;
    this.mode = "modern";
    this.imageWidth = 140;
    this.showScroll = true;
    this.content = [];
    this.isContentClonned = false;
    this.resizeObserver = new ResizeObserver(() => this.handleResize());
  }
  connectedCallback() {
    this.el.style.setProperty(CAROUSEL_IMAGE_WIDTH_CSS_VAR, `${this.imageWidth}px`);
  }
  disconnectedCallback() {
    this.resizeObserver.unobserve(this.el.offsetParent);
  }
  componentDidRender() {
    this.setWidth();
    this.processScrollbarWidth();
  }
  getContentClassMap() {
    return {
      content: true,
      [this.moveDirection]: true,
      [this.mode]: true,
    };
  }
  handleResize() {
    this.setWidth();
    this.processScrollbarWidth();
  }
  calculateMoveStep() {
    const contentWidths = this.getContent().map((el) => el.getBoundingClientRect().width);
    const sum = contentWidths.reduce((acc, val) => acc + val, 0);
    return sum / contentWidths.length;
  }
  setWidth() {
    const parent = this.el.offsetParent;
    if (!parent)
      return;
    const parentStyles = getComputedStyle(parent);
    const parentWidth = parent.getBoundingClientRect().width;
    const width = parentWidth -
      (parseInt(parentStyles["padding-right"]) +
        parseInt(parentStyles["padding-left"]));
    this.el.style.setProperty(CAROUSEL_WIDTH_CSS_VAR, `${width}px`);
  }
  cloneSlottedContent(event) {
    if (this.isContentClonned)
      return;
    const slot = event.target;
    this.content = slot.assignedElements();
    this.isContentClonned = true;
    this.renderContent();
    this.setWidth();
    this.resizeObserver.observe(this.el.offsetParent);
  }
  renderContent() {
    const c = this.mode === "classic"
      ? _Array.chunksOf(this.getColumnsNumber())(this.content)
      : this.content.reduce((fragment, element) => {
        fragment.append(element);
        return fragment;
      }, new DocumentFragment());
    this.mode === "classic" ? this.renderGroup(c) : this.renderLine(c);
  }
  renderGroup(content) {
    const columnsNumber = this.getColumnsNumber();
    const groups = content.map((el) => {
      const container = document.createElement("div");
      const groupClassNames = el.length < columnsNumber
        ? [CONTENT_GROUP_CSS_CLASS, INCOMPLETE_GROUP_CSS_CLASS]
        : [CONTENT_GROUP_CSS_CLASS];
      container.classList.add(...groupClassNames);
      return el.reduce((acc, el) => {
        acc.append(el);
        return acc;
      }, container);
    });
    const combinedElements = groups.reduce((fragment, element) => {
      fragment.append(element);
      return fragment;
    }, new DocumentFragment());
    this.appendToContent(combinedElements);
    this.contentGroups = this.getContentGroups();
  }
  renderLine(item) {
    this.appendToContent(item);
  }
  getActiveGroupIndex() {
    var _a, _b;
    const contentNodeLeft = (_b = (_a = this.getContentNode()) === null || _a === void 0 ? void 0 : _a.getBoundingClientRect()) === null || _b === void 0 ? void 0 : _b.left;
    if (!contentNodeLeft)
      return 0;
    const groups = this.getContentGroups();
    const groupsPositions = groups.map((g) => g.getBoundingClientRect().left);
    const indexedPositions = groupsPositions
      .map((value, index) => [value, index])
      .filter((x) => x[0] >= 0);
    return indexedPositions.length > 0 ? indexedPositions[0][1] : 0;
  }
  getContentNode() {
    return this.el.shadowRoot.querySelector(".content");
  }
  getContent() {
    const children = this.getContentNode().children;
    return Array.from(children).map((c) => c);
  }
  getColumnsNumber() {
    const styleSheet = getComputedStyle(this.el);
    const columnsInCss = styleSheet.getPropertyValue(COLUMNS_NUMBER_CSS_VAR);
    return parseInt(columnsInCss);
  }
  getContentGroups() {
    return Array.from(this.el.shadowRoot.querySelectorAll(`.${CONTENT_GROUP_CSS_CLASS}`));
  }
  appendToContent(content) {
    const contentNode = this.getContentNode();
    contentNode.append(content);
  }
  showNext() {
    this.moveDirection = "right";
    const contentContainer = this.getContentNode();
    requestAnimationFrame(() => {
      contentContainer.scrollTo({
        top: 0,
        left: contentContainer.scrollLeft + this.calculateMoveStep(),
        behavior: "smooth",
      });
    });
  }
  showPrev() {
    this.moveDirection = "left";
    const contentContainer = this.getContentNode();
    requestAnimationFrame(() => {
      contentContainer.scrollTo({
        top: 0,
        left: contentContainer.scrollLeft - this.calculateMoveStep(),
        behavior: "smooth",
      });
    });
  }
  processScrollbarWidth() {
    const target = this.getContentNode();
    const scrollRatio = (target.scrollLeft + target.clientWidth) / target.scrollWidth;
    const scrolledWidth = target.clientWidth * scrollRatio;
    this.el.style.setProperty("--vviinn-progressbar-width", `${scrolledWidth}px`);
    this.activeContentGroup = this.getActiveGroupIndex();
  }
  showBullets() {
    return this.mode === "classic" && this.showScroll;
  }
  showScrollbar() {
    return this.mode === "modern" && this.showScroll;
  }
  getClassMap() {
    return {
      [this.mode]: true,
      "show-scrollbar": this.showScrollbar(),
    };
  }
  render() {
    return (h(Host, { class: this.getClassMap() }, h("div", { class: "body" }, h("button", { class: "prev", onClick: () => this.showPrev() }, h(ChevronIcon, null)), h("div", { class: this.getContentClassMap(), onScroll: () => this.processScrollbarWidth() }), h("button", { class: "next", onClick: () => this.showNext() }, h(ChevronIcon, null))), this.showBullets() ? (h("div", { class: "bullets" }, this.contentGroups
      .map((_, i) => i)
      .map((i) => (h("div", { class: {
        bullet: true,
        active: this.activeContentGroup === i,
      } }))))) : (""), h("slot", { onSlotchange: (x) => this.cloneSlottedContent(x) })));
  }
  get el() { return getElement(this); }
};
VviinnCarousel.style = vviinnCarouselCss;

class GtagAnalytics {
  sendImpression(product) {
    var _a, _b, _c;
    gtag('event', 'view_item_list', {
      items: [
        {
          id: product.productId,
          name: product.title,
          brand: (_a = product.brand) !== null && _a !== void 0 ? _a : '',
          category: (_b = product.productType) !== null && _b !== void 0 ? _b : '',
          list_name: 'VI VPR View',
          price: Math.min(...[product.price.actual, (_c = product.price.sale) !== null && _c !== void 0 ? _c : Infinity])
        }
      ]
    });
    return undefined;
  }
  sendClick(product) {
    var _a, _b, _c;
    gtag('event', 'select_content', {
      content_type: 'product',
      items: [
        {
          id: product.productId,
          name: product.title,
          brand: (_a = product.brand) !== null && _a !== void 0 ? _a : '',
          category: (_b = product.productType) !== null && _b !== void 0 ? _b : '',
          list_name: 'VI VPR View',
          price: Math.min(...[product.price.actual, (_c = product.price.sale) !== null && _c !== void 0 ? _c : Infinity])
        }
      ]
    });
    return undefined;
  }
}

class GAnalytics {
  constructor() {
    ga('require', 'ec');
  }
  convertProduct(product) {
    var _a, _b, _c;
    return {
      id: product.productId,
      name: product.title,
      brand: (_a = product.brand) !== null && _a !== void 0 ? _a : '',
      category: (_b = product.productType) !== null && _b !== void 0 ? _b : '',
      list: 'VI VPR View',
      price: Math.min(...[product.price.actual, (_c = product.price.sale) !== null && _c !== void 0 ? _c : Infinity])
    };
  }
  sendImpression(product) {
    ga('ec:addImpression', this.convertProduct(product));
    return undefined;
  }
  sendClick(product) {
    var _a, _b, _c;
    ga('ec:addProduct', {
      id: product.productId,
      name: product.title,
      brand: (_a = product.brand) !== null && _a !== void 0 ? _a : '',
      category: (_b = product.productType) !== null && _b !== void 0 ? _b : '',
      price: Math.min(...[product.price.actual, (_c = product.price.sale) !== null && _c !== void 0 ? _c : Infinity])
    });
    ga('ec:setAction', 'click', { list: 'VI VPR View' });
    return undefined;
  }
}

const getGtagAnalytics = () => _function.pipe(Option.fromNullable(window.gtag), Option.map(() => new GtagAnalytics()));
const getCommonAnalytics = () => _function.pipe(Option.fromNullable(window.ga), Option.map(() => new GAnalytics()));
const analyticsMonoid = Option.getMonoid(Semigroup.first());
const getAnalyticsModule = analyticsMonoid.concat(getGtagAnalytics(), getCommonAnalytics());

const FIT_EXPR = /fit\/\d+\//;
const containsFit = (url) => {
  return _function.pipe(url.match(FIT_EXPR), Either.fromNullable(url), Either.map(() => url));
};
const processWidth = (url, size) => {
  return _function.pipe(containsFit(url), Either.map((url) => url.replace(FIT_EXPR, `fit/${size}/`)), Either.getOrElse(() => url));
};
const Linked = (props, child) => props.deeplink ? (h("a", { class: props.part, part: props.part, href: props.deeplink }, child)) : (child);
const FormattedPrice = (props) => {
  var _a;
  const locale = props.locale;
  const formattedPrice = new Intl.NumberFormat(locale, {
    minimumFractionDigits: 2,
  }).format(props.price);
  const fullPrice = `${(_a = props.prefix) !== null && _a !== void 0 ? _a : ""} ${formattedPrice} ${props.currency}`;
  return (h("span", { class: "price-amount", part: "price-amount" }, fullPrice));
};
const Price = (props) => {
  const priceEl = (h(FormattedPrice, { prefix: props.prefix, currency: props.currency, price: props.price, locale: props.locale }));
  return (h("span", { class: "price-container", part: "price-container" }, props.salePrice ? ([
    h("span", { class: "price-sale", part: "price-sale" },
      h(FormattedPrice, { prefix: props.prefix, currency: props.currency, price: props.salePrice, locale: props.locale })),
    h("span", { class: "price-outdated", part: "price-outdated" }, priceEl),
  ]) : (h("span", { class: "price-regular", part: "price-regular" }, priceEl))));
};
const Image = (props) => (h("img", { loading: "lazy", part: "image", class: "image", width: props.width, height: props.height, src: processWidth(props.src, props.width), alt: props.title }));
const ResponsiveImage = (props) => (h("img", { loading: "lazy", part: "image", class: "image responsive", src: processWidth(props.src, props.width), alt: props.title }));

const vviinnProductCardCss = ":host{align-items:center;display:flex;flex-direction:column;gap:8px;height:100%}.price-container{display:flex;flex-direction:column}.price-sale,.price-regular{font-style:normal;font-weight:normal;font-size:16px;line-height:24px;color:#161616}.price-outdated{font-style:normal;font-weight:normal;font-size:16px;line-height:24px;color:#757575;text-decoration:line-through}.product-type{word-wrap:anywhere}.image{display:grid;align-content:center;-o-object-position:50% 50%;object-position:50% 50%;-o-object-fit:contain;object-fit:contain;text-align:center;max-width:-webkit-min-content;max-width:-moz-min-content;max-width:min-content}img.responsive{width:100%;height:auto;aspect-ratio:1}.brand,.type{display:none}.title{-webkit-box-orient:vertical;-webkit-line-clamp:2;color:#161616;display:-webkit-box;font-size:16px;font-style:normal;font-weight:500;line-height:24px;margin-bottom:8px;overflow:hidden}.deeplink{text-decoration:none}";

let VviinnProductCard = class {
  constructor(hostRef) {
    registerInstance(this, hostRef);
    this.recommendationLoad = createEvent(this, "recommendationLoad", 7);
    this.recommendationView = createEvent(this, "recommendationView", 7);
    this.recommendationClick = createEvent(this, "recommendationClick", 7);
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
      _function.pipe(getAnalyticsModule, Option.map((analytics) => analytics.sendImpression(this.getProduct())));
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
      _function.pipe(getAnalyticsModule, Option.match(() => null, (analytics) => analytics.sendClick(this.getProduct())));
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
    return (h(Host, { exportparts: "brand, currency, deeplink, image, type, image-link, price-amount, price-container, price-outdated, price-prefix, price-regular, price-sale, title" }, h(Linked, { deeplink: this.deeplink, part: "image-link" }, this.renderImage()), h(Linked, { deeplink: this.deeplink, part: "deeplink" }, h("span", { class: "title", part: "title" }, this.productTitle)), h("span", { class: "brand", part: "brand" }, this.brand), h("span", { class: "type", part: "type" }, this.productType), h(Price, { prefix: (_a = this.pricePrefix) !== null && _a !== void 0 ? _a : state.pricePrefix, currency: (_b = this.currency) !== null && _b !== void 0 ? _b : state.currencySign, price: this.price, salePrice: this.salePrice, locale: (_c = this.locale) !== null && _c !== void 0 ? _c : state.locale })));
  }
  get el() { return getElement(this); }
};
VviinnProductCard.style = vviinnProductCardCss;

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
function fold(onVPR, onVCS) {
  return (c) => (isVPR(c) ? onVPR() : onVCS());
}
function fromString(s) {
  return s === "VPR" ? { _tag: "VPR" } : { _tag: "VCS" };
}

const sequenceToEither = sequenceT(Apply);
const apiGet = (path, data = {}) => pipe(sequenceToEither(getApiPath(), createInitGetRequest), fromEither, chainW(makeRequest(path, data)));

const getVPRRecommendations = (productId) => (options) => {
  const url = `product/${productId}/similar-products`;
  return apiGet(url, options);
};

const getVCSRecommendations = (productId) => (options) => {
  const url = `product/${productId}/cross-selling-products`;
  return apiGet(url, options);
};

const getRecommendationsService = (campaignType) => _function.pipe(fromString(campaignType), fold(() => getVPRRecommendations, () => getVCSRecommendations));

const vviinnVprWidgetCss = ":host{display:grid;grid-gap:1rem;width:100%}:host(:not(.loaded)){position:absolute;visibility:hidden}:host(.classic) vviinn-product-card::part(image){border:1px solid #DDDDDD}:host(.modern) vviinn-product-card::part(price-container){align-self:start;text-align:left}.results{display:grid;grid-gap:1rem}.visually-hidden{position:absolute;top:0;left:0;z-index:-1;height:0;width:0}";

let VviinnVprWidget = class {
  constructor(hostRef) {
    registerInstance(this, hostRef);
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
    state$1.apiPath = this.apiPath;
    state$1.currencySign = this.currencySign;
    state$1.locale = this.locale;
  }
  async componentWillLoad() {
    state$1.pricePrefix = this.pricePrefix;
    state$1.currencySign = this.currencySign;
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
    return (h(Host, { class: { loaded: this.loaded, empty: this.recommendations.length == 0, [this.mode]: true }, "aria-hidden": this.loaded ? "false" : "true" }, h("style", null, state$1.fallbackStyles), h("h2", { part: "recommendations-title" }, this.blockTitle), h("vviinn-carousel", { exportparts: "brand, currency, deeplink, image, type, image-link, price-amount, price-container, price-outdated, price-prefix, price-regular, price-sale, title, title: product-title", mode: this.mode, imageWidth: this.imageWidth, showScroll: this.showScroll }, this.recommendations.map((r) => (h("vviinn-product-card", { productTitle: r.title, image: r.image.thumbnail, brand: r.brand, imageWidth: this.imageWidth, imageRatio: this.imageRatio, price: r.price.actual, salePrice: r.price.sale, responsive: this.mode === "classic" }))))));
  }
  get el() { return getElement(this); }
  static get watchers() { return {
    "productId": ["handleProductIdChange"]
  }; }
};
VviinnVprWidget.style = vviinnVprWidgetCss;

export { VviinnCarousel as vviinn_carousel, VviinnProductCard as vviinn_product_card, VviinnVprWidget as vviinn_vpr_widget };
