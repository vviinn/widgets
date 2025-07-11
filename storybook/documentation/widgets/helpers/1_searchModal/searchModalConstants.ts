import { codeWithExtraProps } from "../../../../helpers/codeWithExtraProps";

const defaultWidget = `<vviinn-vps-button 
    token="TOKEN" 
    locale="en-US"
    add-style="true"
></vviinn-vps-button>`;

export const searchModalConstants = {
  image: {
    tabData: {
      groupId: "imageModal",
      header: "Image Search (default)",
      code: defaultWidget,
      descriptionText: "Search with Image and Camera",
    },
    componentProps: {},
  },

  full: {
    tabData: {
      groupId: "fullModal",
      header: "Full Search",
      code: codeWithExtraProps(defaultWidget, '    text-search-show="true"'),
      descriptionText: "Search with Image, Text, and Camera",
    },
    componentProps: { textSearchShow: true },
  },
  upload: {
    tabData: {
      groupId: "uploadModal",
      header: "Upload Mode",
      code: codeWithExtraProps(defaultWidget, '    mode="upload"'),
      descriptionText: "Directly opens image upload for Image Search",
    },
    componentProps: { mode: "upload" },
  },
  camera: {
    tabData: {
      groupId: "cameraModal",
      header: "Camera Mode",
      code: codeWithExtraProps(defaultWidget, '    mode="camera"'),
      descriptionText: "Search with Camera",
    },
    componentProps: { mode: "camera" },
  },
};
