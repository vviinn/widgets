import { vviinnToken, shopTheLookImageUrls } from "../helpers";

import { argsFromParams } from "../helpers/argsFromParams";
import "../styles/playground.css";

export default {
  title: "Playground/Shop-the-Look",
  component: "vviinn-shop-the-look",
};

const Template = (args) => `
    <vviinn-shop-the-look
      image-urls="${args.imageUrls}"
      token="${args.token}"
      height="${args.height}"
      currency-sign="${args.currencySign}"
      campaign-id="${args.campaignId}"
      api-path="${args.apiPath}"
      locale="${args.locale}"
      number-locale="${args.numberLocale}"
      widget-style="${args.widgetStyle}"
      show-cropper="${args.showCropper}"
      upload-mode="${args.uploadMode}"
      show-multiple-images="${args.showMultipleImages}"
      image-resolution-width="${args.imageResolutionWidth}"
      product-details-new-tab="${args.productDetailsNewTab}"
      product-details-redirect="${args.productDetailsRedirect}"
      css-url="${args.cssUrl}"
    ></vviinn-shop-the-look>
`;

export const Default = Template.bind({});
Default.storyName = "Shop-the-Look";

const initArgs = {
  token: vviinnToken,
  apiPath: process.env.STORYBOOK_API_PATH,
  imageUrls: shopTheLookImageUrls.join(","),
  height: 500,
  currencySign: "€",
  campaignId: "",
  locale: "en-US",
  numberLocale: "",
  widgetStyle: "rounded",
  showCropper: false,
  uploadMode: false,
  showMultipleImages: false,
  imageResolutionWidth: 300,
  productDetailsNewTab: false,
  productDetailsRedirect: true,
  cssUrl: "",
};

Default.args = argsFromParams(initArgs);
