const resultsDecorator = (story) => `
    <div style="">
      ${story()}
    </div>
  `;

export default {
  title: "Elements/Results",
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
filter-column="${args.filterColumn}"
filter-value="${args.filterValue}"
results-count="${args.resultsCount}"
><vviinn-results/>`;

export const Default = Template.bind({});

Default.storyName = "Results";

Default.args = {
  token: process.env.STORYBOOK_TOKEN,
  apiPath: process.env.STORYBOOK_API_PATH,
  searchId: "",
  textSearchQuery: "",
  filterColumn: "product_type",
  filterValue: "Bänke",
  resultsCount: 12,
  imageResolutionWidth: 250,
  currencySign: "€",
  locale: "en-US",
  productDetailsRedirect: true,
  productDetailsNewTab: false,
  showInWidget: false,
  uiSessionId: "",
};
