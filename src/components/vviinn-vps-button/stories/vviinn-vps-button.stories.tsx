import { STORYBOOK_TOKEN } from "../../../network/constants";

export default {
  title: "Widgets/Search/Button",
  component: "vviinn-vps-button",
  parameters: {
    viewport: {
      defaultViewport: "mobile2",
    },
  },
  decorators: [
    (story) => `
    <div style="display: grid;
                position: absolute;
                top: 0;
                bottom: 0;
                left: 0;
                right: 0;
                align-items: center;
                justify-items: center;">
      ${story()}
    </div>
  `,
  ],
};

const Template = (args) => `
<vviinn-vps-button
  token="${args.token}"
  campaign-id="${args.campaignId}"
  excluded="${args.excluded}"
  add-style="${args.addStyle}"
  currency-sign="${args.currencySign}"
  locale="${args.locale}"
  mode="${args.mode}"
  product-detail-new-tab="${args.productDetailNewTab}"
  api-path="${args.apiPath}"
  image-resolution-width="${args.imageResolutionWidth}"
  text-search-show="${args.textSearchShow}"
></vviinn-vps-button>`;

export const Modal = Template.bind({});
Modal.storyName = "Modal";

Modal.args = {
  token: STORYBOOK_TOKEN,
  campaignId: "",
  excluded: "",
  mode: "modal",
  productDetailNewTab: true,
  locale: "en-US",
  currencySign: "€",
  addStyle: true,
  apiPath: "https://api.vviinn.com",
  imageResolutionWidth: 250,
  textSearchShow: false,
};

export const Upload = Template.bind({});

Upload.args = {
  token:
    "eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiJ9.eyJzdWIiOjgzLCJqdGkiOiI3ZTg2Y2I1YS00ZTFjLTRhYjctYjU2My1lN2FjMTYzZTYyZDIiLCJzY29wZXMiOlsidnByIiwidnBzIiwidnBjIl19.skAkdwLTQ0sfeqfMCHWRN3QmoNGjb6YEUr3Z5mt9wvXyl447EXTx7nYRIpCVSF6T65bo5BEbDsCyjCII5jpfNWVgmHzNWfm9ZZ1_4vPdl7QsdMfQ7RZ6zEdVwCGVkQr34OLmsrHrSwnVv22Lkf74X_0uEkh1AUZcyTC8lGzdV0rYaipBIg47yKx1MpK3QegaXwCNshuPPDbl9s_Y-tiGkBI2761fElDaEIXUkeWLvkwL3Y2pUO3CpfzDYdS6coS0blBq_yCfuw_u2bkJbakg2JOiGkFnUBA7bZcDaLhx7Yl7ofsVeObaRic77wJR9cIU4RVec26kPTXw2Wxi4sjfmg",
  campaignId: "",
  excluded: "",
  mode: "upload",
  productDetailNewTab: true,
  locale: "en-US",
  currencySign: "€",
  addStyle: true,
  apiPath: "https://api.vviinn.com",
  imageResolutionWidth: 250,
};
