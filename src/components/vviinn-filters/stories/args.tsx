export const argTypes = {
  showExtended: {
    name: "Show Extended",
    description:
      "Show the extended filters. If true, the extended filters will be shown at right.",
    control: {
      type: "boolean",
      default: true,
    },
  },
  showFirst: {
    name: "Show Filters",
    description: "How many filters should show.",
    control: {
      type: "number",
      default: 4,
    },
  },
};
