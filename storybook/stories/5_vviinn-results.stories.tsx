import { ResultsTemplate } from "../../src/components/vviinn-results/stories/ResultsTemplate";
import { filterValue, vviinnToken } from "../helpers";
import "../styles/search-page.css";
import "../documentation/widgets/styles.css";

export default {
  title: "Playground/Product List",
  component: "vviinn-results",
};

export const Default = ResultsTemplate.bind({});
Default.storyName = "Product List";
Default.args = {
  token: vviinnToken,
  campaignIdTextSearch: "",
  campaignIdVisualSearch: "",
  oneClickDiscoveryCampaigns: "",
  filterColumn: "product_type",
  filterValue,
  apiPath: process.env.STORYBOOK_API_PATH,
  resultsCount: 12,
  imageResolutionWidth: 500,
  currencySign: "€",
  pricePrefix: "",
  locale: "en-US",
  productDetailsRedirect: true,
  productDetailsNewTab: false,
  addToBasketShow: false,
  uiSessionId: "",
  searchId: "",
  oneClickDiscoveryMode: "append-grid",
  addPriceContainer: false,
  favoriteShow: true,
};
