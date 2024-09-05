import { generalArgs } from "../../src/components/vviinn-results/stories/generalArgs";
import { ResultsTemplate } from "../../src/components/vviinn-results/stories/ResultsTemplate";

export default {
  title: "Playground/Product List",
  component: "vviinn-results",
};

export const StaticFilters = ResultsTemplate.bind({});
StaticFilters.storyName = "Product List";
StaticFilters.args = {
  filterColumn: "product_type",
  filterValue: "Möbel > Schränke & Regale",
  ...generalArgs,
};
