import { codeWithExtraProps } from "../../../../helpers/codeWithExtraProps";

const defaultWidget = `<vviinn-vps-button 
    token="TOKEN" 
    locale="en-US"
    add-style="true"
></vviinn-vps-button>`;

export const searchModalConstants = {
  image: {
    groupId: "imageModal",
    header: "Image Search (default)",
    code: codeWithExtraProps(defaultWidget),
    descriptionText: "Search with Image and Camera",
  },
  full: {
    groupId: "fullModal",
    header: "Full Search",
    code: codeWithExtraProps(defaultWidget, '    text-search-show="true"'),
    descriptionText: "Search with Image, Text, and Camera",
  },
  upload: {
    groupId: "uploadModal",
    header: "Upload Mode",
    code: codeWithExtraProps(defaultWidget, '    mode="upload"'),
    descriptionText: "Directly opens image upload for Image Search",
  },
  camera: {
    groupId: "cameraModal",
    header: "Camera Mode",
    code: codeWithExtraProps(defaultWidget, '    mode="camera"'),
    descriptionText: "Search with Camera",
  },
};

//  camera: {
//     groupId: "cameraModal",
//     header: "",
//     code: ``,
//     descriptionText:""
//   },
