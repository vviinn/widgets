import { IonLink } from "../network/ionClient";
import { Recommendation } from "../recommendation/recommendation";

export interface SearchSessionProducts {
  readonly products: Recommendation[];
}

export interface SearchSessionFilters {
  readonly [key: string]: IonLink[];
}

export interface SearchSessionFilter {
  name: string;
  filters: IonLink[];
}

export const readFilters = (
  filters: SearchSessionFilters
): SearchSessionFilter[] =>
  Object.entries(filters).map(([name, filters]) => {
    return { name, filters };
  });
