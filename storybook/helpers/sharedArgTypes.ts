export const productCardImageAspectRatioArg = {
  name: "--product-card-image-aspect-ratio",
  description: "CSS variable: Controls the aspect ratio of product card images",
  options: ["1 / 1", "3 / 4", "2 / 3"],
  control: {
    type: "select",
    labels: {
      "1 / 1": "Square (1:1)",
      "3 / 4": "Portrait (3:4)",
      "2 / 3": "Tall Portrait (2:3)",
    },
  },
};

export const productCardImageBgColorArg = {
  name: "--product-card-image-bg-color",
  description: "CSS variable: Sets the background color for product card images",
  control: { type: "color" },
};

export const productCardContentAlignArg = {
  name: "--product-card-content-align",
  description: "CSS variable: Sets the alignment of content inside the product card's flex container",
  options: ["flex-start", "center", "flex-end"],
  control: {
    type: "select",
  },
};

export const productCardTextAlignArg = {
  name: "--product-card-text-align",
  description: "CSS variable: Sets the text alignment inside the product card",
  options: ["left", "center", "right"],
  control: {
    type: "select",
  },
};

export const productCardImageBorderArg = {
  name: "--product-card-image-border",
  description: "CSS variable: Sets the border style for product card images",
  options: ["none", "1px solid #e0e0e0"],
  control: {
    type: "select",
  },
};
