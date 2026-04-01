import { RequestDynamicFilterItem } from "../../campaign/VPRCampaignService";
import { Stream } from "../../interfaces";

export const toggleFilterInSet = (
  appliedFilters: Set<string>,
  suggestionText: string,
): Set<string> => {
  const newAppliedFilters = new Set(appliedFilters);
  if (newAppliedFilters.has(suggestionText)) {
    newAppliedFilters.delete(suggestionText);
  } else {
    newAppliedFilters.add(suggestionText);
  }
  return newAppliedFilters;
};

export const extractActiveFilterValues = (
  activeFilters: RequestDynamicFilterItem[],
): Set<string> => {
  const activeValues = new Set<string>();
  activeFilters.forEach((filter) => {
    if (Array.isArray(filter.values)) {
      filter.values.forEach((v) => activeValues.add(String(v)));
    }
  });
  return activeValues;
};

export const syncSuggestionFilters = (
  activeFilters: RequestDynamicFilterItem[],
  stream: Stream | null,
): Set<string> => {
  const activeValues = extractActiveFilterValues(activeFilters);
  const updatedAppliedFilters = new Set<string>();

  if (!stream?.items) return updatedAppliedFilters;

  for (const item of stream.items) {
    if (item.role !== "assistant" || !item.parts) continue;

    for (const part of item.parts) {
      if (!part.text?.annotations) continue;

      for (const annotation of part.text.annotations) {
        if (!annotation.interactions?.dynamicFilters?.length) continue;

        for (const filter of annotation.interactions.dynamicFilters) {
          if (filter.type !== "categorical" || !("values" in filter)) continue;

          filter.values.forEach((value) => {
            if (activeValues.has(String(value.value))) {
              updatedAppliedFilters.add(`${filter.column}:${value.value}`);
            }
          });
        }
      }
    }
  }

  return updatedAppliedFilters;
};
