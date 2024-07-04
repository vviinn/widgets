import { argTypes } from "./args";
import { filtersDecorator } from "./decorators";
import { filters } from "./constants";

export default {
  title: "Filters/Main",
  component: "vviinn-filters",
  decorators: [filtersDecorator],
  parameters: {
    controls: { expanded: false },
  },
  argTypes,
};

const Template = (args) => `
  <vviinn-filters
    filters-string='${JSON.stringify(args.filters)}'
    show-first="${args.showFirst}"
  ></vviinn-filters>`;

export const Default = Template.bind({});

Default.storyName = "Main";

Default.args = {
  filters,
  showFirst: 4,
};
