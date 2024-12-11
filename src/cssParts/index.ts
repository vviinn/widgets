import {
  extendedFiltersPartsList,
  filtersPartsList,
  histogramPartsList,
  generalFiltersPartsList,
  selectedFiltersPartsList,
} from "./filters";

import {
  productCardGeneralPartsList,
  energyLabelPartsList,
  customLabelPartsList,
  pricePartsList,
} from "./product";

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

export const energyLabelParts = makeExportPartsString(energyLabelPartsList);

export const productCardParts = makeExportPartsString(
  productCardGeneralPartsList,
  pricePartsList,
  customLabelPartsList,
  energyLabelPartsList
);

export const searchWidgetFilterParts = makeExportPartsString(
  extendedFiltersPartsList,
  filtersPartsList,
  histogramPartsList,
  generalFiltersPartsList
);

export const searchWidgetButtonParts = makeExportPartsString([
  "upload-photo_button",
  "start-camera_button",
]);

export const searchBarParts = makeExportPartsString([
  "text-search-input",
  "text-search-button",
  "speech-button",
  "text-search-container",
]);

export const carouselParts = makeExportPartsString([
  "items-group",
  "carousel-button",
  "recommendations-results",
]);

export const modalParts = makeExportPartsString([
  "results-title",
  "close-button",
  "secondary-action",
]);
