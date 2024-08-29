import { argTypes } from "./args";
import { filtersDecorator } from "./decorators";
import { filters } from "./constants";

export default {
  title: "Playground/Filters",
  component: "vviinn-filters",
  decorators: [filtersDecorator],
  argTypes,
};

const Template = (args) => `
  <vviinn-filters
    filters-string='${JSON.stringify(args.filters)}'
  ></vviinn-filters>`;

export const Main = Template.bind({});

Main.storyName = "Main";

Main.args = {
  filters,
};
