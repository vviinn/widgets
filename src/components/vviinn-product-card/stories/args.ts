import {
  productCardImageAspectRatioArg,
  productCardContentAlignArg,
  productCardTextAlignArg,
  productCardImageBorderArg,
  productCardImageBgColorArg,
} from "../../../../storybook/helpers";

export const argTypes = {
  brand: {
    description: "Using the [title] attribute from product feed.",
  },
  productCardImageAspectRatio: productCardImageAspectRatioArg,
  productCardContentAlign: productCardContentAlignArg,
  productCardTextAlign: productCardTextAlignArg,
  productCardImageBorder: productCardImageBorderArg,
  productCardImageBgColor: productCardImageBgColorArg,
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
