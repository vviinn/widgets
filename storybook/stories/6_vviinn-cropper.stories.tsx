import "../documentation/widgets/styles.css";
import "../styles/search-page.css";
import { vviinnToken } from "../helpers";

export default {
  title: "Playground/Cropper",
  component: "vviinn-cropper",
};

const Template = (args) => `
<div class="search-page-wrapper">
  <div class="search-page-wrapper-aside">
    <vviinn-cropper
      width="${args.width}"
      detected-objects-string='${args.detectedObjectsString}'
      api-path="${args.apiPath}"
      save-image-mode="${args.saveImageMode}"
      url="${args.url}"></vviinn-cropper> 
      
    <vviinn-extended-filters mode="preview"></vviinn-extended-filters>
  </div>
  <div class="search-page-wrapper-result">
    <vviinn-text-search 
      token="${args.token}"
      api-path="${args.apiPath}"
      mode="extended"
      show-in-widget="${args.showInWidget}"
      placeholder="Upload an image to see the cropper"
    >
    </vviinn-text-search>

    <div class="search-page-wrapper-result-filters">
      <vviinn-extended-filters></vviinn-extended-filters>
      <vviinn-selected-filters></vviinn-selected-filters>
    </div>

    <vviinn-results 
      token="${args.token}"
      api-path="${args.apiPath}"
      one-click-discovery-mode="append-grid"
    ></vviinn-results>
  </div>
</div>`;

export const Default = Template.bind({});
Default.storyName = "Cropper";

Default.args = {
  token: vviinnToken,
  apiPath: process.env.STORYBOOK_API_PATH,
  saveImageMode: "never",
  url: "",
  width: 300,
  detectedObjectsString: "",
};
