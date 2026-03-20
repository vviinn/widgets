import { argTypes } from "../../src/components/vviinn-vpr-widget/stories/args";
import {
  vviinnToken,
  productIdSimilarProducts,
  createCSSVarDecorator,
  productCardImageAspectRatioMapping,
  productCardImageBgColorMapping,
} from "../helpers";
import "../documentation/widgets/styles.css";
import { argsFromParams } from "../helpers/argsFromParams";

const cssVarDecorator = createCSSVarDecorator("vviinn-vpr-widget", [
  productCardImageAspectRatioMapping,
  productCardImageBgColorMapping,
]);

export default {
  title: "Playground/Discovery",
  component: "vviinn-vpr-widget",
  decorators: [cssVarDecorator],
  argTypes: {
    ...argTypes,
  },
};

const Template = (args) => `
    <vviinn-vpr-widget
      ${args.blockTitle ? `block-title="${args.blockTitle}"` : ""}
      ${args.blockSubtitle ? `block-subtitle="${args.blockSubtitle}"` : ""}
      css-url="${args.cssUrl}"
      currency-sign="${args.currencySign}"
      show-scroll="${args.showScroll}"
      locale="${args.locale}"
      number-locale="${args.numberLocale}"
      price-prefix="${args.pricePrefix}"
      product-id="${args.productId}"
      token="${args.token}"
      mode="${args.mode}"
      image-width="${args.imageWidth}"
      image-resolution-width="${args.imageResolutionWidth}"
      show-multiple-images="${args.showMultipleImages}"
      set-items-amount="${args.setItemsAmount}"
      campaign-type="${args.campaignType}"
      campaigns="${args.campaigns}"
      product-details-new-tab="${args.productDetailsNewTab}"
      product-details-redirect="${args.productDetailsRedirect}"
      color="${args.color ? args.color.slice(1) : ""}"
      grid-arrows-dynamic="${args.gridArrowsDynamic}"
      no-result-text="${args.noResultText}"
      no-result-show="${args.noResultShow}"
      excluded="${args.excluded}"
      api-path="${args.apiPath}"
      add-to-basket-show="${args.addToBasketShow}"
      update-button-location="${args.updateButtonLocation}"
      show-filters="${args.showFilters}"
      show-extended-filters="${args.showExtendedFilters}"
      set-mode-discounts="${args.setModeDiscounts}"
      add-price-container="${args.addPriceContainer}"
      favorite-show="${args.favoriteShow}"
    ></vviinn-vpr-widget>
`;

export const Default = Template.bind({});
Default.storyName = "Discovery";

const initArgs = {
  token: vviinnToken,
  apiPath: process.env.STORYBOOK_API_PATH,
  productId: productIdSimilarProducts,
  campaignType: "VPR",
  campaigns: "",
  color: "",
  excluded: "",
  mode: "grid",
  blockTitle: "",
  blockSubtitle: "",
  productDetailsNewTab: true,
  productDetailsRedirect: true,
  imageWidth: 300,
  imageResolutionWidth: 500,
  showMultipleImages: false,
  setItemsAmount: 4,
  locale: "en-US",
  numberLocale: "",
  currencySign: "€",
  pricePrefix: "",
  cssUrl: "",
  showScroll: false,
  noResultShow: true,
  noResultText: "",
  updateButtonLocation: "topAndItem",
  gridArrowsDynamic: false,
  addToBasketShow: false,
  showFilters: false,
  showExtendedFilters: false,
  addPriceContainer: false,
  favoriteShow: false,
  productCardImageAspectRatio: "1 / 1",
  productCardImageBgColor: "#f4f4f4",
};

Default.args = argsFromParams(initArgs);
