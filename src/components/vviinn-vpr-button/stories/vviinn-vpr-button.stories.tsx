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
  title: "Widgets/Visual Recommendations/Button",
  component: "vviinn-vpr-button",
  decorators: [centerDecorator],
  argTypes,
};

const Template = (args) =>
  `<style>
     body {
       font-family: ${args.font};
     }

     vviinn-vpr-button::part(button) {
       width: ${args.buttonSize}px;
       height: ${args.buttonSize}px;
       background: ${args.backgroundColor};
       opacity: ${args.backgroundOpacity}%;
       border-radius: ${args.radius}px;
       border: ${args.border ? "1px solid" : "none"};
       border-color: ${args.borderColor};
       ${args.shadow ? "" : "box-shadow: none;"}
     }

     vviinn-recommendations-sidebar::part(title) {
       display: ${args.modalTitle ? "inline" : "none"};
       font-size: ${args.modalTitleFontSize}px;
     }

     vviinn-recommendations-sidebar::part(product-title),
     vviinn-recommendations-sidebar::part(brand),
     vviinn-recommendations-sidebar::part(type),
     vviinn-recommendations-sidebar::part(price-regular),
     vviinn-recommendations-sidebar::part(price-sale) {
       color: ${args.primaryTextColor};
     }

     vviinn-recommendations-sidebar::part(price-outdated) {
       color: ${args.secondaryTextColor};
     }

     vviinn-recommendations-sidebar.open {
       background: rgba(0, 0, 0, 0.1);
     }

     vviinn-recommendations-sidebar::part(body) {
       border-radius: ${args.sidebarBorderRadius}px ${
    args.sidebarBorderRadius
  }px 0 0;
     }

     vviinn-recommendations-sidebar::part(source-image) {
       display: ${args.sourceImage && args.showSourceImage ? "block" : "none"};
       width: ${args.sourceImageSize}px;
       height: ${args.sourceImageSize}px;
       border: ${args.sourceImageBorder ? "1px solid" : "none"};
       border-color: ${args.sourceImageBorderColor};
       ${args.sourceImageShadow ? "" : "box-shadow: none;"}
     }
   </style>
   <vviinn-vpr-button token="${args.token}"
                      product-id="${args.productId}"
                      position="${args.position}"
                      add-style="${args.addStyle}"
                      sidebar-title="${args.sidebarTitle}"
                      currency-sign="${args.currencySign}"
                      modal-scrollbar="${args.modalScrollbar}"
                      mode="${args.mode}"
                      campaigns="${args.campaigns}"
                      image-width="${args.imageWidth}"
                      source-image="${args.sourceImage}"
                      color="${
                        args.color ? args.color.toString().slice(1) : ""
                      }"
                      source-image="${
                        args.showSourceImage
                          ? "https://www.moebel-shop.de/media/image/e3/e9/28/0749295-001_600x600.jpg"
                          : ""
                      }"></vviinn-vpr-button>`;

export const Default = Template.bind({});

Default.args = {
  token:
    "eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiJ9.eyJzdWIiOjgzLCJqdGkiOiI3ZTg2Y2I1YS00ZTFjLTRhYjctYjU2My1lN2FjMTYzZTYyZDIiLCJzY29wZXMiOlsidnByIiwidnBzIiwidnBjIl19.SbaQnBkvoXer3GPCWUthFQStFKLHZNMBfj4Qu44WHM8nzaIt48I74yVy4gVbX29vtd6jIkDPdakqEXRXmAxOCtv7_nsd4iBs1yMegfOWW5g8f10PKfZqmWJcfhwKIEElnUMFmP6rXpogntZ7iFfeTBbiRNzQPhkaa7jUjgQkCC4",
  productId: "4114460310",
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
  shadow: true,
  modalTitle: true,
  showSourceImage: true,
  sourceImageShadow: true,
  font: "Inter",
};

Default.parameters = {
  design: {
    type: "figma",
    url: "https://www.figma.com/file/YR5ZK1s4z9ZRUXytB8uVuj/Widgets?node-id=591%3A3859",
  },
};
