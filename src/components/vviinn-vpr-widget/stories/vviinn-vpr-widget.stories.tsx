import { argTypes } from "./args";
import { gridDecorator, continuityDecorator } from "./decorators";

export default {
  title: "Playground/Recommendation/Main",
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
    >
    </vviinn-vpr-widget>
`;

export const Grid = Template.bind({});
Grid.args = {
  token: process.env.STORYBOOK_TOKEN,
  apiPath: process.env.STORYBOOK_API_PATH,
  productId: "4114460310",
  campaignType: "VPR",
  campaigns: "",
  color: "",
  excluded: "",
  mode: "grid",
  blockTitle: "Recommended products",
  productDetailsNewTab: false,
  productDetailsRedirect: true,
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
  addToBasketShow: false,
  showFilters: false,
  showExtendedFilters: false,
};

Grid.decorators = [gridDecorator];

export const Continuity = Template.bind({});
Continuity.args = {
  token: process.env.STORYBOOK_TOKEN,
  apiPath: process.env.STORYBOOK_API_PATH,
  productId: "4114460310",
  campaignType: "VPR",
  campaigns: "",
  color: "",
  excluded: "",
  mode: "continuity",
  blockTitle: "Recommended products",
  productDetailsNewTab: false,
  productDetailsRedirect: true,
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
  addToBasketShow: true,
  showFilters: false,
  showExtendedFilters: false,
};

Continuity.decorators = [continuityDecorator];

export const Set = Template.bind({});
Set.args = {
  token: process.env.STORYBOOK_TOKEN,
  apiPath: process.env.STORYBOOK_API_PATH,
  productId: "105870136716",
  campaignType: "VCS",
  campaigns: "",
  color: "",
  excluded: "",
  mode: "set",
  blockTitle: "Recommended products",
  productDetailsNewTab: false,
  productDetailsRedirect: true,
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
  addToBasketShow: true,
  updateButtonLocation: "topAndItem",
  showFilters: false,
  showExtendedFilters: false,
  setModeDiscounts: "5, 10, 15",
};

Set.decorators = [gridDecorator];
