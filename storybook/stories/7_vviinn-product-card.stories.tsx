import { argTypes } from "../../src/components/vviinn-product-card/stories/args";
import { productDecorator } from "../../src/components/vviinn-product-card/stories/decorators";
import { productImages } from "../components/productCard/constants";
import { energyCertificationsString } from "../documentation/components/constants";
import "../documentation/widgets/styles.css";
import { argsFromParams } from "../helpers/argsFromParams";
export default {
  title: "Playground/Product Card",
  component: "vviinn-product-card",
  decorators: [productDecorator],
  parameters: {
    controls: { expanded: false },
    argTypes: {
      entityType: {
        options: ["product", "content", "list"],
        control: {
          type: "select",
        },
      },
    },
  },
  argTypes,
};

const Template = (args) => {
  const imagesAttr =
    args.images && args.images.length > 0
      ? `images='${JSON.stringify(args.images)}'`
      : "";

  return `
    <vviinn-product-card
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

const initArgs = {
  productTitle: "Sessel Loft (BH 80x95 cm)",
  productType: "Sessel",
  brand: "Living",
  locale: "en-US",
  numberLocale: "",
  currencySign: "€",
  deeplink: "https://example.com/sessel-loft",
  image: productImages.armchair,
  images: [
    {
      original: productImages.armchair,
    },
    {
      original: productImages.diningChair,
    },
  ],
  showMultipleImages: false,
  responsive: false,
  imageWidth: 300,
  price: 3629,
  basePrice: { price: 10, quantity: 1, measure: "cm²" },
  salePrice: 1653,
  baseSalePrice: { price: 5, quantity: 1, measure: "cm²" },
  pricePrefix: "",
  customLabels: "UVP",
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
