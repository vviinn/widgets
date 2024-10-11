import { generalArgs } from "../../src/components/vviinn-results/stories/generalArgs";
import { ResultsTemplate } from "../../src/components/vviinn-results/stories/ResultsTemplate";
import { filterValue } from "../helpers";
import "../styles/search-page.css";
import "../documentation/widgets/styles.css";

export default {
  title: "Playground/Product List",
  component: "vviinn-results",
};

export const ProductList = ResultsTemplate.bind({});
ProductList.storyName = "Product List";
ProductList.args = {
  filterColumn: "product_type",
  filterValue,
  ...generalArgs,
};
