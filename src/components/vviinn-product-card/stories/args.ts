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
  energyEfficiencyStandard: {
    options: ["2017/1369", "2017/1369 (updated)"],
    control: {
      type: "select",
      default: "2017/1369 (updated)",
    },
  },
};
