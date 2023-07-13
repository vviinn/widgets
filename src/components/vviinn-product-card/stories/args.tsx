export const argTypes = {
  dimmedBackground: {
    name: "dimmed-background",
    description:
      "Adding a light-gray filter on top of the image to distinguish it from the rest of the product card content.",
  },
  brand: {
    description: "Using the [title] attribute from product feed.",
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
};
