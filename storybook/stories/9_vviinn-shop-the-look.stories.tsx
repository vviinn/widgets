import { vviinnToken, shopTheLookImageUrls } from "../helpers";

import { argsFromParams } from "../helpers/argsFromParams";
import "../documentation/widgets/styles.css";

export default {
  title: "Playground/Shop-the-Look",
  component: "vviinn-shop-the-look",
  parameters: {
    badges: ["beta", "experimental"],
    docs: {
      description: {
        component: "experimental",
      },
    },
  },
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
      widget-style="${args.widgetStyle}"
      show-cropper="${args.showCropper}"
      upload-mode="${args.uploadMode}"
    ></vviinn-shop-the-look>
`;

export const Default = Template.bind({});
Default.storyName = "Shop-the-Look";

const initArgs = {
  token: vviinnToken,
  imageUrls: shopTheLookImageUrls.join(","),
  height: 500,
  currencySign: "€",
  campaignId: "",
  apiPath: process.env.STORYBOOK_API_PATH,
  locale: "en-US",
  widgetStyle: "rounded",
  showCropper: false,
  uploadMode: false,
};

Default.args = argsFromParams(initArgs);
