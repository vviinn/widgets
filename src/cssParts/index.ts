import {
  extendedFiltersPartsList,
  filtersPartsList,
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
  filtersPartsList,
  histogramPartsList,
  generalFiltersPartsList
);

export const selectedFiltersParts = makeExportPartsString(
  selectedFiltersPartsList,
  generalFiltersPartsList
);

export const priceRangeParts = makeExportPartsString(histogramPartsList);

export const searchWidgetFilterParts = makeExportPartsString(
  extendedFiltersPartsList,
  filtersPartsList,
  histogramPartsList,
  generalFiltersPartsList
);
