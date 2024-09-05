import { argTypes } from "../../src/components/vviinn-vpr-widget/stories/args";
import { vviinnToken, productIdSimilarProducts } from "../helpers";

export default {
  title: "Playground/Discovery",
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
      product-details-new-tab="${args.productDetailsNewTab}"
      product-details-redirect="${args.productDetailsRedirect}"
      color="${args.color ? args.color.slice(1) : ""}"
      grid-arrows-dynamic="${args.gridArrowsDynamic}"
      no-result-text="${args.noResultText}"
      no-result-show="${args.noResultShow}"
      excluded="${args.excluded}"
      api-path="${args.apiPath}"
      add-to-basket-show="${args.addToBasketShow}"
      update-button-location="${args.updateButtonLocation}"
      show-filters="${args.showFilters}"
      show-extended-filters="${args.showExtendedFilters}"
      set-mode-discounts="${args.setModeDiscounts}"
    >
    </vviinn-vpr-widget>
`;

export const Grid = Template.bind({});
Grid.storyName = "Discovery";
Grid.args = {
  token: vviinnToken,
  apiPath: process.env.STORYBOOK_API_PATH,
  productId: productIdSimilarProducts,
  campaignType: "VPR",
  campaigns: "",
  color: "",
  excluded: "",
  mode: "grid",
  blockTitle: "Recommended products",
  productDetailsNewTab: false,
  productDetailsRedirect: true,
  imageWidth: 420,
  imageRatio: 1,
  locale: "en-US",
  currencySign: "€",
  pricePrefix: "",
  cssUrl: "",
  showScroll: false,
  noResultShow: true,
  noResultText: "",
  gridArrowsDynamic: false,
  addToBasketShow: false,
  showFilters: false,
  showExtendedFilters: false,
};
