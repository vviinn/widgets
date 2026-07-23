import { h, EventEmitter } from "@stencil/core";
import { marked } from "marked";
import {
  ResponseDynamicFilterItem,
  RequestDynamicFilterItem,
} from "../../campaign/VPRCampaignService";
import {
  Recommendation,
  ContextAnnotation,
  Interactions,
} from "../../interfaces";
import { triggerFilter } from "../vviinn-filters/helpers/triggerFilter";
import { formatIntervalKey } from "./helpers";
import {
  DynamicFilterInternalData,
  ChangedFiltersEventData,
} from "../../recommendation/events";

export interface FilterHandlers {
  vviinnFilterTriggered: EventEmitter<DynamicFilterInternalData>;
  vviinnFiltersChanged: EventEmitter<ChangedFiltersEventData>;
  el: HTMLElement;
  isTriggeredByVpsWidget: boolean;
}

export const extractDataItems = (annotation: ContextAnnotation) =>
  annotation.data.items;

export const findMatchingFilterValue = (
  item: Recommendation,
  filter: ResponseDynamicFilterItem,
) => {
  if (
    filter.type !== "categorical" ||
    !("values" in filter) ||
    filter.values.length === 0
  ) {
    return null;
  }

  if ("productId" in item && item.productId) {
    return filter.values.find((value) => value.label === item.productId);
  }
  return null;
};

export const applyFiltersForItems = (
  dataItems: Recommendation[],
  interactions: Interactions,
  currentRequestFilters: RequestDynamicFilterItem[],
  handlers: FilterHandlers,
): RequestDynamicFilterItem[] => {
  if (!interactions?.dynamicFilters) {
    return currentRequestFilters;
  }

  const filters = interactions.dynamicFilters;
  let updatedFilters = currentRequestFilters;

  if (dataItems.length === 0) {
    for (const filter of filters) {
      if (filter.type === "categorical" && "values" in filter) {
        for (const filterValue of filter.values) {
          updatedFilters = triggerFilter({
            filterValue: filterValue as any,
            selectedFilter: filter as ResponseDynamicFilterItem,
            requestFilters: updatedFilters,
            vviinnFilterTriggered: handlers.vviinnFilterTriggered,
            vviinnFiltersChanged: handlers.vviinnFiltersChanged,
            el: handlers.el,
            isTriggeredByVpsWidget: handlers.isTriggeredByVpsWidget,
          });
        }
      } else if (filter.type === "interval" && "selectedValues" in filter) {
        // A suggestion chip represents one specific range to toggle, not a slider.
        // The backend emits `full === selectedValues[0]`, which would make
        // `isFullRangeInterval` read every click as "cleared to the full range"
        // (deselect-only). Neutralize `full` so the shared toggle logic selects /
        // deselects this exact interval by value match. Only the object passed to
        // `triggerFilter` is affected; `value` still carries the real interval.
        const chipFilter = {
          ...filter,
          full: { start: undefined, end: undefined },
        } as ResponseDynamicFilterItem;
        for (const interval of filter.selectedValues) {
          updatedFilters = triggerFilter({
            filterValue: { interval } as any,
            selectedFilter: chipFilter,
            requestFilters: updatedFilters,
            vviinnFilterTriggered: handlers.vviinnFilterTriggered,
            vviinnFiltersChanged: handlers.vviinnFiltersChanged,
            el: handlers.el,
            isTriggeredByVpsWidget: handlers.isTriggeredByVpsWidget,
          });
        }
      }
    }
    return updatedFilters;
  }

  for (const item of dataItems) {
    for (const filter of filters) {
      const matchingFilterValue = findMatchingFilterValue(item, filter);

      if (matchingFilterValue) {
        const filterValue = {
          value: matchingFilterValue.value,
          ...matchingFilterValue,
        } as any;

        updatedFilters = triggerFilter({
          filterValue,
          selectedFilter: filter as ResponseDynamicFilterItem,
          requestFilters: updatedFilters,
          vviinnFilterTriggered: handlers.vviinnFilterTriggered,
          vviinnFiltersChanged: handlers.vviinnFiltersChanged,
          el: handlers.el,
          isTriggeredByVpsWidget: handlers.isTriggeredByVpsWidget,
        });
      }
    }
  }

  return updatedFilters;
};

