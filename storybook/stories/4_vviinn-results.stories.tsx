import { ResultsTemplate } from "../../src/components/vviinn-results/stories/ResultsTemplate";
import { filterValue, vviinnToken } from "../helpers";
import "../styles/search-page.css";
import "../documentation/widgets/styles.css";

export default {
  title: "Playground/Product List",
  component: "vviinn-results",
};

export const ProductList = ResultsTemplate.bind({});
ProductList.storyName = "Product List";
ProductList.args = {
  token: vviinnToken,
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
  oneClickDiscoveryMode: "modal",
  addPriceContainer: false,
  favoriteShow: false,
  oneClickDiscoveryCampaigns: "",
};
