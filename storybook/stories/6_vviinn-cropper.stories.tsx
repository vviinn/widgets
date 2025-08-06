import "../documentation/widgets/styles.css";
import "../styles/search-page.css";
import { vviinnToken } from "../helpers";
import { argsFromParams } from "../helpers/argsFromParams";

export default {
  title: "Playground/Cropper",
  component: "vviinn-cropper",
};

const Template = (args) => `
<div class="search-page-wrapper">
  <div class="search-page-wrapper-aside cropper-page">
    <vviinn-cropper
      width="${args.width}"
      api-path="${args.apiPath}"
      save-image-mode="${args.saveImageMode}"></vviinn-cropper> 
      
    <vviinn-extended-filters mode="preview" locale="en-US"></vviinn-extended-filters>
  </div>
  <div class="search-page-wrapper-result">
    <vviinn-text-search 
      token="${args.token}"
      api-path="${args.apiPath}"
      mode="extended"
      placeholder="Upload an image to see the cropper"
      locale="en-US"
    >
    </vviinn-text-search>

    <div class="search-page-wrapper-result-filters">
      <vviinn-extended-filters locale="en-US"></vviinn-extended-filters>
      <vviinn-selected-filters locale="en-US"></vviinn-selected-filters>
    </div>

    <vviinn-results 
      token="${args.token}"
      api-path="${args.apiPath}"
      one-click-discovery-mode="append-grid"
      product-details-new-tab="true"
      locale="en-US"
    ></vviinn-results>
  </div>
</div>`;

export const Default = Template.bind({});
Default.storyName = "Cropper";

const initArgs = {
  token: vviinnToken,
  apiPath: process.env.STORYBOOK_API_PATH,
  saveImageMode: "once",
  width: 288,
};

Default.args = argsFromParams(initArgs);
