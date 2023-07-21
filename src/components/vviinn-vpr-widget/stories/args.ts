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
      VPR: "Visually similar products (VPR)",
      VCS: "Visually cross-selling (VCS)",
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
  productId,
  token,
  color,
  excluded,
};
