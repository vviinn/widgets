import { h, EventEmitter } from "@stencil/core";
import { components } from "../../interfaces/generated";
import {
  ResponseDynamicFilterItem,
  RequestDynamicFilterItem,
} from "../../campaign/VPRCampaignService";
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

export function extractDataItems(
  annotation: components["schemas"]["context-annotation"],
) {
  let dataItems = [];
  if ((annotation.data as any)?.products?.length > 0) {
    dataItems = (annotation.data as any).products;
  } else if (annotation.data?.items?.length > 0) {
    dataItems = annotation.data.items;
  }
  return dataItems;
}

export function findMatchingFilterValue(
  item: any,
  filter: ResponseDynamicFilterItem,
) {
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
}

export function applyFiltersForItems(
  dataItems: any[],
  interactions: any,
  currentRequestFilters: RequestDynamicFilterItem[],
  handlers: FilterHandlers,
): RequestDynamicFilterItem[] {
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
}

export function handleDeeplinks(dataItems: any[]): boolean {
  for (const item of dataItems) {
    if ("deeplink" in item && item.deeplink) {
      window.open(item.deeplink as string, "_blank");
      return true;
    }
  }
  return false;
}

export function renderListItem(
  content: string | any,
  key: string,
  isClickable: boolean = false,
  clickHandler?: () => void,
  href?: string,
) {
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
}


export function renderToggleButton(
  text: string,
  isSelected: boolean,
  onClick: () => void,
  key: string,
) {
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
}


export function hasCategoricalFilters(annotation: any): {
  hasFilters: boolean;
  selectedFilter?: any;
} {
  const hasFilters = hasDynamicFilters(annotation);
  
  if (hasFilters && annotation.interactions?.dynamicFilters?.[0]) {
    const selectedFilter = annotation.interactions.dynamicFilters[0];
    if (selectedFilter.type === "categorical") {
      return { hasFilters: true, selectedFilter };
    }
  }
  
  return { hasFilters: false };
}

export function renderFallbackListItem(
  text: string,
  itemKey: string,
  onClick: () => void,
) {
  return renderListItem(text, itemKey, true, onClick);
}

export function hasDynamicFilters(
  annotation: components["schemas"]["context-annotation"],
): boolean {
  return !!(
    annotation.interactions?.dynamicFilters &&
    annotation.interactions.dynamicFilters.length > 0
  );
}
