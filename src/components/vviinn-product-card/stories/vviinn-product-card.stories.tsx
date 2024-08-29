import { argTypes } from "./args";
import { productDecorator } from "./decorators";

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
  const getEfficiencyClasses = (standard) =>
    standard === "2017/1369 (updated)"
      ? { minEnergyEfficiencyClass: "A", maxEnergyEfficiencyClass: "G" }
      : { minEnergyEfficiencyClass: "A+++", maxEnergyEfficiencyClass: "D" };

  const efficiencyClasses = getEfficiencyClasses(args.energyEfficiencyStandard);

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
      energy-efficiency-class="${args.energyEfficiencyClass}"
      min-energy-efficiency-class="${efficiencyClasses.minEnergyEfficiencyClass}"
      max-energy-efficiency-class="${efficiencyClasses.maxEnergyEfficiencyClass}"
      update-button-location="${args.updateButtonLocation}"
      basket-button-show="${args.basketButtonShow}"
      dimmed-background="${args.dimmedBackground}"
      locale="${args.locale}"
      currency="${args.currency}"
      image-ratio="${args.imageRatio}"
    >
      <span slot="vviinn-basket-button-text">Add to basket</span>
    </vviinn-product-card>`;
};

export const Default = Template.bind({});

Default.storyName = "Product Card";

Default.args = {
  productTitle: "Couchtisch Rolf Benz 8770 Ronald Schmitt",
  productType: "Couchtische",
  energyEfficiencyStandard: "2017/1369 (updated)",
  energyEfficiencyClass: "A",
  mode: "continuity",
  imageWidth: 240,
  dimmedBackground: true,
  brand: "Ronald Schmitt",
  locale: "de-DE",
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
};
