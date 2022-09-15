export const apiPath = {
  name: "api-path",
  control: {
    type: "text",
  },
  table: {
    defaultValue: { summary: "https://api.vviinn.com" },
  },
};

const token = {
  name: "token",
  control: {
    type: "text",
  },
};

const productId = {
  name: "product-id",
  control: {
    type: "text",
  },
};

const campaigns = {
  name: "campaigns",
  control: {
    type: "text",
  },
};

const cssUrl = {
  name: "css-url",
  description:
    "Optional for custom CSS.  It will overwrite all other settings.",
  control: {
    type: "text",
  },
  required: false,
};

const analyticsId = {
  name: "Google tracking account ID",
  description:
    "Optional. Goolge Analytics account id or tag manager id and click events will be send for analytics product lists",
  control: {
    type: "text",
  },
  required: false,
};

export const campaignType = {
  name: "campaign-type",
  control: {
    type: "select",
    labels: {
      VPR: "Visually similar products (VPR)",
      VCS: "Visually cross-selling (VCS)",
    },
  },
  required: false,
};

const showTitle = {
  name: "Section title",
  control: {
    type: "boolean",
  },
  table: {
    defaultValue: { summary: true },
  },
  required: false,
};

const titleName = {
  name: "block-title",
  control: {
    type: "text",
  },
  table: {
    defaultValue: { summary: "Recommended products" },
  },
  required: false,
};

const titleFontSize = {
  name: "Section title name font size (px)",
  control: {
    type: "number",
  },
  required: false,
};

const showScrollbars = {
  name: "show-scroll",
  description:
    "Add browser default horizontal scroll bar (in continuity mode) or pagination bullets (in grid mode) to add extra cue for users ",
  control: {
    type: "boolean",
  },
  required: false,
};

const imageWidth = {
  name: "image-width",
  control: {
    type: "number",
  },
};

const contentAlignment = {
  name: "Content alignment",
  options: ["Left", "Centered", "Right"],
  mapping: {
    Left: 0,
    Centered: 1,
    Right: 2,
  },
  control: {
    type: "select",
    default: 0,
  },
};

const primaryTextColor = {
  name: "Primary text color",
  control: {
    type: "color",
  },
  description:
    "Used where the most user attention is needed: product brand, product title, and price.",
};

const secondaryTextColor = {
  name: "Secondary text color",
  description: "Used in Old Price",
  control: {
    type: "color",
  },
};

export const argTypes = {
  analyticsId,
  apiPath,
  campaignType,
  campaigns,
  contentAlignment,
  cssUrl,
  imageWidth,
  primaryTextColor,
  productId,
  secondaryTextColor,
  showScrollbars,
  showTitle,
  titleFontSize,
  titleName,
  token,
};

const recommendationsGridProductsDesktop = {
  name: "Product cards shown on desktop",
  description:
    "Desktop mode is bigger than 1024px. (Use arrow buttons to apply changes)",
  control: {
    type: "number",
  },
  required: false,
};

const recommendationsGridProductsTablet = {
  name: "Product cards shown on tablet",
  description:
    "How many product cards users will see inside one grid in a screen 768px-1024px. (Use arrow buttons to apply changes)",
  control: {
    type: "number",
  },
  required: false,
};

const recommendationsGridProductsMobile = {
  name: "Product cards shown on mobile",
  description:
    "How many product cards users will see inside one grid in a screen <768. (Use arrow buttons to apply changes)",
  control: {
    type: "number",
  },
  required: false,
};

export const gridLayoutArgs = {
  recommendationsGridProductsDesktop,
  recommendationsGridProductsTablet,
  recommendationsGridProductsMobile,
};

const recommendationsContinuityProductsDesktop = {
  name: "Product cards width in a L screen [px]",
  description:
    "How wide product cards will be on a screen bigger than 1024px width",
  control: {
    type: "number",
  },
  required: false,
};

const recommendationsContinuityProductsTablet = {
  name: "Product cards width in a M screen [px]",
  description:
    "How wide product cards will be on a screen from 768px-1024px width",
  control: {
    type: "number",
  },
  required: false,
};

const recommendationsContinuityProductsMobile = {
  name: "Product cards width in a S screen [px]",
  description:
    "How wide product cards will be on a screen smaller than 768px width",
  control: {
    type: "number",
  },
  required: false,
};

export const continuityLayoutArgs = {
  recommendationsContinuityProductsDesktop,
  recommendationsContinuityProductsTablet,
  recommendationsContinuityProductsMobile,
};
