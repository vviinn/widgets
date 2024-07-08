export const argTypes = {
  showFirst: {
    name: "Show Filters",
    description: "How many filters should show.",
    control: {
      type: "number",
      default: 4,
    },
  },
  filters: {
    control: false,
  },
};
