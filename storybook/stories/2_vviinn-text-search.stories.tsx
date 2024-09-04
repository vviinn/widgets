const textSearchDecorator = (story) => `
    <style>
      vviinn-filters {
        margin: 12px 0;
      }
      vviinn-selected-filters{
        margin: 12px 0;
      }
      vviinn-extended-filters {
        width: fit-content;
        margin-left: auto;
      }

      vviinn-results {
        margin: 20px 0;
      }
    </style>
      ${story()}
  `;

export default {
  title: "Playground/Search Bar",
  component: "vviinn-text-search",
  decorators: [textSearchDecorator],
};

const Template = (args) => `
  <vviinn-extended-filters></vviinn-extended-filters>
  <vviinn-filters></vviinn-filters>
  <vviinn-text-search 
    token="${args.token}"
    api-path="${args.apiPath}"
    search-query="${args.searchQuery}"
    mode="${args.mode}"
    locale="${args.locale}"
    show-in-widget="${args.showInWidget}"
  ></vviinn-text-search>
  <vviinn-selected-filters></vviinn-selected-filters>
  <vviinn-results 
    token="${args.token}"
    api-path="${args.apiPath}"
  ></vviinn-results>
`;

export const TextSearch = Template.bind({});

TextSearch.storyName = "Search Bar";

TextSearch.args = {
  token: process.env.STORYBOOK_TOKEN,
  apiPath: process.env.STORYBOOK_API_PATH,
  searchQuery: "",
  mode: "textAndImage",
  locale: "en-US",
  showInWidget: false,
};

TextSearch.parameters = {
  design: {
    type: "figma",
    url: "https://www.figma.com/design/4xUlo6X4l7FHKcHkJRW4C4/Visual-Search-Widget?node-id=1370-226&t=iiWX4CdPIRXmBKQ3-0",
  },
};
