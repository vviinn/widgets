import { Link } from "../network/ion/Link";

export const parseFilters = (filter: Link, filterType: string): string => {
  if (!filter) return "";

  const result: { [key: string]: string } = {};

  filter.href
    .split("?")[1]
    .split("included[]=")
    .join("")
    .split("&")
    .forEach((f) => {
      const [key, value] = f.split("%3A");
      result[key] = value;
    });

  if (filterType === "categories") {
    return result["product_type"];
  }
  return result[filterType];
};
