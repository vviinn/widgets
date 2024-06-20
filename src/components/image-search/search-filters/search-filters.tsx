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
import { SearchSessionFilter } from "../../../searchSession/searchSession";
import { searchState } from "../../../store/search.store";
import {
  BasicEventData,
  SelectFilterEventData,
} from "../../../recommendation/events";
import { parseFilters } from "../../../filters/parseFilters";
import { FilterKind } from "vviinn-tracking-client-ts";
import {
  RequestFilterItem,
  ResponseFilterItem,
} from "../../../interfaces/search";

const FILTERS_COUNT: number = 4;
type TextSearchFilterValue = ResponseFilterItem["values"][0];

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
  @Event() vviinnTextSearchFilterSelected: EventEmitter<RequestFilterItem[]>;

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

  private getSelectedTextSearchFilters = (): RequestFilterItem[] =>
    searchState.textSearchFilters
      .filter(({ values }: ResponseFilterItem) =>
        values?.find(({ selected }) => selected)
      )
      .map(({ column, values }: ResponseFilterItem) => {
        return {
          column: column,
          values: values.filter((v) => v.selected).map((v) => v.value),
        };
      }) as RequestFilterItem[];

  private isFilterSelected(filterLink: Link): boolean {
    return this.isCategoriesFilterType()
      ? this.selectedFilter === parseFilters(filterLink, "categories")
      : this.selectedFilter === filterLink.name;
  }

  private getTextSearchFilterRequestValue = (
    filter: TextSearchFilterValue
  ): RequestFilterItem => {
    return {
      column: this.textSearchFiltersGroup.column,
      values: [filter.value.toString()],
    };
  };

  private handleTextSearchEnter(
    ev: KeyboardEvent,
    filter: TextSearchFilterValue
  ) {
    if (ev.key !== "Enter") return;
    this.handleTextSearchFilterSelection(filter);
  }

  private handleTextSearchFilterSelection(filter: TextSearchFilterValue) {
    let parsedFilters: RequestFilterItem[];

    const selectedFilters = this.getSelectedTextSearchFilters();
    const newFilter = this.getTextSearchFilterRequestValue(filter);
    const isNewFilterSelected = filter.selected;
    const isSameColumnSelected = selectedFilters.some(
      ({ column }) => column === newFilter.column
    );

    if (isNewFilterSelected) {
      parsedFilters = selectedFilters.filter(({ column }) => {
        return column !== newFilter.column;
      });
    } else if (isSameColumnSelected) {
      parsedFilters = selectedFilters.map((f) => {
        return f.column === newFilter.column ? newFilter : f;
      });
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
