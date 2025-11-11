import { ResultsTemplate } from "../../src/components/vviinn-results/stories/ResultsTemplate";
import { filterValue, vviinnToken } from "../helpers";
import "../styles/search-page.css";
import "../documentation/widgets/styles.css";
import { argsFromParams } from "../helpers/argsFromParams";

export default {
  title: "Playground/Product List",
  component: "vviinn-results",
};

export const Default = ResultsTemplate.bind({});
Default.storyName = "Product List";

const initArgs = {
  token: vviinnToken,
  campaignIdTextSearch: "",
  campaignIdVisualSearch: "",
  oneClickDiscoveryCampaigns: "",
  filterColumn: "product_type",
  filterValue,
  apiPath: process.env.STORYBOOK_API_PATH,
  resultsCount: 9,
  imageResolutionWidth: 500,
  showMultipleImages: false,
  currencySign: "€",
  pricePrefix: "",
  locale: "en-US",
  productDetailsNewTab: true,
  productDetailsRedirect: true,
  addToBasketShow: false,
  uiSessionId: "",
  searchId: "",
  oneClickDiscoveryMode: "append-grid",
  addPriceContainer: false,
  favoriteShow: true,
  cssUrl: "",
};

Default.args = argsFromParams(initArgs);
