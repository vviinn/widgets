const resultsDecorator = (story) => `
    <div style="">
      ${story()}
    </div>
  `;

export default {
  title: "Components/Results",
  component: "vviinn-results",
  decorators: [resultsDecorator],
};

const Template = (args) => `<vviinn-results
token="${args.token}"
api-path="${args.apiPath}"
search-id="${args.searchId}"
image-resolution-width="${args.imageResolutionWidth}"
currency-sign="${args.currencySign}"
locale="${args.locale}"
product-details-redirect="${args.productDetailsRedirect}"
product-details-new-tab="${args.productDetailsNewTab}"
show-in-widget="${args.showInWidget}"
text-search-query="${args.textSearchQuery}"
ui-session-id="${args.uiSessionId}"
><vviinn-results/>`;

export const Default = Template.bind({});

Default.storyName = "Results";

Default.args = {
  token: process.env.STORYBOOK_TOKEN,
  apiPath: process.env.STORYBOOK_API_PATH,
  searchId: "",
  imageResolutionWidth: 250,
  currencySign: "€",
  locale: "en-US",
  productDetailsRedirect: true,
  productDetailsNewTab: false,
  showInWidget: false,
  textSearchQuery: "",
  uiSessionId: "",
};
