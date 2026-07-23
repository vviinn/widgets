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

export const formatIntervalKey = (
  column: string,
  start: unknown,
  end: unknown,
): string => `${column}:${start}-${end}`;

export const extractActiveFilterValues = (
  activeFilters: RequestDynamicFilterItem[],
): Set<string> => {
  const activeValues = new Set<string>();
  activeFilters.forEach((filter) => {
    if (!Array.isArray(filter.values)) return;
    filter.values.forEach((v) => {
      // Interval values are `{start, end}` objects; categorical values are strings.
      if (v !== null && typeof v === "object" && "start" in v) {
        activeValues.add(formatIntervalKey(filter.column, v.start, v.end));
      } else {
        activeValues.add(`${filter.column}:${String(v)}`);
      }
    });
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
          if (filter.type === "categorical" && "values" in filter) {
            filter.values.forEach((value) => {
              if (activeValues.has(`${filter.column}:${String(value.value)}`)) {
                updatedAppliedFilters.add(`${filter.column}:${value.value}`);
              }
            });
          } else if (filter.type === "interval" && "selectedValues" in filter) {
            filter.selectedValues.forEach((interval) => {
              const key = formatIntervalKey(
                filter.column,
                interval.start,
                interval.end,
              );
              if (activeValues.has(key)) {
                updatedAppliedFilters.add(key);
              }
            });
          }
        }
      }
    }
  }

  return updatedAppliedFilters;
};
