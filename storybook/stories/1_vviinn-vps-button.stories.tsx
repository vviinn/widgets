import { vviinnToken } from "../helpers";

export default {
  title: "Playground/Search Modal",
  component: "vviinn-vps-button",
  parameters: {
    viewport: {
      defaultViewport: "mobile2",
    },
  },
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
  locale="${args.locale}"
  mode="${args.mode}"
  product-details-new-tab="${args.productDetailsNewTab}"
  product-details-redirect="${args.productDetailsRedirect}"
  api-path="${args.apiPath}"
  image-resolution-width="${args.imageResolutionWidth}"
  text-search-show="${args.textSearchShow}"
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
  addStyle: true,
  imageResolutionWidth: 250,
  textSearchShow: true,
};
