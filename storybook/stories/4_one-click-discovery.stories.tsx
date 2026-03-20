import { argTypes } from "../../src/components/vviinn-vpr-button/stories/args";
import {
  vviinnToken,
  productIdSimilarProducts,
  createCSSVarDecorator,
  productCardImageAspectRatioMapping,
  productCardImageBgColorMapping,
} from "../helpers";
import "../documentation/widgets/styles.css";
import { argsFromParams } from "../helpers/argsFromParams";

const cssVarDecorator = createCSSVarDecorator("vviinn-vpr-button", [
  productCardImageAspectRatioMapping,
  productCardImageBgColorMapping,
]);

export default {
  title: "Playground/One-Click Discovery",
  component: "vviinn-vpr-button",
  decorators: [cssVarDecorator],
  argTypes: {
    ...argTypes,
  },
};

const Template = (args) => `
    <vviinn-vpr-button
      ${args.sidebarTitle ? `sidebar-title="${args.sidebarTitle}"` : ""}
      ${args.sidebarSubtitle ? `sidebar-subtitle="${args.sidebarSubtitle}"` : ""}
      css-url="${args.cssUrl}"
      currency-sign="${args.currencySign}"
      locale="${args.locale}"
      number-locale="${args.numberLocale}"
      price-prefix="${args.pricePrefix}"
      product-id="${args.productId}"
      token="${args.token}"
      mode="${args.mode}"
      add-style="${args.addStyle}"
      position="${args.position}"
      modal-scrollbar="${args.modalScrollbar}"
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
      set-mode-discounts="${args.setModeDiscounts}"
      add-price-container="${args.addPriceContainer}"
      favorite-show="${args.favoriteShow}"
    ></vviinn-vpr-button>
`;

export const Default = Template.bind({});
Default.storyName = "One-Click Discovery";

const initArgs = {
  token: vviinnToken,
  apiPath: process.env.STORYBOOK_API_PATH,
  productId: productIdSimilarProducts,
  campaignType: "VPR",
  campaigns: "",
  color: "",
  excluded: "",
  mode: "grid",
  sidebarTitle: "",
  sidebarSubtitle: "",
  addStyle: true,
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
  noResultShow: true,
  noResultText: "",
  position: "bottom",
  updateButtonLocation: "TopAndItem",
  modalScrollbar: false,
  gridArrowsDynamic: false,
  addToBasketShow: false,
  showFilters: false,
  addPriceContainer: false,
  favoriteShow: false,
  productCardImageAspectRatio: "1 / 1",
  productCardImageBgColor: "#f4f4f4",
};

Default.args = argsFromParams(initArgs);
