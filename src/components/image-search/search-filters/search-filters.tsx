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
type TextSearchFilterSelectProps = {
  column: ResponseFilterItem["column"];
  value: ResponseFilterItem["values"][0]["value"];
};

@Component({
  tag: "search-filters",
  styleUrl: "search-filters.css",
  shadow: true,
})
export class SearchFilters {
  @Element() el: HTMLElement;

  @Prop() filter: SearchSessionFilter | null = null;
  @Prop() textSearchFilter: ResponseFilterItem | null = null;
  @Prop() basicEventData: BasicEventData;

  @State() selectedFilter = "";
  @State() hideFilters: boolean = true;

  @Event() vviinnSelectFilter: EventEmitter<SelectFilterEventData>;
  @Event() vviinnTextSearchFilterSelected: EventEmitter<RequestFilterItem[0]>;

  private filterType: string =
    this.filter?.name ?? this.textSearchFilter?.column;

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

  private handleTextSearchEnter(
    ev: KeyboardEvent,
    { column, value }: TextSearchFilterSelectProps
  ) {
    if (ev.key !== "Enter") return;
    this.handleTextSearchFilterSelection({ column, value });
  }

  private handleTextSearchFilterSelection({
    column,
    value,
  }: TextSearchFilterSelectProps) {
    this.vviinnTextSearchFilterSelected.emit(
      this.getTextSearchFilterRequestValue({ column, value })
    );
  }

  private getTextSearchFilterRequestValue = ({
    column,
    value,
  }: TextSearchFilterSelectProps): RequestFilterItem[0] => {
    return {
      column,
      values: [value],
    };
  };

  render() {
    const textSearchFilters = this.textSearchFilter?.values || [];
    const filters = this.filter?.filters || [];
    return (
      <Host exportparts="filter, show-more-filters">
        <div
          class={{
            filters: true,
            "no-scrollbar-mobile":
              this.isCategoriesFilterType() || this.textSearchFilter !== null,
            "no-scrollbar":
              !this.isCategoriesFilterType() && this.textSearchFilter === null,
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
              .map(({ value, label, selected }, index) => {
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
                      this.handleTextSearchFilterSelection({
                        column: this.textSearchFilter["column"],
                        value,
                      });
                    }}
                    onKeyPress={(ev) => {
                      if (searchState.loading) return;
                      this.handleTextSearchEnter(ev, {
                        column: this.textSearchFilter["column"],
                        value,
                      });
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
