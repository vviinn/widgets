import { vviinnToken } from "../helpers";
import "../documentation/widgets/styles.css";

export default {
  title: "Playground/Search Modal",
  component: "vviinn-vps-button",
  decorators: [
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
  campaign-id="${args.campaignId}"
  excluded="${args.excluded}"
  add-style="${args.addStyle}"
  currency-sign="${args.currencySign}"
  price-prefix="${args.pricePrefix}"
  locale="${args.locale}"
  mode="${args.mode}"
  product-details-new-tab="${args.productDetailsNewTab}"
  product-details-redirect="${args.productDetailsRedirect}"
  api-path="${args.apiPath}"
  image-resolution-width="${args.imageResolutionWidth}"
  text-search-show="${args.textSearchShow}"
  add-to-basket-show="${args.addToBasketShow}"
  add-price-container="${args.addPriceContainer}"
  favorite-show="${args.favoriteShow}"
  one-click-discovery-show="${args.oneClickDiscoveryShow}"
  one-click-discovery-campaigns="${args.oneClickDiscoveryCampaigns}"
></vviinn-vps-button>`;

export const Default = Template.bind({});
Default.storyName = "Search Modal";

Default.args = {
  token: vviinnToken,
  apiPath: process.env.STORYBOOK_API_PATH,
  campaignId: "",
  excluded: "",
  mode: "modal",
  productDetailsNewTab: true,
  productDetailsRedirect: true,
  locale: "en-US",
  currencySign: "€",
  pricePrefix: "",
  addStyle: true,
  imageResolutionWidth: 250,
  textSearchShow: true,
  addToBasketShow: false,
  addPriceContainer: false,
  favoriteShow: false,
  oneClickDiscoveryShow: true,
  oneClickDiscoveryCampaigns: "",
};
