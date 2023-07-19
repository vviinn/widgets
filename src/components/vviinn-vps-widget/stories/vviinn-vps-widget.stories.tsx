export default {
  title: "Widgets/Visual Search/Widget",
  component: "vviinn-vps-widget",
  parameters: {
    viewport: {
      defaultViewport: "mobile2",
    },
  },
};

const Template = ({
  token,
  apiPath,
  campaignId,
  currencySign,
  locale,
  active,
  productDetailNewTab,
}) => `
  <vviinn-vps-widget token="${token}"
                     api-path="${apiPath}"
                     campaign-id="${campaignId}"
                     currency-sign="${currencySign}"
                     locale="${locale}"
                     active="${active}"
                     product-detail-new-tab="${productDetailNewTab}">
  </vviinn-vps-widget>`;

export const Default = Template.bind({});
Default.args = {
  token:
    "eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiJ9.eyJzdWIiOjgzLCJqdGkiOiI3ZTg2Y2I1YS00ZTFjLTRhYjctYjU2My1lN2FjMTYzZTYyZDIiLCJzY29wZXMiOlsidnByIiwidnBzIiwidnBjIl19.SbaQnBkvoXer3GPCWUthFQStFKLHZNMBfj4Qu44WHM8nzaIt48I74yVy4gVbX29vtd6jIkDPdakqEXRXmAxOCtv7_nsd4iBs1yMegfOWW5g8f10PKfZqmWJcfhwKIEElnUMFmP6rXpogntZ7iFfeTBbiRNzQPhkaa7jUjgQkCC4",
  apiPath: "https://api.vviinn.com",
  campaignId: "",
  productDetailNewTab: true,
  currencySign: "€",
  locale: "en-US",
  active: true,
};

Default.storyName = "Modal Window";

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
