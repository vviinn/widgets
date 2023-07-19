export default {
  title: "Widgets/Search/Main",
  component: "vviinn-vps-widget",
  parameters: {
    viewport: {
      defaultViewport: "mobile2",
    },
  },
};

const Template = ({
  token,
  campaignId,
  currencySign,
  locale,
  active,
  excluded,
}) => `
  <vviinn-vps-widget token="${token}"
                     campaign-id="${campaignId}"
                     currency-sign="${currencySign}"
                     locale="${locale}"
                     active="${active}"
                     excluded="${excluded}"
                     >
  </vviinn-vps-widget>`;

export const Default = Template.bind({});
Default.args = {
  token:
    "eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiJ9.eyJzdWIiOjgzLCJqdGkiOiI3ZTg2Y2I1YS00ZTFjLTRhYjctYjU2My1lN2FjMTYzZTYyZDIiLCJzY29wZXMiOlsidnByIiwidnBzIiwidnBjIl19.SbaQnBkvoXer3GPCWUthFQStFKLHZNMBfj4Qu44WHM8nzaIt48I74yVy4gVbX29vtd6jIkDPdakqEXRXmAxOCtv7_nsd4iBs1yMegfOWW5g8f10PKfZqmWJcfhwKIEElnUMFmP6rXpogntZ7iFfeTBbiRNzQPhkaa7jUjgQkCC4",
  campaignId: "",
  locale: "en-US",
  currencySign: "€",
  active: true,
  excluded: "",
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
