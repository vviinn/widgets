import { argTypes } from "../../src/components/vviinn-product-card/stories/args";
import { productDecorator } from "../../src/components/vviinn-product-card/stories/decorators";
import { energyCertificationsString } from "../documentation/components/constants";

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
      mode="${args.mode}"
      brand="${args.brand}"
      product-type="${args.productType}"
      price="${args.price}"
      sale-price="${args.salePrice}"
      price-prefix="${args.pricePrefix}"
      image="${args.image}"
      image-width="${args.imageWidth}"
      responsive="${args.responsive}"
      image-ratio="${args.imageRatio}"
      update-button-location="${args.updateButtonLocation}"
      basket-button-show="${args.basketButtonShow}"
      locale="${args.locale}"
      currency="${args.currency}"
      image-ratio="${args.imageRatio}"
      price-label="${args.priceLabel}"
      product-card-content-align="${args.productCardContentAlign}"
      product-card-text-align="${args.productCardTextAlign}"
      product-card-image-border="${args.productCardImageBorder}"
      product-card-image-bg-color="${args.productCardImageBgColor}"
      energy-certifications-string='${args.energyCertificationsString}'
      show-in-storybook="${args.showInStorybook}"
    ></vviinn-product-card>`;
};

export const Default = Template.bind({});

Default.storyName = "Product Card";

Default.args = {
  productTitle: "Couchtisch Rolf Benz 8770 Ronald Schmitt",
  productType: "Couchtische",
  mode: "continuity",
  imageWidth: 240,
  brand: "Ronald Schmitt",
  locale: "en-US",
  currency: "€",
  image:
    "https://www.moebel-shop.de/media/image/e3/e9/28/0749295-001_600x600.jpg",
  responsive: false,
  imageRatio: 1,
  price: 3629,
  salePrice: 1653,
  pricePrefix: "",
  basketButtonShow: true,
  updateButtonLocation: "onItem",
  priceLabel: "",
  productCardContentAlign: "flex-start",
  productCardTextAlign: "left",
  productCardImageBorder: "none",
  productCardImageBgColor: "#f4f4f4",
  showInStorybook: true,
  energyCertificationsString,
};
