import { STORYBOOK_API_PATH, STORYBOOK_TOKEN } from "../../../storybook";
import { argTypes } from "./args";
import { gridDecorator, continuityDecorator } from "./decorators";

export default {
  title: "Widgets/Recommendation/Main",
  component: "vviinn-vpr-widget",
  argTypes: {
    ...argTypes,
    mode: {
      table: {
        disable: true,
      },
    },
  },
};

const Template = (args) => `
    <vviinn-vpr-widget
      block-title="${args.blockTitle}"
      css-url="${args.cssUrl}"
      currency-sign="${args.currencySign}"
      show-scroll="${args.showScroll}"
      image-ratio="${args.imageRatio}"
      locale="${args.locale}"
      price-prefix="${args.pricePrefix}"
      product-id="${args.productId}"
      token="${args.token}"
      mode="${args.mode}"
      image-width="${args.imageWidth}"
      campaign-type="${args.campaignType}"
      campaigns="${args.campaigns}"
      product-detail-new-tab="${args.productDetailNewTab}"
      color="${args.color ? args.color.slice(1) : ""}"
      grid-arrows-dynamic="${args.gridArrowsDynamic}"
      no-result-text="${args.noResultText}"
      no-result-show="${args.noResultShow}"
      excluded="${args.excluded}"
      api-path="${args.apiPath}"
      add-to-basket-show="${args.addToBasketShow}"
      update-button-location="${args.updateButtonLocation}"
      set-mode-discounts="${args.setModeDiscounts}"
    >
    </vviinn-vpr-widget>
`;

export const Grid = Template.bind({});
Grid.args = {
  token: STORYBOOK_TOKEN,
  productId: "95906126752",
  campaignType: "VPR",
  campaigns: "",
  color: "",
  excluded: "",
  mode: "grid",
  blockTitle: "Recommended products",
  productDetailNewTab: false,
  imageWidth: 420,
  imageRatio: 1,
  locale: "en-US",
  currencySign: "€",
  pricePrefix: "",
  cssUrl: "",
  showScroll: false,
  noResultShow: true,
  noResultText: "",
  gridArrowsDynamic: false,
  apiPath: STORYBOOK_API_PATH,
  addToBasketShow: false,
};

Grid.decorators = [gridDecorator];

export const Continuity = Template.bind({});
Continuity.args = {
  token: STORYBOOK_TOKEN,
  productId: "95906126752",
  campaignType: "VPR",
  campaigns: "",
  color: "",
  excluded: "",
  mode: "continuity",
  blockTitle: "Recommended products",
  productDetailNewTab: false,
  imageWidth: 300,
  imageRatio: 1,
  locale: "en-US",
  currencySign: "€",
  pricePrefix: "",
  cssUrl: "",
  showScroll: false,
  noResultShow: true,
  noResultText: "",
  gridArrowsDynamic: false,
  apiPath: STORYBOOK_API_PATH,
  addToBasketShow: true,
};

Continuity.decorators = [continuityDecorator];

export const Set = Template.bind({});
Set.args = {
  token: STORYBOOK_TOKEN,
  productId: "95906126752",
  campaignType: "VCS",
  campaigns: "",
  color: "",
  excluded: "",
  mode: "set",
  blockTitle: "Recommended products",
  productDetailNewTab: false,
  imageWidth: 420,
  imageRatio: 1,
  locale: "en-US",
  currencySign: "€",
  pricePrefix: "",
  cssUrl: "",
  showScroll: false,
  noResultShow: true,
  noResultText: "",
  gridArrowsDynamic: false,
  apiPath: STORYBOOK_API_PATH,
  addToBasketShow: true,
  updateButtonLocation: "topAndItem",
  setModeDiscounts: "5, 10, 15",
};

Set.decorators = [gridDecorator];
