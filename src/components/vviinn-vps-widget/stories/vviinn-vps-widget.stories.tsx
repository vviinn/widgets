import { STORYBOOK_API_PATH, STORYBOOK_TOKEN } from "../../../storybook";

export default {
  title: "Widgets/Search/Main",
  component: "vviinn-vps-widget",
  parameters: {
    viewport: {
      defaultViewport: "mobile2",
    },
  },
};

const Template = (args) => `
  <vviinn-vps-widget token="${args.token}"
    campaign-id="${args.campaignId}"
    currency-sign="${args.currencySign}"
    locale="${args.locale}"
    active="${args.active}"
    excluded="${args.excluded}"
    product-detail-new-tab="${args.productDetailNewTab}"
    api-path="${args.apiPath}"
    image-resolution-width="${args.imageResolutionWidth}"
    text-search-show="${args.textSearchShow}"
  >
  </vviinn-vps-widget>`;

export const Default = Template.bind({});
Default.args = {
  token: STORYBOOK_TOKEN,
  campaignId: "",
  excluded: "",
  productDetailNewTab: true,
  locale: "en-US",
  currencySign: "€",
  active: true,
  apiPath: STORYBOOK_API_PATH,
  imageResolutionWidth: 250,
  textSearchShow: false,
};

Default.storyName = "Main";

Default.decorators = [
  (Story) => `
<style>
.sb-show-main.sb-main-padded {
  padding: unset;
}

#root {
  align-content: center;
  display: grid;
  height: 100vh;
  justify-items: center;
}
</style>
${Story()}`,
];
