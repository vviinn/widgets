import { argTypes } from "../../src/components/vviinn-product-card/stories/args";
import { productDecorator } from "../../src/components/vviinn-product-card/stories/decorators";
import { energyCertificationsString } from "../documentation/components/constants";
import "../documentation/widgets/styles.css";

export default {
  title: "Playground/Product Card",
  component: "vviinn-product-card",
  decorators: [productDecorator],
  parameters: {
    controls: { expanded: false },
  },
  argTypes,
};

const Template = (args) => {
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
      image-width="${args.imageWidth}"
      responsive="${args.responsive}"
      image-ratio="${args.imageRatio}"
      update-button-location="${args.updateButtonLocation}"
      basket-button-show="${args.basketButtonShow}"
      set-mode="${args.setMode}"
      locale="${args.locale}"
      currency="${args.currency}"
      image-ratio="${args.imageRatio}"
      price-label="${args.priceLabel}"
      product-card-content-align="${args.productCardContentAlign}"
      product-card-text-align="${args.productCardTextAlign}"
      product-card-image-border="${args.productCardImageBorder}"
      product-card-image-bg-color="${args.productCardImageBgColor}"
      energy-certifications-string='${args.energyCertificationsString}'
    ></vviinn-product-card>`;
};

export const Default = Template.bind({});

Default.storyName = "Product Card";

Default.args = {
  productTitle: "Couchtisch Rolf Benz 8770 Ronald Schmitt",
  productType: "Couchtische",
  brand: "Ronald Schmitt",
  locale: "en-US",
  currency: "€",
  image:
    "https://www.moebel-shop.de/media/image/e3/e9/28/0749295-001_600x600.jpg",
  responsive: false,
  imageWidth: 240,
  imageRatio: 1,
  price: 3629,
  basePrice: { price: 10, quantity: 1, measure: "cm²" },
  salePrice: 1653,
  baseSalePrice: { price: 5, quantity: 1, measure: "cm²" },
  pricePrefix: "",
  priceLabel: "UVP",
  basketButtonShow: true,
  updateButtonLocation: "onItem",
  setMode: false,
  productCardContentAlign: "flex-start",
  productCardTextAlign: "left",
  productCardImageBorder: "none",
  productCardImageBgColor: "#f4f4f4",
  energyCertificationsString,
};
