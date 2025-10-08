import { vviinnToken } from "../helpers";
import { argsFromParams } from "../helpers/argsFromParams";
import "../documentation/widgets/styles.css";

export default {
  title: "Playground/Shop The Look",
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
Default.storyName = "Shop The Look";

const initArgs = {
  token: vviinnToken,
  imageUrls:
    "https://images.unsplash.com/photo-1717076521696-ea6d8ed0963a?q=80&w=1064&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D, https://images.unsplash.com/photo-1729086046027-09979ade13fd?q=80&w=1124&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D, https://images.unsplash.com/photo-1613807871118-9e983601b759?w=900&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8OXx8dmVydGljYWwlMjBpbWFnZSUyMGludGVyaW9yJTIwcm9vbSUyMGNoYWlyfGVufDB8fDB8fHwy, https://images.unsplash.com/photo-1676786318418-4740318c2246?q=80&w=822&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
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