export const hasDynamicFilters = (annotation: ContextAnnotation): boolean =>
  !!annotation.interactions?.dynamicFilters?.length;

export const hasProperLocators = (annotations: ContextAnnotation[]): boolean =>
  annotations.every(
    (a) => a.locator?.start !== undefined && a.locator?.length !== undefined,
  );

type Segment =
  | { type: "text"; content: string }
  | { type: "annotated"; content: string; annotation: ContextAnnotation };

export const splitContentByLocators = (
  content: string,
  annotations: ContextAnnotation[],
): Segment[] => {
  const sorted = [...annotations].sort(
    (a, b) => a.locator.start - b.locator.start,
  );
  const segments: Segment[] = [];
  let cursor = 0;

  for (const annotation of sorted) {
    const { start, length } = annotation.locator;
    if (start > cursor) {
      segments.push({ type: "text", content: content.slice(cursor, start) });
    }
    segments.push({
      type: "annotated",
      content: content.slice(start, start + length),
      annotation,
    });
    cursor = start + length;
  }

  if (cursor < content.length) {
    segments.push({ type: "text", content: content.slice(cursor) });
  }

  return segments;
};

export const getAnnotationFilterKeys = (
  annotation: ContextAnnotation,
): string[] =>
  annotation.interactions?.dynamicFilters?.flatMap((filter) => {
    if (filter.type === "categorical" && "values" in filter) {
      return filter.values.map((v) => `${filter.column}:${v.value}`);
    }
    if (filter.type === "interval" && "selectedValues" in filter) {
      return filter.selectedValues.map((interval) =>
        formatIntervalKey(filter.column, interval.start, interval.end),
      );
    }
    return [];
  }) ?? [];

const getAnnotationDeeplink = (
  annotation: ContextAnnotation,
): string | null => {
  for (const item of annotation.data.items) {
    if ("deeplink" in item && item.deeplink) {
      return item.deeplink;
    }
  }
  return null;
};

export const renderAnnotatedContent = (
  content: string,
  annotations: ContextAnnotation[],
  onAnnotationClick: (annotation: ContextAnnotation) => void,
  appliedFilters: Set<string>,
  key: string,
) => {
  const segments = splitContentByLocators(content, annotations);

  return (
    <li class="suggestion-item" part="suggestion-item" key={key}>
      {segments.map((segment, i) => {
        const segmentKey = `${key}-${i}`;
        if (segment.type === "text") {
          return (
            <span
              key={segmentKey}
              innerHTML={marked.parseInline(segment.content) as string}
            ></span>
          );
        }
        const deeplink = getAnnotationDeeplink(segment.annotation);
        if (deeplink) {
          return (
            <a
              key={segmentKey}
              href={deeplink}
              target="_blank"
              rel="noopener noreferrer"
              class="suggestion-link"
              part="suggestion-link"
            >
              {segment.content}
            </a>
          );
        }
        const isSelected = getAnnotationFilterKeys(segment.annotation).some(
          (k) => appliedFilters.has(k),
        );
        return (
          <button
            key={segmentKey}
            class={`suggestion-filter-button ${isSelected ? "active" : ""}`}
            part="suggestion-filter-button"
            onClick={() => onAnnotationClick(segment.annotation)}
            type="button"
          >
            {segment.content}
          </button>
        );
      })}
    </li>
  );
};

export const renderInfoText = (content: string, key: string) => (
  <div
    class="suggestion-info-text"
    part="suggestion-info-text"
    key={key}
    innerHTML={marked.parse(content) as string}
  />
);
