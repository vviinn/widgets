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
    let matchingFilterValue = filter.values.find(
      (value) => value.label === item.productId,
    );
    return matchingFilterValue;
  } else {
    return null;
  }
};

export const applyFiltersForItems = (
  dataItems: Recommendation[],
  interactions: Interactions,
  currentRequestFilters: RequestDynamicFilterItem[],
  handlers: FilterHandlers,
): RequestDynamicFilterItem[] => {
  if (!interactions?.dynamicFilters || dataItems.length === 0) {
    return currentRequestFilters;
  }

  const filters = interactions.dynamicFilters;
  let updatedFilters = currentRequestFilters;

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

export const handleDeeplinks = (dataItems: Recommendation[]): boolean => {
  for (const item of dataItems) {
    if ("deeplink" in item && item.deeplink) {
      window.open(item.deeplink as string, "_blank");
      return true;
    }
  }
  return false;
};

export const renderListItem = (
  content: string,
  key: string,
  isClickable: boolean = false,
  clickHandler?: () => void,
  href?: string,
) => {
  if (href) {
    return (
      <li class="suggestion-item" part="suggestion-item" key={key}>
        <a
          href={href}
          target="_blank"
          class="suggestion-link"
          part="suggestion-link"
        >
          {content}
        </a>
      </li>
    );
  }

  if (isClickable && clickHandler) {
    return (
      <li class="suggestion-item" part="suggestion-item" key={key}>
        <button
          class="suggestion-link"
          part="suggestion-link"
          onClick={clickHandler}
          type="button"
        >
          {content}
        </button>
      </li>
    );
  }

  return (
    <li class="suggestion-item" part="suggestion-item" key={key}>
      {content}
    </li>
  );
};

export const renderToggleButton = (
  text: string,
  isSelected: boolean,
  onClick: () => void,
  key: string,
) => {
  return (
    <li class="suggestion-item" part="suggestion-item" key={key}>
      <button
        class={`suggestion-filter-button ${isSelected ? "active" : ""}`}
        part="suggestion-filter-button"
        onClick={onClick}
        type="button"
      >
        {text}
      </button>
    </li>
  );
};

export const hasCategoricalFilters = (
  annotation: ContextAnnotation,
): {
  hasFilters: boolean;
  selectedFilter?: ResponseDynamicFilterItem;
} => {
  const hasFilters = hasDynamicFilters(annotation);

  if (hasFilters && annotation.interactions?.dynamicFilters?.[0]) {
    const selectedFilter = annotation.interactions.dynamicFilters[0];
    if (selectedFilter.type === "categorical") {
      return { hasFilters: true, selectedFilter };
    }
  }

  return { hasFilters: false };
};

export const hasDynamicFilters = (annotation: ContextAnnotation): boolean =>
  !!annotation.interactions?.dynamicFilters?.length;

export const hasProperLocators = (annotations: ContextAnnotation[]): boolean =>
  annotations.every((a) => (a.data?.items?.length ?? 0) === 1);

type Segment =
  | { type: "text"; content: string }
  | { type: "annotated"; content: string; annotation: ContextAnnotation };

export const splitContentByLocators = (
  content: string,
  annotations: ContextAnnotation[],
): Segment[] => {
  const sorted = [...annotations].sort((a, b) => a.locator.start - b.locator.start);
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

export const renderAnnotatedContent = (
  content: string,
  annotations: ContextAnnotation[],
  onAnnotationClick: (annotation: ContextAnnotation, text: string) => void,
  appliedFilters: Set<string>,
  key: string,
) => {
  const segments = splitContentByLocators(content, annotations);

  return (
    <li class="suggestion-item" part="suggestion-item" key={key}>
      {segments.map((segment, i) => {
        if (segment.type === "text") {
          return <span key={`${key}-t-${i}`}>{segment.content}</span>;
        }
        const isSelected = appliedFilters.has(segment.content);
        return (
          <button
            key={`${key}-a-${i}`}
            class={`suggestion-filter-button ${isSelected ? "active" : ""}`}
            part="suggestion-filter-button"
            onClick={() => onAnnotationClick(segment.annotation, segment.content)}
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
