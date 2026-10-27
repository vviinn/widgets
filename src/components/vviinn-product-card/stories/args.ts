import {
  productCardImageAspectRatioArg,
  productCardContentAlignArg,
  productCardTextAlignArg,
  productCardImageBorderArg,
  productCardImageBgColorArg,
} from "../../../../storybook/helpers/sharedArgTypes";

export const argTypes = {
  productId: {
    description:
      "Product ID the card passes into its events. Internal; the widgets set it.",
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
    control: {
      type: "object",
    },
  },
};
