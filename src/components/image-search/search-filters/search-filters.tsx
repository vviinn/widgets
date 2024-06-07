import {
  Component,
  Host,
  h,
  Prop,
  State,
  Element,
  Event,
  EventEmitter,
} from "@stencil/core";
import { Link } from "../../../network/ion/Link";
import {
  RequestFilterItem,
  ResponseFilterItem,
  SearchSessionFilter,
} from "../../../searchSession/searchSession";
import { searchState } from "../../../store/search.store";
import {
  BasicEventData,
  SelectFilterEventData,
} from "../../../recommendation/events";
import { parseFilters } from "../../../filters/parseFilters";
import { FilterKind } from "vviinn-tracking-client-ts";

const FILTERS_COUNT: number = 4;
type TextSearchFilterItem = ResponseFilterItem["values"][number];

@Component({
  tag: "search-filters",
  styleUrl: "search-filters.css",
  shadow: true,
})
export class SearchFilters {
  @Element() el: HTMLElement;

  @Prop() filter: SearchSessionFilter | null = null;
  @Prop() textSearchFiltersGroup: ResponseFilterItem | null = null;
  @Prop() basicEventData: BasicEventData;

  @State() selectedFilter = "";
  @State() hideFilters: boolean = true;

  @Event() vviinnSelectFilter: EventEmitter<SelectFilterEventData>;
  @Event() vviinnTextSearchFilterSelected: EventEmitter<RequestFilterItem>;

  private filterType: string =
    this.filter?.name ?? this.textSearchFiltersGroup?.column;

  private isCategoriesFilterType(): boolean {
    return this.filterType === "categories";
  }
  private getFilterKind(): FilterKind {
    return this.isCategoriesFilterType()
      ? "category"
      : (this.filterType as FilterKind);
  }

  private handleFilterSelection(filter: Link): void {
    return this.isFilterSelected(filter)
      ? this.clearSelectedFilter(filter)
      : this.selectFilter(filter);
  }

  private selectFilter(selectedFilter: Link) {
    searchState.activeIonLink = selectedFilter;
    this.selectedFilter = parseFilters(selectedFilter, this.filterType);

    this.vviinnSelectFilter.emit({
      ...this.basicEventData,
      action: "select",
      kind: this.getFilterKind(),
    });
  }

  private clearSelectedFilter(selectedFilter: Link) {
    searchState.activeIonLink = selectedFilter.clear;
    this.selectedFilter = parseFilters(selectedFilter.clear, this.filterType);

    this.vviinnSelectFilter.emit({
      ...this.basicEventData,
      action: "deselect",
      kind: this.getFilterKind(),
    });
  }

  private toggleFilters() {
    this.hideFilters = !this.hideFilters;
  }

  private handleEnter(ev: KeyboardEvent, f: Link) {
    if (ev.key !== "Enter") return;
    this.handleFilterSelection(f);
  }

  private isFilterSelected(filterLink: Link): boolean {
    return this.isCategoriesFilterType()
      ? this.selectedFilter === parseFilters(filterLink, "categories")
      : this.selectedFilter === filterLink.name;
  }

  private getTextSearchFilterRequestValue = (
    filter: TextSearchFilterItem
  ): RequestFilterItem[number] => {
    return {
      column: this.textSearchFiltersGroup.column,
      values: [filter.value],
    };
  };

  private handleTextSearchEnter(
    ev: KeyboardEvent,
    filter: TextSearchFilterItem
  ) {
    if (ev.key !== "Enter") return;
    this.handleTextSearchFilterSelection(filter);
  }

  private handleTextSearchFilterSelection(filter: TextSearchFilterItem) {
    const selectedFilters = searchState.textSearchFilters
      .filter((f: ResponseFilterItem) => {
        if (!f?.values) return false;
        return f.values.find((v) => v.selected);
      })
      .map((f: ResponseFilterItem) => {
        return {
          column: f.column,
          values: f.values.filter((v) => v.selected).map((v) => v.value),
        };
      });

    const newFilter = this.getTextSearchFilterRequestValue(filter);
    const filterActiveIndex = selectedFilters.findIndex(
      (f) =>
        f.column === newFilter.column && f.values.includes(newFilter.values[0])
    );

    let parsedFilters: RequestFilterItem = [];
    if (filterActiveIndex !== -1) {
      parsedFilters = selectedFilters.filter((_, i) => i !== filterActiveIndex);
    } else {
      parsedFilters = [...selectedFilters, newFilter];
    }

    this.vviinnTextSearchFilterSelected.emit(parsedFilters);
  }

  render() {
    const textSearchFilters = this.textSearchFiltersGroup?.values || [];
    const filters = this.filter?.filters || [];
    return (
      <Host exportparts="filter, show-more-filters">
        <div
          class={{
            filters: true,
            "no-scrollbar-mobile":
              this.isCategoriesFilterType() ||
              this.textSearchFiltersGroup !== null,
            "no-scrollbar":
              !this.isCategoriesFilterType() &&
              this.textSearchFiltersGroup === null,
          }}
        >
          {!!filters.length &&
            filters
              .filter((_, i) => (this.hideFilters ? i < FILTERS_COUNT : true))
              .map((filter, index) => {
                const filterActive =
                  this.filter.name === "categories"
                    ? this.selectedFilter === parseFilters(filter, "categories")
                    : this.selectedFilter === filter.name;
                return (
                  <div
                    role="button"
                    tabindex="0"
                    key={index}
                    part={filterActive ? "filter active" : "filter"}
                    class={{
                      filter: true,
                      active: filterActive,
                    }}
                    style={{ "animation-delay": `${index * 10}ms` }}
                    onPointerUp={(ev) => {
                      if (searchState.loading) return;
                      ev.stopPropagation();
                      this.handleFilterSelection(filter);
                    }}
                    onKeyPress={(ev) => {
                      if (searchState.loading) return;
                      this.handleEnter(ev, filter);
                    }}
                  >
                    {filter.name}
                  </div>
                );
              })}

          {!!textSearchFilters.length &&
            textSearchFilters
              .filter((_, i) => (this.hideFilters ? i < FILTERS_COUNT : true))
              .map((filter, index) => {
                const { label, selected } = filter;
                return (
                  <div
                    role="button"
                    tabindex="0"
                    key={index}
                    part={selected ? "filter active" : "filter"}
                    class={{
                      filter: true,
                      active: selected,
                    }}
                    style={{ "animation-delay": `${index * 10}ms` }}
                    onPointerUp={(ev) => {
                      if (searchState.loading) return;
                      ev.stopPropagation();
                      this.handleTextSearchFilterSelection(filter);
                    }}
                    onKeyPress={(ev) => {
                      if (searchState.loading) return;
                      this.handleTextSearchEnter(ev, filter);
                    }}
                  >
                    {label}
                  </div>
                );
              })}

          {this.hideFilters && (
            <div
              class={{
                "show-more": true,
                hidden:
                  filters.length <= FILTERS_COUNT &&
                  textSearchFilters.length <= FILTERS_COUNT,
                active: !this.hideFilters,
              }}
              role="button"
              tabindex="0"
              aria-role="button"
              onClick={() => {
                setTimeout(() => this.toggleFilters(), 300);
              }}
              onKeyPress={(ev) => {
                if (ev.key === "Enter") {
                  this.toggleFilters();
                }
              }}
              part="show-more-filters"
            ></div>
          )}
        </div>
      </Host>
    );
  }
}
