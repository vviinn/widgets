import { ResultsTemplate } from "../../src/components/vviinn-results/stories/ResultsTemplate";
import {
  filterValue,
  vviinnToken,
  createCSSVarDecorator,
  productCardImageAspectRatioMapping,
  productCardImageAspectRatioArg,
  productCardImageBgColorMapping,
  productCardImageBgColorArg,
} from "../helpers";
import "../styles/search-page.css";
import "../styles/playground.css";
import { argsFromParams } from "../helpers/argsFromParams";

const cssVarDecorator = createCSSVarDecorator("vviinn-results", [
  productCardImageAspectRatioMapping,
  productCardImageBgColorMapping,
]);

export default {
  title: "Playground/Product List",
  component: "vviinn-results",
  decorators: [cssVarDecorator],
  argTypes: {
    productCardImageAspectRatio: productCardImageAspectRatioArg,
    productCardImageBgColor: productCardImageBgColorArg,
  },
};

export const Default = ResultsTemplate.bind({});
Default.storyName = "Product List";

const initArgs = {
  token: vviinnToken,
  apiPath: process.env.STORYBOOK_API_PATH,
  campaignIdTextSearch: "",
  campaignIdVisualSearch: "",
  oneClickDiscoveryCampaigns: "",
  filterColumn: "product_type",
  filterValue,
  resultsCount: 9,
  imageResolutionWidth: 500,
  showMultipleImages: false,
  currencySign: "€",
  pricePrefix: "",
  locale: "en-US",
  numberLocale: "",
  productDetailsNewTab: true,
  productDetailsRedirect: true,
  addToBasketShow: false,
  searchId: "",
  oneClickDiscoveryMode: "append-grid",
  addPriceContainer: false,
  favoriteShow: true,
  cssUrl: "",
  resultsPageUrl: "",
  resultsPageParams: "",
  productCardImageAspectRatio: "1 / 1",
  productCardImageBgColor: "#f4f4f4",
};

Default.args = argsFromParams(initArgs);
