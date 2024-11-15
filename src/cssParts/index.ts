import {
  extendedFiltersPartsList,
  filterPartsList,
  histogramPartsList,
  generalFiltersPartsList,
  selectedFiltersPartsList,
} from "./filters";

const makeExportPartsString = (...args: string[][]): string =>
  args.flat().join(", ");

export const extendedFiltersParts = makeExportPartsString(
  extendedFiltersPartsList,
  histogramPartsList,
  generalFiltersPartsList
);

export const filtersParts = makeExportPartsString(
  filterPartsList,
  histogramPartsList,
  generalFiltersPartsList
);

export const selectedFiltersParts = makeExportPartsString(
  selectedFiltersPartsList,
  generalFiltersPartsList
);
