import {
  extendedFiltersPartsList,
  filtersPartsList,
  histogramPartsList,
  generalFiltersPartsList,
  selectedFiltersPartsList,
} from "./filters";

import {
  imagePartsList,
  productCardGeneralPartsList,
  energyLabelPartsList,
  customLabelPartsList,
  pricePartsList,
  contentCardPartsList,
} from "./product";

const makeExportPartsString = (...args: string[][]): string =>
  args.flat().join(", ");

export const extendedFiltersParts = makeExportPartsString(
  extendedFiltersPartsList,
  histogramPartsList,
  generalFiltersPartsList,
);

export const filtersParts = makeExportPartsString(
  filtersPartsList,
  histogramPartsList,
  generalFiltersPartsList,
);

export const selectedFiltersParts = makeExportPartsString(
  selectedFiltersPartsList,
  generalFiltersPartsList,
);

export const priceRangeParts = makeExportPartsString(histogramPartsList);

export const energyLabelParts = makeExportPartsString(energyLabelPartsList);

export const productCardsGridPart = "products";

export const imageParts = makeExportPartsString(imagePartsList);

export const productCardParts = makeExportPartsString(
  productCardGeneralPartsList,
  imagePartsList,
  pricePartsList,
  customLabelPartsList,
  energyLabelPartsList,
);

export const contentCardParts = makeExportPartsString(
  contentCardPartsList,
  imagePartsList,
);

export const searchWidgetFilterParts = makeExportPartsString(
  extendedFiltersPartsList,
  filtersPartsList,
  histogramPartsList,
  generalFiltersPartsList,
);

export const searchWidgetButtonParts = makeExportPartsString([
  "upload-photo_button",
  "start-camera_button",
]);

export const searchBarParts = makeExportPartsString([
  "text-search-input",
  "text-search-button",
  "speech-button",
  "text-search-tooltip",
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

export const suggestionsPartsList = [
  "suggestions-container",
  "suggestions-header", 
  "suggestions-icon",
  "suggestions-title",
  "suggestions-description",
  "suggestions-wrapper",
  "suggestions-list",
  "suggestion-item",
  "suggestion-link", 
  "suggestion-filter-button",
];

export const suggestionsParts = makeExportPartsString(suggestionsPartsList);
