export const argTypes = {
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
  showInStorybook: {
    table: {
      disable: true,
    },
  },
};
