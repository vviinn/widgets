import { RequestDynamicFilterItem } from "../../campaign/VPRCampaignService";
import { components } from "../../interfaces/generated";

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
  stream: components["schemas"]["stream"] | null,
): Set<string> => {
  const activeValues = extractActiveFilterValues(activeFilters);
  const updatedAppliedFilters = new Set<string>();

  if (!stream?.items) return updatedAppliedFilters;

  for (const item of stream.items) {
    if (item.role !== "assistant" || !item.parts) continue;

    for (const part of item.parts) {
      if (!part.text?.annotations) continue;

      for (const annotation of part.text.annotations) {
        if (!annotation.interactions?.dynamicFilters?.[0]) continue;

        const filter = annotation.interactions.dynamicFilters[0];
        if (filter.type !== "categorical" || !("values" in filter)) continue;

        const dataItems = annotation.data?.items || [];

        dataItems.forEach((product) => {
          const productLabel = product.title || product.productId;
          const matchingFilterValue = filter.values.find(
            (value) =>
              value.label === productLabel || value.label === product.productId,
          );

          if (
            matchingFilterValue &&
            activeValues.has(String(matchingFilterValue.value))
          ) {
            updatedAppliedFilters.add(productLabel);
          }
        });
      }
    }
  }

  return updatedAppliedFilters;
};
