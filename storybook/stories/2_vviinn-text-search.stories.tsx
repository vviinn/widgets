import {
  vviinnToken,
  createCSSVarDecorator,
  productCardImageAspectRatioMapping,
  productCardImageAspectRatioArg,
  productCardImageBgColorMapping,
  productCardImageBgColorArg,
} from "../helpers";
import "../styles/playground.css";
import "../styles/search-page.css";
import { argsFromParams } from "../helpers/argsFromParams";

const cssVarDecorator = createCSSVarDecorator("vviinn-results", [
  productCardImageAspectRatioMapping,
  productCardImageBgColorMapping,
]);

export default {
  title: "Playground/Search Bar",
  component: "vviinn-text-search",
  decorators: [cssVarDecorator],
  argTypes: {
    productCardImageAspectRatio: productCardImageAspectRatioArg,
    productCardImageBgColor: productCardImageBgColorArg,
  },
};

const Template = (args) => `
<div class="search-page-wrapper">
  <div class="search-page-wrapper-aside">
    <vviinn-cropper token="${args.token}" api-path="${args.apiPath}"></vviinn-cropper> 
    <vviinn-extended-filters locale="${args.locale}" mode="preview"></vviinn-extended-filters>
  </div>
  <div class="search-page-wrapper-result">
    <vviinn-text-search
      token="${args.token}"
      api-path="${args.apiPath}"
      search-query="${args.searchQuery}"
      mode="${args.mode}"
      locale="${args.locale}"
      placeholder="${args.placeholder}"
      results-page-url="${args.resultsPageUrl}"
      results-page-params="${args.resultsPageParams}"
      auto-suggest-show="${args.autoSuggestShow}"
      example-image-source="${args.exampleImageSource}"
      css-url="${args.cssUrl}"
      visual-search-mode="${args.visualSearchMode}"
      use-drag-and-drop="${args.useDragAndDrop}"
    >
    </vviinn-text-search>

    <div class="search-page-wrapper-result-filters">
      <vviinn-extended-filters locale="${args.locale}"></vviinn-extended-filters>
      <vviinn-selected-filters locale="${args.locale}"></vviinn-selected-filters>
    </div>

    <vviinn-results 
      token="${args.token}"
      api-path="${args.apiPath}"
      locale="${args.locale}"
      one-click-discovery-mode="append-grid"
      product-details-new-tab="true"
    ></vviinn-results>
  </div>
</div>  
`;

export const Default = Template.bind({});

Default.storyName = "Search Bar";

const initArgs = {
  token: vviinnToken,
  apiPath: process.env.STORYBOOK_API_PATH,
  searchQuery: "",
  placeholder: "",
  resultsPageUrl: "",
  resultsPageParams: "",
  autoSuggestShow: true,
  exampleImageSource: "",
  cssUrl: "",
  visualSearchMode: "modal",
  useDragAndDrop: false,
  mode: "extended",
  locale: "en-US",
  productCardImageAspectRatio: "1 / 1",
  productCardImageBgColor: "#f4f4f4",
};

Default.parameters = {
  design: {
    type: "figma",
    url: "https://www.figma.com/design/4xUlo6X4l7FHKcHkJRW4C4/Visual-Search-Widget?node-id=1370-226&t=iiWX4CdPIRXmBKQ3-0",
  },
};

Default.args = argsFromParams(initArgs);
