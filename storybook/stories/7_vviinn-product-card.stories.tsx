import { argTypes } from "../../src/components/vviinn-product-card/stories/args";
import { productDecorator } from "../../src/components/vviinn-product-card/stories/decorators";
import "../styles/playground.css";
import { siteProductCards } from "../helpers";
import { argsFromParams } from "../helpers/argsFromParams";

export default {
  title: "Playground/Product Card",
  component: "vviinn-product-card",
  decorators: [productDecorator],
  argTypes,
};

const Template = (args) => {
  const imagesAttr =
    args.images && args.images.length > 0
      ? `images='${JSON.stringify(args.images)}'`
      : "";

  return `
    <vviinn-product-card
      product-id="${args.productId}"
      product-title="${args.productTitle}"
      brand="${args.brand}"
      product-type="${args.productType}"
      price="${args.price}"
      base-price='${JSON.stringify(args.basePrice)}'
      sale-price="${args.salePrice}"
      base-sale-price='${JSON.stringify(args.baseSalePrice)}'
      price-prefix="${args.pricePrefix}"
      image="${args.image}"
      ${imagesAttr}
      show-multiple-images="${args.showMultipleImages}"
      image-width="${args.imageWidth}"
      responsive="${args.responsive}"
      update-button-location="${args.updateButtonLocation}"
      add-to-basket-show="${args.addToBasketShow}"
      is-set-mode="${args.isSetMode}"
      locale="${args.locale}"
      number-locale="${args.numberLocale}"
      currency-sign="${args.currencySign}"
      deeplink="${args.deeplink}"
      custom-labels="${args.customLabels}"
      energy-certifications-string='${args.energyCertificationsString}'
      add-price-container='${args.addPriceContainer}'
      favorite-show="${args.favoriteShow}"
      is-standalone="true"
      entity-type="${args.entityType}"
      css-url="${args.cssUrl}"
    ></vviinn-product-card>`;
};

export const Default = Template.bind({});

Default.storyName = "Product Card";

const { mainCard, setCard } = siteProductCards;

// Base prices are optional on a card, so a site may leave them out.
const toBasePrice = (value?: string) => (value ? JSON.parse(value) : null);

// Only products that need an energy label carry one.
const energyCertificationsString =
  mainCard["energy-certifications-string"] ?? "";

const initArgs = {
  productId: mainCard.id,
  productTitle: mainCard["product-title"],
  productType: mainCard["product-type"],
  brand: mainCard.brand,
  locale: "en-US",
  numberLocale: "",
  currencySign: "€",
  deeplink: "https://example.com/",
  image: mainCard.image,
  images: [{ original: mainCard.image }, { original: setCard.image }],
  showMultipleImages: false,
  responsive: false,
  imageWidth: 300,
  price: mainCard.price,
  basePrice: toBasePrice(mainCard["base-price"]),
  salePrice: mainCard["sale-price"],
  baseSalePrice: toBasePrice(mainCard["base-sale-price"]),
  pricePrefix: "",
  customLabels: "",
  addToBasketShow: true,
  isSetMode: false,
  addPriceContainer: false,
  energyCertificationsString,
  favoriteShow: true,
  entityType: "product",
  cssUrl: "",
  updateButtonLocation: "onItem",
  productCardContentAlign: "flex-start",
  productCardTextAlign: "left",
  productCardImageBorder: "none",
  productCardImageBgColor: "#f4f4f4",
  productCardImageAspectRatio: "1 / 1",
};

Default.args = argsFromParams(initArgs);
