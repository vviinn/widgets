const defaultWidget = `<vviinn-vps-button 
    token="TOKEN" 
    locale="en-US"
    add-style="true"
></vviinn-vps-button>`;
const widgetCode = (extraProps?: string) => {
  return extraProps
    ? `${defaultWidget.slice(0, 18)}\n    ${extraProps}${defaultWidget.slice(18)}`
    : defaultWidget;
};

export const searchModalConstants = {
  image: {
    groupId: "imageModal",
    header: "Image Search (default)",
    code: widgetCode(),
    descriptionText: "Search with Image and Camera",
  },
  full: {
    groupId: "fullModal",
    header: "Full Search",
    code: widgetCode('text-search-show="true"'),
    descriptionText: "Search with Image, Text, and Camera",
  },
  upload: {
    groupId: "uploadModal",
    header: "Upload Mode",
    code: widgetCode('mode="upload"'),
    descriptionText: "Directly opens image upload for Image Search",
  },
  camera: {
    groupId: "cameraModal",
    header: "Camera Mode",
    code: widgetCode('mode="camera"'),
    descriptionText: "Search with Camera",
  },
};

//  camera: {
//     groupId: "cameraModal",
//     header: "",
//     code: ``,
//     descriptionText:""
//   },
