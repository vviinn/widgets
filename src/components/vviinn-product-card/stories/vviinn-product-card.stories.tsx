import { argTypes } from "./args";
import { productDecorator } from "./decorators";

export default {
  title: "Elements/Product Card",
  component: "vviinn-product-card",
  decorators: [productDecorator],
  argTypes,
};

const showImageBorders = (x, color) => {
  const borderRule = x ? `1px solid ${color}` : "none";

  return `
  vviinn-product-card::part(image) {
    border: ${borderRule};
  }
`;
};

const setupBrandVisibility = (show) => `
  vviinn-product-card::part(brand) {
    display: ${show ? "flex" : "none"};
  }
`;

const setupTitleLineCount = (count) => `
  vviinn-product-card::part(title) {
    -webkit-line-clamp: ${count};
  }
`;

const alignmentLeft = `
  vviinn-product-card::part(title),
  vviinn-product-card::part(brand),
  vviinn-product-card::part(type),
  vviinn-product-card::part(deeplink),
  vviinn-product-card::part(price-container) {
    align-self: start;
    text-align: left;
  }`;

const alignmentCenter = `
  vviinn-product-card::part(title),
  vviinn-product-card::part(brand),
  vviinn-product-card::part(type),
  vviinn-product-card::part(deeplink),
  vviinn-product-card::part(price-container) {
    align-self: center;
    text-align: center;
  }`;

const alignmentRight = `
  vviinn-product-card::part(title),
  vviinn-product-card::part(brand),
  vviinn-product-card::part(type),
  vviinn-product-card::part(deeplink),
  vviinn-product-card::part(price-container) {
    align-self: end;
    text-align: right;
  }`;

const alignment = new Map([
  [0, alignmentLeft],
  [1, alignmentCenter],
  [2, alignmentRight],
]);

const Template = (args) => `
  <style>
    ${alignment.get(args.contentAlignment)}
    ${showImageBorders(args.imageBorder, args.imageBorderColor)}
    ${setupBrandVisibility(args.brand)}
    ${setupTitleLineCount(args.titleLineCount)}

    vviinn-product-card::part(title),
    vviinn-product-card::part(brand),
    vviinn-product-card::part(type),
    vviinn-product-card::part(price-sale),
    vviinn-product-card::part(price-regular) {
      color: ${args.primaryTextColor};
    }

    vviinn-product-card::part(price-outdated) {
      color: ${args.secondaryTextColor};
    }
  </style>
  <vviinn-product-card
    product-title="${args.productTitle}"
    product-id="${args.productId}"
    brand="${args.brand}"
    product-type="${args.productType}"
    price="${args.price}"
    sale-price="${args.salePrice}"
    price-prefix="${args.pricePrefix}"
    image="${args.image}"
    image-width="${args.imageWidth}"
    responsive="${args.responsive}"
    image-ratio="${args.imageRatio}"
    dimmed-background="${args.dimmedBackground}"
    locale="${args.locale}"
    currency="${args.currency}"
    deeplink="${args.deeplink}"
    imageRatio="${args.imageRatio}"
  ></vviinn-product-card>`;

export const Default = Template.bind({});
Default.args = {
  productTitle: "Couchtisch Rolf Benz 8770 Ronald Schmitt",
  productType: "Couchtische",
  productId: "",
  imageWidth: 240,
  contentAlignment: "Left",
  imageBorder: true,
  imageBorderColor: "#dddddd",
  dimmedBackground: false,
  primaryTextColor: "#161616",
  secondaryTextColor: "#757575",
  brand: "Ronald Schmitt",
  titleLineCount: 2,
  locale: "en-US",
  currency: "€",
  deeplink: "",
  image:
    "https://www.moebel-shop.de/media/image/e3/e9/28/0749295-001_600x600.jpg",
  responsive: false,
  imageRatio: 1,
  price: 3629,
  salePrice: 1653,
  pricePrefix: "",
};
