import {
  productCardImageAspectRatioArg,
  productCardImageBgColorArg,
} from "../../../../storybook/helpers";

const token = {
  name: "token",
  control: {
    type: "text",
  },
};

const excluded = {
  name: "excluded",
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

const color = {
  name: "color",
  control: {
    type: "color",
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
  control: {
    type: "text",
  },
  required: false,
};

const campaignType = {
  name: "campaign-type",
  control: {
    type: "select",
    labels: {
      VPR: "Similar Products (VPR)",
      VCS: "Cross-Selling (VCS)",
    },
  },
  required: false,
};

const updateButtonLocation = {
  name: "update-button-location",
  control: {
    type: "select",
    labels: {
      onTop: "onTop",
      onItem: "onItem",
      topAndItem: "topAndItem",
    },
  },
  required: false,
};

const imageWidth = {
  name: "image-width",
  control: {
    type: "number",
  },
};

export const argTypes = {
  campaignType,
  campaigns,
  cssUrl,
  imageWidth,
  productCardImageAspectRatio: productCardImageAspectRatioArg,
  productCardImageBgColor: productCardImageBgColorArg,
  productId,
  token,
  color,
  excluded,
  updateButtonLocation,
};
