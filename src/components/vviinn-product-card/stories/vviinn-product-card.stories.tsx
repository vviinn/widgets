import { argTypes } from "./args"
import { productDecorator } from "./decorators"

export default {
  title: "Elements/Product Card",
  component: "vviinn-product-card",
  decorators: [
    productDecorator
  ],
  argTypes
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

const allignementLeft = `
  vviinn-product-card::part(title),
  vviinn-product-card::part(brand),
  vviinn-product-card::part(type),
  vviinn-product-card::part(deeplink),
  vviinn-product-card::part(price-container) {
    align-self: start;
    text-align: left;
  }`;

const allignementCenter = `
  vviinn-product-card::part(title),
  vviinn-product-card::part(brand),
  vviinn-product-card::part(type),
  vviinn-product-card::part(deeplink),
  vviinn-product-card::part(price-container) {
    align-self: center;
    text-align: center;
  }`;

const allignementRight = `
  vviinn-product-card::part(title),
  vviinn-product-card::part(brand),
  vviinn-product-card::part(type),
  vviinn-product-card::part(deeplink),
  vviinn-product-card::part(price-container) {
    align-self: end;
    text-align: right;
  }`;

const allignement = new Map([
  [0, allignementLeft],
  [1, allignementCenter],
  [2, allignementRight],
]);

const Template = (args) => `
  <style>
    ${allignement.get(args.contentAlignment)}
    ${showImageBorders(args.imageBorder, args.imageBorderColor)}
    ${setupBrandVisibility(args.showBrand)}
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
    product-title="Couchtisch Rolf Benz 8770 Ronald Schmitt"
    brand="Ronald Schmitt"
    product-type="Couchtische"
    price="3629"
    sale-price="1653"
    image="https://www.moebel-shop.de/media/image/e3/e9/28/0749295-001_600x600.jpg"
    image-width="${args.imageWidth}"
    dimmed-background="${args.imageBackground}"
    locale="${args.locale}"
    currency="${args.currencyValue}"
  ></vviinn-product-card>`;

export const Default = Template.bind({});
Default.args = {
  imageWidth: 240,
  contentAlignment: "Left",
  imageBorder: true,
  imageBorderColor: "#dddddd",
  imageBackground: false,
  primaryTextColor: "#161616",
  secondaryTextColor: "#757575",
  showBrand: false,
  titleLineCount: 2,
  locale: "en-US",
  currencyValue: "€"
};
