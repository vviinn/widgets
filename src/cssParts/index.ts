import {
  extendedFiltersPartsList,
  filtersPartsList,
  histogramPartsList,
  generalFiltersPartsList,
  selectedFiltersPartsList,
  searchPartsList,
} from "./filters";

import {
  imagePartsList,
  productCardGeneralPartsList,
  energyLabelPartsList,
  customLabelPartsList,
  pricePartsList,
  contentCardPartsList,
  listCardPartsList,
} from "./product";
import { suggestionsPartsList } from "./suggestions";

const makeExportPartsString = (...args: string[][]): string =>
  args.flat().join(", ");

export const extendedFiltersParts = makeExportPartsString(
  extendedFiltersPartsList,
  histogramPartsList,
  generalFiltersPartsList,
  searchPartsList,
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

export const listCardParts = makeExportPartsString(
  listCardPartsList,
  imagePartsList,
);

export const searchWidgetFilterParts = makeExportPartsString(
  extendedFiltersPartsList,
  filtersPartsList,
  histogramPartsList,
  searchPartsList,
  generalFiltersPartsList,
  selectedFiltersPartsList,
);

export const searchWidgetButtonParts = makeExportPartsString([
  "upload-photo_button",
  "start-camera_button",
  "drop-zone",
]);

export const searchModalFirstScreenParts = makeExportPartsString([
  "close-button",
  "secondary-action",
  "upload-photo_button",
  "start-camera_button",
  "drop-zone",
]);

export const searchBarParts = makeExportPartsString([
  "text-search-input",
  "text-search-button",
  "speech-button",
  "text-search-tooltip",
  "text-search-container",
  "suggestions-container",
  "suggestion-item",
]);

export const recommendationsParts = makeExportPartsString([
  "recommendations-title",
  "recommendations-subtitle",
]);

export const carouselParts = makeExportPartsString([
  "items-group",
  "carousel-button",
  "carousel-button-prev",
  "carousel-button-next",
  "recommendations-results",
]);

export const modalParts = makeExportPartsString([
  "results-title",
  "close-button",
  "secondary-action",
]);

export const suggestionsParts = makeExportPartsString(suggestionsPartsList);

export const shopTheLookPartsList = [
  "shop-the-look-actions-container",
  "shop-the-look-upload-button",
  "shop-the-look-upload-button-icon",
  "shop-the-look-upload-button-text",
];

export const shopTheLookParts = makeExportPartsString(shopTheLookPartsList);
