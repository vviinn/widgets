import { argTypes } from "../../src/components/vviinn-vpr-button/stories/args";
import { vviinnToken, productIdSimilarProducts } from "../helpers";
import "../documentation/widgets/styles.css";
import { argsFromParams } from "../helpers/argsFromParams";

export default {
  title: "Playground/One-click Discovery",
  component: "vviinn-vpr-button",
  argTypes: {
    ...argTypes,
  },
};

const Template = (args) => `
    <vviinn-vpr-button
      sidebar-title="${args.sidebarTitle}"
      css-url="${args.cssUrl}"
      currency-sign="${args.currencySign}"
      image-ratio="${args.imageRatio}"
      locale="${args.locale}"
      price-prefix="${args.pricePrefix}"
      product-id="${args.productId}"
      token="${args.token}"
      mode="${args.mode}"
      add-style="${args.addStyle}"
      position="${args.position}"
      modal-scrollbar="${args.modalScrollbar}"
      image-width="${args.imageWidth}"
      image-resolution-width="${args.imageResolutionWidth}"
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
Default.storyName = "One-click Discovery";

const initArgs = {
  token: vviinnToken,
  apiPath: process.env.STORYBOOK_API_PATH,
  productId: productIdSimilarProducts,
  campaignType: "VPR",
  campaigns: "",
  color: "",
  excluded: "",
  mode: "grid",
  sidebarTitle: "Recommended products",
  addStyle: true,
  productDetailsNewTab: true,
  productDetailsRedirect: true,
  imageWidth: 300,
  imageResolutionWidth: 500,
  imageRatio: 1,
  setItemsAmount: 4,
  locale: "en-US",
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
};

Default.args = argsFromParams(initArgs);
