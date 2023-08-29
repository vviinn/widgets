export default {
  title: "Widgets/Search/Main",
  component: "vviinn-vps-widget",
  parameters: {
    viewport: {
      defaultViewport: "mobile2",
    },
  },
};

const Template = (args) => `
  <vviinn-vps-widget token="${args.token}"
    campaign-id="${args.campaignId}"
    currency-sign="${args.currencySign}"
    locale="${args.locale}"
    active="${args.active}"
    excluded="${args.excluded}"
    product-detail-new-tab="${args.productDetailNewTab}"
    api-path="${args.apiPath}"
    image-resolution-width="${args.imageResolutionWidth}"
  >
  </vviinn-vps-widget>`;

export const Default = Template.bind({});
Default.args = {
  token:
    "eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiJ9.eyJzdWIiOjgzLCJqdGkiOiI3ZTg2Y2I1YS00ZTFjLTRhYjctYjU2My1lN2FjMTYzZTYyZDIiLCJzY29wZXMiOlsidnByIiwidnBzIiwidnBjIl19.SbaQnBkvoXer3GPCWUthFQStFKLHZNMBfj4Qu44WHM8nzaIt48I74yVy4gVbX29vtd6jIkDPdakqEXRXmAxOCtv7_nsd4iBs1yMegfOWW5g8f10PKfZqmWJcfhwKIEElnUMFmP6rXpogntZ7iFfeTBbiRNzQPhkaa7jUjgQkCC4",
  campaignId: "",
  excluded: "",
  productDetailNewTab: true,
  locale: "en-US",
  currencySign: "€",
  active: true,
  apiPath: "https://api.vviinn.com",
  imageResolutionWidth: 250,
};

Default.storyName = "Main";

Default.decorators = [
  (Story) => `
<style>
.sb-show-main.sb-main-padded {
  padding: unset;
}

#root {
  align-content: center;
  display: grid;
  height: 100vh;
  justify-items: center;
}
</style>
${Story()}`,
];
