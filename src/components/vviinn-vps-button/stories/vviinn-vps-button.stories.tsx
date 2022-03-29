export default {
  title: "Widgets/Visual Search Button",
  component: "vviinn-vps-button",
  parameters: {
    viewport: {
      defaultViewport: "mobile2"
    }
  },
  decorators: [(story: () => any) => `
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
  `],
};

const Template = (args) => `
<vviinn-vps-button
  api-path="${args.apiPath}"
  token="${args.token}"
></vviinn-vps-button>`;

export const Default = Template.bind({});
Default.args = {
  token: "eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiJ9.eyJzdWIiOjgzLCJqdGkiOiI3ZTg2Y2I1YS00ZTFjLTRhYjctYjU2My1lN2FjMTYzZTYyZDIiLCJzY29wZXMiOlsidnByIiwidnBzIiwidnBjIl19.SbaQnBkvoXer3GPCWUthFQStFKLHZNMBfj4Qu44WHM8nzaIt48I74yVy4gVbX29vtd6jIkDPdakqEXRXmAxOCtv7_nsd4iBs1yMegfOWW5g8f10PKfZqmWJcfhwKIEElnUMFmP6rXpogntZ7iFfeTBbiRNzQPhkaa7jUjgQkCC4",
  apiPath: "https://api.vviinn.com"
};
