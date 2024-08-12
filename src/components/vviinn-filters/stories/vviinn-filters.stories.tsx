import { argTypes } from "./args";
import { filtersDecorator } from "./decorators";
import { filters } from "./constants";

export default {
  title: "Elements/Filters/Main",
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
  ></vviinn-filters>`;

export const Default = Template.bind({});

Default.storyName = "Main";

Default.args = {
  filters,
};
