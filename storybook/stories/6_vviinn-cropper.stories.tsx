import { imageURLExample } from "../documentation/components/constants";
import "../documentation/widgets/styles.css";
import "../styles/search-page.css";
import { vviinnToken } from "../helpers";

export default {
  title: "Playground/Cropper",
  component: "vviinn-cropper",
};

const Template = (args) => `
<div class="search-page-wrapper">
    <vviinn-cropper
      width="${args.width}"
      detected-objects-string='${args.detectedObjectsString}'
      api-path="${args.apiPath}"
      save-image-mode="${args.saveImageMode}"
      url="${args.url}"
    ></vviinn-cropper>

    <vviinn-text-search 
      token="${vviinnToken}"
      api-path="${args.apiPath}"
      mode="extended"
      locale="en-US"
    ></vviinn-text-search>

    <vviinn-results 
      token="${vviinnToken}"
      api-path="${args.apiPath}"
      one-click-discovery-mode="append-grid"
      locale="en-US"
    ></vviinn-results>
  </div>
</div>  
`;

export const Default = Template.bind({});
Default.storyName = "Cropper";

Default.args = {
  apiPath: process.env.STORYBOOK_API_PATH,
  saveImageMode: "never",
  url: imageURLExample,
  width: 300,
  detectedObjectsString: "",
};
