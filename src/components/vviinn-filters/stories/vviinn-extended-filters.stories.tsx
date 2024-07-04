import { argTypes } from "./args";
import { extendedFiltersDecorator } from "./decorators";
import { filters } from "./constants";

export default {
  title: "Filters/Extended",
  component: "vviinn-extended-filters",
  decorators: [extendedFiltersDecorator],
  parameters: {
    controls: { expanded: false },
  },
  argTypes,
};

const Template = (args) => `
  <vviinn-extended-filters
    filters-string='${JSON.stringify(args.filters)}'
  ></vviinn-extended-filters>`;

export const Default = Template.bind({});

Default.storyName = "Extended";

Default.args = {
  filters,
};
