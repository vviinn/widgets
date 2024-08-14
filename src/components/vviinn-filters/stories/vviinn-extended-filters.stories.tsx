import { argTypes } from "./args";
import { extendedFiltersDecorator } from "./decorators";
import { filters } from "./constants";

export default {
  title: "Elements/Filters",
  component: "vviinn-extended-filters",
  decorators: [extendedFiltersDecorator],
  argTypes,
};

const Template = (args) => `
  <vviinn-extended-filters
    filters-string='${JSON.stringify(args.filters)}'
    locale='${args.locale}'
  ></vviinn-extended-filters>`;

export const Extended = Template.bind({});

Extended.storyName = "Extended";

Extended.args = {
  filters,
  locale: "en-US",
};
