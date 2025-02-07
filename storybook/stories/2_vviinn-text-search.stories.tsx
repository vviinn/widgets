import { vviinnToken } from "../helpers";
import "../documentation/widgets/styles.css";
import "../styles/search-page.css";

const textSearchDecorator = (story) => `
      ${story()}
  `;

export default {
  title: "Playground/Search Bar",
  component: "vviinn-text-search",
  decorators: [textSearchDecorator],
};

const Template = (args) => `
<div class="search-page-wrapper">
  <div class="search-page-wrapper-aside">
    <vviinn-cropper width=300></vviinn-cropper> 
    <vviinn-extended-filters locale="${args.locale}" mode="preview"></vviinn-extended-filters>
  </div>
  <div class="search-page-wrapper-result">
    <vviinn-text-search 
      token="${args.token}"
      api-path="${args.apiPath}"
      search-query="${args.searchQuery}"
      mode="${args.mode}"
      locale="${args.locale}"
      show-in-widget="${args.showInWidget}"
    >
    </vviinn-text-search>

    <div class="search-page-wrapper-result-filters">
      <vviinn-extended-filters locale="${args.locale}"></vviinn-extended-filters>
      <vviinn-selected-filters></vviinn-selected-filters>
    </div>

    <vviinn-results 
      token="${args.token}"
      api-path="${args.apiPath}"
      locale="${args.locale}"
      one-click-discovery-mode="append-grid"
    ></vviinn-results>
  </div>
</div>  
`;

export const TextSearch = Template.bind({});

TextSearch.storyName = "Search Bar";

TextSearch.args = {
  token: vviinnToken,
  apiPath: process.env.STORYBOOK_API_PATH,
  searchQuery: "",
  mode: "extended",
  locale: "en-US",
  showInWidget: false,
};

TextSearch.parameters = {
  design: {
    type: "figma",
    url: "https://www.figma.com/design/4xUlo6X4l7FHKcHkJRW4C4/Visual-Search-Widget?node-id=1370-226&t=iiWX4CdPIRXmBKQ3-0",
  },
};
