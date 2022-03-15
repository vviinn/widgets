import { withDesign } from "storybook-addon-designs";

export default {
  title: "Widgets/Visual Recommendation Button",
  component: "vviinn-vpr-button",
  decorators: [withDesign],
};

const Template = (args): any =>
  `<vviinn-vpr-button token="${args.token}" product-id="${args.productId}"></vviinn-vpr-button>`;

export const Default = Template.bind({});

Default.args = {
  token:
    "eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiJ9.eyJzdWIiOjgzLCJqdGkiOiI3ZTg2Y2I1YS00ZTFjLTRhYjctYjU2My1lN2FjMTYzZTYyZDIiLCJzY29wZXMiOlsidnByIiwidnBzIiwidnBjIl19.SbaQnBkvoXer3GPCWUthFQStFKLHZNMBfj4Qu44WHM8nzaIt48I74yVy4gVbX29vtd6jIkDPdakqEXRXmAxOCtv7_nsd4iBs1yMegfOWW5g8f10PKfZqmWJcfhwKIEElnUMFmP6rXpogntZ7iFfeTBbiRNzQPhkaa7jUjgQkCC4",
  productId: "4114460310",
};

Default.parameters = {
  design: {
    type: "figma",
    url: "https://www.figma.com/file/YR5ZK1s4z9ZRUXytB8uVuj/Widgets?node-id=591%3A3859",
  },
};
