import { argTypes } from "./args";
import { extendedFiltersDecorator } from "./decorators";
import { filters } from "./constants";

export default {
  title: "Elements/Filters/Extended",
  component: "vviinn-extended-filters",
  decorators: [extendedFiltersDecorator],
  argTypes,
};

const Template = (args) => `
  <vviinn-extended-filters
    filters-string='${JSON.stringify(args.filters)}'
    locale='${args.locale}'
  ></vviinn-extended-filters>`;

export const Default = Template.bind({});

Default.storyName = "Extended";

Default.args = {
  filters,
  locale: "en-US",
};
