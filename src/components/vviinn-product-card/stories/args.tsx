export const argTypes = {
  imageBorderColor: {
    name: "Image border color",
    control: {
      type: "color",
    },
  },
  dimmedBackground: {
    name: "dimmed-background",
    description:
      "Adding a light-gray filter on top of the image to distinguish it from the rest of the product card content.",
  },
  brand: {
    description: "Using the [title] attribute from product feed.",
    control: {
      type: "boolean",
    },
  },
  titleLineCount: {
    name: "Number of text lines for Product title",
    options: [1, 2, 3],
    control: {
      type: "select",
      default: 0,
    },
  },
  locale: {
    options: ["de-DE", "en-US"],
    control: {
      type: "select",
      default: 0,
    },
  },
  currency: {
    options: ["$", "€", "£", "¥", "₽"],
    control: {
      type: "select",
      default: 0,
    },
  },
  contentAlignment: {
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
  },
  primaryTextColor: {
    name: "Primary text color",
    control: {
      type: "color",
    },
    description:
      "Used where the most user attention is needed: product brand, product title, and price.",
  },
  secondaryTextColor: {
    name: "Secondary text color",
    description: "Used in Old Price",
    control: {
      type: "color",
    },
  },
};
