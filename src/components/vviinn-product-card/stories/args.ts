import {
  productCardImageAspectRatioArg,
  productCardContentAlignArg,
  productCardTextAlignArg,
  productCardImageBorderArg,
  productCardImageBgColorArg,
} from "../../../../storybook/helpers/sharedArgTypes";

export const argTypes = {
  brand: {
    description:
      "Product brand. The card also sets it as `data-brand`, so CSS can target cards by brand.",
  },
  customLabels: {
    description:
      "Labels from the product feed, up to five, separated by `|` — e.g. `UVP`. The card hides them by default; this playground shows them for illustration.",
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
