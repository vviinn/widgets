import { argTypes } from "./args";

const centerDecorator = (story) => `
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
  `;

export default {
  title: "Widgets/Recommendation/Button",
  component: "vviinn-vpr-button",
  decorators: [centerDecorator],
  argTypes,
};

const Template = (args) =>
  `<vviinn-vpr-button token="${args.token}"
                      product-id="${args.productId}"
                      campaign-type="${args.campaignType}"
                      position="${args.position}"
                      add-style="${args.addStyle}"
                      sidebar-title="${args.sidebarTitle}"
                      currency-sign="${args.currencySign}"
                      modal-scrollbar="${args.modalScrollbar}"
                      mode="${args.mode}"
                      campaigns="${args.campaigns}"
                      image-width="${args.imageWidth}"
                      color="${
                        args.color ? args.color.toString().slice(1) : ""
                      }"
                      no-result-text="${args.noResultText}"
                      no-result-show="${args.noResultShow}"
                      grid-arrows-dynamic="${args.gridArrowsDynamic}"
                      source-image="${args.sourceImage}"></vviinn-vpr-button>`;

export const Default = Template.bind({});

Default.storyName = "Button";

Default.args = {
  token:
    "eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiJ9.eyJzdWIiOjgzLCJqdGkiOiI3ZTg2Y2I1YS00ZTFjLTRhYjctYjU2My1lN2FjMTYzZTYyZDIiLCJzY29wZXMiOlsidnByIiwidnBzIiwidnBjIl19.SbaQnBkvoXer3GPCWUthFQStFKLHZNMBfj4Qu44WHM8nzaIt48I74yVy4gVbX29vtd6jIkDPdakqEXRXmAxOCtv7_nsd4iBs1yMegfOWW5g8f10PKfZqmWJcfhwKIEElnUMFmP6rXpogntZ7iFfeTBbiRNzQPhkaa7jUjgQkCC4",
  productId: "4114460310",
  campaignType: "VPR",
  campaigns: "",
  color: "",
  currencySign: "€",
  position: "bottom",
  addStyle: true,
  sidebarTitle: "Visually similar products",
  modalScrollbar: false,
  mode: "continuity",
  imageWidth: "300",
  sourceImage:
    "https://www.moebel-shop.de/media/image/e3/e9/28/0749295-001_600x600.jpg",
  noResultText: "No results! Please, try again later.",
  noResultShow: true,
  gridArrowsDynamic: false,
};

Default.parameters = {
  design: {
    type: "figma",
    url: "https://www.figma.com/file/YR5ZK1s4z9ZRUXytB8uVuj/Widgets?node-id=591%3A3859",
  },
};
