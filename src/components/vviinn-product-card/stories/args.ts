import { productCardImageAspectRatioArg } from "../../../../storybook/helpers";

export const argTypes = {
  brand: {
    description: "Using the [title] attribute from product feed.",
  },
  productCardImageAspectRatio: productCardImageAspectRatioArg,
  productCardContentAlign: {
    options: ["flex-start", "center", "flex-end"],
    control: {
      type: "select",
    },
  },
  productCardTextAlign: {
    options: ["left", "center", "right"],
    control: {
      type: "select",
    },
  },
  productCardImageBorder: {
    options: ["none", "1px solid #e0e0e0"],
    control: {
      type: "select",
    },
  },
  productCardImageBgColor: {
    options: ["transparent", "#f4f4f4"],
    control: {
      type: "select",
    },
  },
  energyCertifications: {
    table: {
      disable: true,
    },
  },
  energyCertificationsString: {
    table: {
      disable: true,
    },
  },
  basePrice: {
    control: {
      type: "object",
    },
  },
  baseSalePrice: {
    control: {
      type: "object",
    },
  },
  images: {
    description:
      "Array of image URLs (first 2 will be used for hover effect on desktop)",
    control: {
      type: "object",
    },
  },
};
