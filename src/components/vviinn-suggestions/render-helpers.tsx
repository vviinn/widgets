import { h, EventEmitter } from "@stencil/core";
import { components } from "../../interfaces/generated";
import {
  ResponseDynamicFilterItem,
  RequestDynamicFilterItem,
} from "../../campaign/VPRCampaignService";
import {
  Recommendation,
  ContextAnnotation,
  Interactions,
} from "../../interfaces/product";
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
  annotation.data?.items || [];

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

export const hasCategoricalFilters = (annotation: ContextAnnotation): {
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
  !!(
    annotation.interactions?.dynamicFilters &&
    annotation.interactions.dynamicFilters.length > 0
  );
