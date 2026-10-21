import {
  vviinnToken,
  createCSSVarDecorator,
  productCardImageAspectRatioMapping,
  productCardImageAspectRatioArg,
  productCardImageBgColorMapping,
  productCardImageBgColorArg,
} from "../helpers";
import "../styles/playground.css";
import { argsFromParams } from "../helpers/argsFromParams";

const cssVarDecorator = createCSSVarDecorator("vviinn-vps-button", [
  productCardImageAspectRatioMapping,
  productCardImageBgColorMapping,
]);

export default {
  title: "Playground/Search Modal",
  component: "vviinn-vps-button",
  argTypes: {
    productCardImageAspectRatio: productCardImageAspectRatioArg,
    productCardImageBgColor: productCardImageBgColorArg,
  },
  decorators: [
    cssVarDecorator,
    (story) => `
    <div style="display: grid;
                position: absolute;
                top: 0;
                bottom: 0;
                left: 0;
                right: 0;
                align-items: center;
                justify-items: center;">
      ${story()}
    </div>
  `,
  ],
};

const Template = (args) => `
<vviinn-vps-button
  token="${args.token}"
  campaign-id-text-search="${args.campaignIdTextSearch}"
  campaign-id-visual-search="${args.campaignIdVisualSearch}"
  one-click-discovery-campaigns="${args.oneClickDiscoveryCampaigns}"
  campaign-id="${args.campaignId}"
  excluded="${args.excluded}"
  add-style="${args.addStyle}"
  currency-sign="${args.currencySign}"
  price-prefix="${args.pricePrefix}"
  locale="${args.locale}"
  number-locale="${args.numberLocale}"
  mode="${args.mode}"
  show-results-in-modal="${args.showResultsInModal}"
  product-details-new-tab="${args.productDetailsNewTab}"
  product-details-redirect="${args.productDetailsRedirect}"
  api-path="${args.apiPath}"
  image-resolution-width="${args.imageResolutionWidth}"
  show-multiple-images="${args.showMultipleImages}"
  use-drag-and-drop="${args.useDragAndDrop}"
  text-search-show="${args.textSearchShow}"
  auto-suggest-show="${args.autoSuggestShow}"
  ai-suggestions-show="${args.aiSuggestionsShow}"
  add-to-basket-show="${args.addToBasketShow}"
  add-price-container="${args.addPriceContainer}"
  show-interval-inputs="${args.showIntervalInputs}"
  favorite-show="${args.favoriteShow}"
  one-click-discovery-mode="${args.oneClickDiscoveryMode}"
  css-url="${args.cssUrl}"
  results-page-url="${args.resultsPageUrl}"
  results-page-params="${args.resultsPageParams}"
></vviinn-vps-button>`;

export const Default = Template.bind({});
Default.storyName = "Search Modal";

const initArgs = {
  token: vviinnToken,
  apiPath: process.env.STORYBOOK_API_PATH,
  campaignIdTextSearch: "",
  campaignIdVisualSearch: "",
  oneClickDiscoveryCampaigns: "",
  campaignId: "",
  excluded: "",
  mode: "modal",
  showResultsInModal: true,
  productDetailsNewTab: true,
  productDetailsRedirect: true,
  locale: "en-US",
  numberLocale: "",
  currencySign: "€",
  pricePrefix: "",
  addStyle: true,
  imageResolutionWidth: 250,
  showMultipleImages: false,
  useDragAndDrop: false,
  textSearchShow: true,
  autoSuggestShow: true,
  aiSuggestionsShow: true,
  addToBasketShow: false,
  addPriceContainer: false,
  showIntervalInputs: false,
  favoriteShow: false,
  oneClickDiscoveryMode: "append-grid",
  cssUrl: "",
  resultsPageUrl: "",
  resultsPageParams: "",
  productCardImageAspectRatio: "1 / 1",
  productCardImageBgColor: "#f4f4f4",
};

Default.args = argsFromParams(initArgs);
