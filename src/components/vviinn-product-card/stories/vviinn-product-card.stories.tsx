import { argTypes } from "./args";
import { productDecorator } from "./decorators";

export default {
  title: "Elements/Product Card",
  component: "vviinn-product-card",
  decorators: [productDecorator],
  parameters: {
    controls: { expanded: false },
  },
  argTypes,
};

const Template = (args) => `
  <vviinn-product-card
    product-title="${args.productTitle}"
    product-id="${args.productId}"
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
    energy-efficiency-class="${args.energyEfficiencyClass}"
    min-energy-efficiency-class="${args.minEnergyEfficiencyClass}"
    max-energy-efficiency-class="${args.maxEnergyEfficiencyClass}"
    applied-discount-percentage="${args.appliedDiscountPercentage}"
    current-discount-percentage="${args.currentDiscountPercentage}"
    update-button-location="${args.updateButtonLocation}"
    is-source-product="${args.isSourceProduct}"
    basket-button-show="${args.basketButtonShow}"
    dimmed-background="${args.dimmedBackground}"
    locale="${args.locale}"
    currency="${args.currency}"
    deeplink="${args.deeplink}"
    image-ratio="${args.imageRatio}"
  >
    <span slot="vviinn-basket-button-text">Add to basket</span>
  </vviinn-product-card>`;

export const Default = Template.bind({});

Default.storyName = "Product Card";

Default.args = {
  productTitle: "Couchtisch Rolf Benz 8770 Ronald Schmitt",
  productType: "Couchtische",
  productId: "",
  mode: "continuity",
  imageWidth: 240,
  dimmedBackground: true,
  brand: "Ronald Schmitt",
  locale: "de-DE",
  currency: "€",
  deeplink: "",
  image:
    "https://www.moebel-shop.de/media/image/e3/e9/28/0749295-001_600x600.jpg",
  responsive: false,
  imageRatio: 1,
  price: 3629,
  salePrice: 1653,
  pricePrefix: "",
  appliedDiscountPercentage: 0,
  currentDiscountPercentage: 0,
  isSourceProduct: false,
  basketButtonShow: true,
  energyEfficiencyClass: "A",
  minEnergyEfficiencyClass: "G",
  maxEnergyEfficiencyClass: "A",
  updateButtonLocation: "onItem",
};
