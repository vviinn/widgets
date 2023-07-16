import { argTypes } from "./args";
import { productDecorator } from "./decorators";

export default {
  title: "Elements/Product Card",
  component: "vviinn-product-card",
  decorators: [productDecorator],
  argTypes,
};

const Template = (args) => `
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

Default.storyName = "Product Card";

Default.args = {
  productTitle: "Couchtisch Rolf Benz 8770 Ronald Schmitt",
  productType: "Couchtische",
  productId: "",
  imageWidth: 240,
  dimmedBackground: false,
  brand: "Ronald Schmitt",
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
