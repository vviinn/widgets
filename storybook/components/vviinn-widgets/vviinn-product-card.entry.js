import { h, r as registerInstance, k as createEvent, f as Host, g as getElement } from './index-42e4cfd6.js';
import { _ as _function, d as Semigroup } from './NonEmptyArray-6ef0d207.js';
import { O as Option } from './number-98d54dd6.js';
import { E as Either, i as imageSearchState, x as state } from './imageSearch.store-074cab22.js';
import './Handler-47db9890.js';
import './Array-4b9f84cf.js';

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

const vviinnProductCardCss = ":host{display:flex;gap:8px;flex-direction:column;height:100%}.price-container{display:flex;flex-direction:column}.price-sale,.price-regular{font-style:normal;font-weight:normal;font-size:16px;line-height:24px;color:#161616}.price-outdated{font-style:normal;font-weight:normal;font-size:16px;line-height:24px;color:#757575;text-decoration:line-through}.product-type{word-wrap:anywhere}.image{display:grid;align-content:center;-o-object-position:50% 50%;object-position:50% 50%;-o-object-fit:contain;object-fit:contain;text-align:center;max-width:-webkit-min-content;max-width:-moz-min-content;max-width:min-content}img.responsive{width:100%;height:auto;aspect-ratio:1}.brand,.type{display:none}.title{font-style:normal;font-weight:500;font-size:16px;line-height:24px;color:#161616;margin-bottom:8px;display:-webkit-box;-webkit-box-orient:vertical;-webkit-line-clamp:2;overflow:hidden}.deeplink{text-decoration:none}";

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

export { VviinnProductCard as vviinn_product_card };
