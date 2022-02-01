import { pipe } from "fp-ts/lib/function";
import * as E from "fp-ts/lib/Either";
import { h } from "@stencil/core";
const FIT_EXPR = /fit\/\d+\//;
export const containsFit = (url) => {
  return pipe(url.match(FIT_EXPR), E.fromNullable(url), E.map(() => url));
};
export const processWidth = (url, size) => {
  return pipe(containsFit(url), E.map((url) => url.replace(FIT_EXPR, `fit/${size}/`)), E.getOrElse(() => url));
};
export const Linked = (props, child) => props.deeplink ? (h("a", { class: props.part, part: props.part, href: props.deeplink }, child)) : (child);
const FormattedPrice = (props) => {
  var _a;
  const locale = props.locale;
  const formattedPrice = new Intl.NumberFormat(locale, {
    minimumFractionDigits: 2,
  }).format(props.price);
  const fullPrice = `${(_a = props.prefix) !== null && _a !== void 0 ? _a : ""} ${formattedPrice} ${props.currency}`;
  return (h("span", { class: "price-amount", part: "price-amount" }, fullPrice));
};
export const Price = (props) => {
  const priceEl = (h(FormattedPrice, { prefix: props.prefix, currency: props.currency, price: props.price, locale: props.locale }));
  return (h("span", { class: "price-container", part: "price-container" }, props.salePrice ? ([
    h("span", { class: "price-sale", part: "price-sale" },
      h(FormattedPrice, { prefix: props.prefix, currency: props.currency, price: props.salePrice, locale: props.locale })),
    h("span", { class: "price-outdated", part: "price-outdated" }, priceEl),
  ]) : (h("span", { class: "price-regular", part: "price-regular" }, priceEl))));
};
export const Image = (props) => (h("img", { loading: "lazy", part: "image", class: "image", width: props.width, height: props.height, src: processWidth(props.src, props.width), alt: props.title }));
export const ResponsiveImage = (props) => (h("img", { loading: "lazy", part: "image", class: "image responsive", src: processWidth(props.src, props.width), alt: props.title }));
