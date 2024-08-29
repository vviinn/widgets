import { generalArgs } from "./generalArgs";
import { ResultsTemplate } from "./ResultsTemplate";

export default {
  title: "Playground/Product Listing",
  component: "vviinn-results",
};

export const StaticFilters = ResultsTemplate.bind({});
StaticFilters.storyName = "Static Filters";
StaticFilters.argTypes = {
  textSearchQuery: {
    control: false,
  },
};
StaticFilters.args = {
  filterColumn: "product_type",
  filterValue: "Möbel > Schränke & Regale",
  ...generalArgs,
};

export const TextSearch = ResultsTemplate.bind({});
TextSearch.storyName = "Text Search";
TextSearch.argTypes = {
  filterValue: {
    control: false,
  },
  filterColumn: {
    control: false,
  },
};
TextSearch.args = {
  textSearchQuery: "Chair",
  ...generalArgs,
};
