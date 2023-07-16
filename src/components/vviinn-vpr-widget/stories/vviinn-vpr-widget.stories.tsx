import { argTypes } from "./args";
import { gridDecorator, continuityDecorator } from "./decorators";

export default {
  title: "Widgets/Recommendations/Main",
  component: "vviinn-vpr-widget",
  argTypes: {
    ...argTypes,
    mode: {
      table: {
        disable: true,
      },
    },
  },
};

const Template = (args) => `
    <vviinn-vpr-widget
      block-title="${args.blockTitle}"
      css-url="${args.cssUrl}"
      currency-sign="${args.currencySign}"
      show-scroll="${args.showScroll}"
      image-ratio="${args.imageRatio}"
      locale="${args.locale}"
      price-prefix="${args.pricePrefix}"
      product-id="${args.productId}"
      token="${args.token}"
      mode="${args.mode}"
      image-width="${args.imageWidth}"
      campaign-type="${args.campaignType}"
      campaigns="${args.campaigns}"
      color="${args.color ? args.color.slice(1) : ""}"
      grid-arrows-dynamic="${args.gridArrowsDynamic}"
      no-result-text="${args.noResultText}"
      no-result-show="${args.noResultShow}"
    >
    </vviinn-vpr-widget>
`;

export const Continuity = Template.bind({});
Continuity.args = {
  campaigns: "",
  campaignType: "VPR",
  imageWidth: 300,
  mode: "continuity",
  color: "",
  productId: "4114460310",
  showScroll: false,
  blockTitle: "Recommended products",
  cssUrl: "",
  locale: "en-US",
  currencySign: "€",
  pricePrefix: "",
  imageRatio: 1,
  noResultText: "No results! Please, try again later.",
  noResultShow: true,
  gridArrowsDynamic: false,
  token:
    "eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiJ9.eyJzdWIiOjgzLCJqdGkiOiI3ZTg2Y2I1YS00ZTFjLTRhYjctYjU2My1lN2FjMTYzZTYyZDIiLCJzY29wZXMiOlsidnByIiwidnBzIiwidnBjIl19.SbaQnBkvoXer3GPCWUthFQStFKLHZNMBfj4Qu44WHM8nzaIt48I74yVy4gVbX29vtd6jIkDPdakqEXRXmAxOCtv7_nsd4iBs1yMegfOWW5g8f10PKfZqmWJcfhwKIEElnUMFmP6rXpogntZ7iFfeTBbiRNzQPhkaa7jUjgQkCC4",
};

Continuity.decorators = [continuityDecorator];

export const Grid = Template.bind({});
Grid.args = {
  campaigns: "",
  campaignType: "VPR",
  imageWidth: 420,
  mode: "grid",
  color: "",
  productId: "4114460310",
  showScroll: true,
  blockTitle: "Recommended products",
  cssUrl: "",
  locale: "en-US",
  currencySign: "€",
  pricePrefix: "",
  imageRatio: 1,
  noResultText: "No results! Please, try again later.",
  noResultShow: true,
  gridArrowsDynamic: false,
  token:
    "eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiJ9.eyJzdWIiOjgzLCJqdGkiOiI3ZTg2Y2I1YS00ZTFjLTRhYjctYjU2My1lN2FjMTYzZTYyZDIiLCJzY29wZXMiOlsidnByIiwidnBzIiwidnBjIl19.SbaQnBkvoXer3GPCWUthFQStFKLHZNMBfj4Qu44WHM8nzaIt48I74yVy4gVbX29vtd6jIkDPdakqEXRXmAxOCtv7_nsd4iBs1yMegfOWW5g8f10PKfZqmWJcfhwKIEElnUMFmP6rXpogntZ7iFfeTBbiRNzQPhkaa7jUjgQkCC4",
};

Grid.decorators = [gridDecorator];
