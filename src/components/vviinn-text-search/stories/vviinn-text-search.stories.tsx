const textSearchDecorator = (story) => `
    <style>
      vviinn-text-search {
        margin-top: 16px;
      }
    </style>
      ${story()}
  `;

export default {
  title: "Widgets/Search",
  component: "vviinn-text-search",
  decorators: [textSearchDecorator],
};

const Template = (args) => `
  <vviinn-filters show-extended-filters="true"></vviinn-filters>

  <vviinn-text-search 
    token="${args.token}"
    api-path="${args.apiPath}"
    search-query="${args.searchQuery}"
    mode="${args.mode}"
    locale="${args.locale}"
    show-in-widget="${args.showInWidget}"
  ></vviinn-text-search>
  
  <vviinn-results 
    token="${args.token}"
  ></vviinn-results>
`;

export const TextSearch = Template.bind({});

TextSearch.storyName = "Text Search";

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
