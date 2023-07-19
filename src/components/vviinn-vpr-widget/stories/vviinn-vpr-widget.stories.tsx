import { argTypes } from "./args";
import { gridDecorator, continuityDecorator } from "./decorators";

export default {
  title: "Widgets/Recommendation/Main",
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
      product-detail-new-tab="${args.productDetailNewTab}"
      color="${args.color ? args.color.slice(1) : ""}"
      grid-arrows-dynamic="${args.gridArrowsDynamic}"
      no-result-text="${args.noResultText}"
      no-result-show="${args.noResultShow}"
    >
    </vviinn-vpr-widget>
`;

export const Grid = Template.bind({});
Grid.args = {
  token:
    "eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiJ9.eyJzdWIiOjgzLCJqdGkiOiI3ZTg2Y2I1YS00ZTFjLTRhYjctYjU2My1lN2FjMTYzZTYyZDIiLCJzY29wZXMiOlsidnByIiwidnBzIiwidnBjIl19.SbaQnBkvoXer3GPCWUthFQStFKLHZNMBfj4Qu44WHM8nzaIt48I74yVy4gVbX29vtd6jIkDPdakqEXRXmAxOCtv7_nsd4iBs1yMegfOWW5g8f10PKfZqmWJcfhwKIEElnUMFmP6rXpogntZ7iFfeTBbiRNzQPhkaa7jUjgQkCC4",
  productId: "4114460310",
  campaignType: "VPR",
  campaigns: "",
  mode: "grid",
  blockTitle: "Recommended products",
  productDetailNewTab: false,
  imageWidth: 420,
  imageRatio: 1,
  locale: "en-US",
  currencySign: "€",
  pricePrefix: "",
  color: "",
  cssUrl: "",
  showScroll: false,
  noResultShow: true,
  noResultText: "No results! Please, try again later.",
  gridArrowsDynamic: false,
};

Grid.decorators = [gridDecorator];

export const Continuity = Template.bind({});
Continuity.args = {
  token:
    "eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiJ9.eyJzdWIiOjgzLCJqdGkiOiI3ZTg2Y2I1YS00ZTFjLTRhYjctYjU2My1lN2FjMTYzZTYyZDIiLCJzY29wZXMiOlsidnByIiwidnBzIiwidnBjIl19.SbaQnBkvoXer3GPCWUthFQStFKLHZNMBfj4Qu44WHM8nzaIt48I74yVy4gVbX29vtd6jIkDPdakqEXRXmAxOCtv7_nsd4iBs1yMegfOWW5g8f10PKfZqmWJcfhwKIEElnUMFmP6rXpogntZ7iFfeTBbiRNzQPhkaa7jUjgQkCC4",
  productId: "4114460310",
  campaignType: "VPR",
  campaigns: "",
  mode: "continuity",
  blockTitle: "Recommended products",
  productDetailNewTab: false,
  imageWidth: 300,
  imageRatio: 1,
  locale: "en-US",
  currencySign: "€",
  pricePrefix: "",
  color: "",
  cssUrl: "",
  showScroll: false,
  noResultShow: true,
  noResultText: "No results! Please, try again later.",
  gridArrowsDynamic: false,
};

Continuity.decorators = [continuityDecorator];
