import { RequestDynamicFilterItem } from "../../campaign/VPRCampaignService";
import { components } from "../../interfaces/generated";
import { splitAnnotationText, cleanLineText } from "./render-helpers";

/**
 * Toggles a suggestion filter in the applied filters set
 */
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

/**
 * Extracts active filter values from request filters
 */
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

/**
 * Syncs applied suggestion filters with active store filters
 * Now works in both directions - activation and deactivation
 */
export const syncSuggestionFilters = (
  activeFilters: RequestDynamicFilterItem[],
  stream: components["schemas"]["stream"] | null,
): Set<string> => {
  const activeValues = extractActiveFilterValues(activeFilters);
  const updatedAppliedFilters = new Set<string>();

  if (!stream?.items) return updatedAppliedFilters;

  // Go through all suggestions in stream and check if they should be active
  for (const item of stream.items) {
    if (item.role !== "assistant" || !item.parts) continue;

    for (const part of item.parts) {
      if (!part.text?.annotations) continue;

      for (const annotation of part.text.annotations) {
        if (!annotation.interactions?.dynamicFilters?.[0]) continue;

        const filter = annotation.interactions.dynamicFilters[0];
        if (filter.type !== "categorical" || !("values" in filter)) continue;

        const annotationText = part.text.content?.substring(
          annotation.locator.start,
          annotation.locator.start + annotation.locator.length,
        );

        const lines = splitAnnotationText(annotationText || "");
        const cleanLines = lines.map((line) => cleanLineText(line));

        // Check each suggestion text against its corresponding filter value
        cleanLines.forEach((suggestionText, lineIndex) => {
          if (lineIndex < filter.values.length) {
            const correspondingFilterValue = String(filter.values[lineIndex].value);
            if (activeValues.has(correspondingFilterValue)) {
              updatedAppliedFilters.add(suggestionText);
            }
          }
        });
      }
    }
  }

  return updatedAppliedFilters;
};
