import {
  extendedFiltersPartsList,
  filterPartsList,
  histogramPartsList,
} from "./filters";

const makeExportPartsString = (...args: string[][]): string =>
  args.flat().join(", ");

export const extendedFiltersParts = makeExportPartsString(
  extendedFiltersPartsList,
  histogramPartsList
);
