import { vviinnToken } from "../../../../storybook/helpers";

export const generalArgs = {
  token: vviinnToken,
  apiPath: process.env.STORYBOOK_API_PATH,
  resultsCount: 12,
  imageResolutionWidth: 500,
  currencySign: "€",
  locale: "en-US",
  productDetailsRedirect: true,
  productDetailsNewTab: false,
  addToBasketShow: false,
  showInWidget: false,
  uiSessionId: "",
  searchId: "",
  showOneClickDiscovery: true,
  addPriceContainer: false,
};
