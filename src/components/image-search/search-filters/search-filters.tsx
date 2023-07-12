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
import { imageSearchState } from "../../../store/imageSearch.store";
import {
  BasicEventData,
  SelectFilterEventData,
} from "../../../recommendation/events";
import { parseFilters } from "../../../filters/parseFilters";

const FILTERS_COUNT: number = 5;

@Component({
  tag: "search-filters",
  styleUrl: "search-filters.css",
  shadow: true,
})
export class SearchFilters {
  @Element() el: HTMLElement;

  @Prop() filter: SearchSessionFilter | null = null;
  @Prop() basicEventData: BasicEventData;

  @State() selectedFilter = "";
  @State() hideFilters: boolean = true;

  @Event() vviinnSelectFilter: EventEmitter<SelectFilterEventData>;

  private filterType: string = this.filter.name;

  private handleFilterSelection(filter: Link): void {
    return this.isFilterSelected(filter)
      ? this.clearSelectedFilter(filter)
      : this.selectFilter(filter);
  }

  private selectFilter(selectedFilter: Link) {
    imageSearchState.activeIonLink = selectedFilter;
    this.selectedFilter = parseFilters(selectedFilter, this.filterType);

    this.vviinnSelectFilter.emit({
      ...this.basicEventData,
      action: "select",
      filterName: selectedFilter.name,
    });
  }

  private clearSelectedFilter(selectedFilter: Link) {
    imageSearchState.activeIonLink = selectedFilter.clear;
    this.selectedFilter = parseFilters(selectedFilter.clear, this.filterType);

    this.vviinnSelectFilter.emit({
      ...this.basicEventData,
      action: "deselect",
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
    return this.filterType === "categories"
      ? this.selectedFilter === parseFilters(filterLink, "categories")
      : this.selectedFilter === filterLink.name;
  }

  render() {
    if (!this.filter) return null;
    const { name, filters } = this.filter;
    return (
      <Host exportparts="filter, show-more-filters">
        <div
          class={{
            filters: true,
            "no-scrollbar-mobile": this.filterType === "categories",
            "no-scrollbar": this.filterType !== "categories",
          }}
        >
          {filters
            .filter((_, i) => (this.hideFilters ? i < FILTERS_COUNT : true))
            .map((filter, index) => {
              const filterActive =
                name === "categories"
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
                    if (imageSearchState.loading) return;
                    ev.stopPropagation();
                    this.handleFilterSelection(filter);
                  }}
                  onKeyPress={(ev) => {
                    if (imageSearchState.loading) return;
                    this.handleEnter(ev, filter);
                  }}
                >
                  {filter.name}
                </div>
              );
            })}

          {this.hideFilters && (
            <div
              class={{
                "show-more": true,
                hidden: filters.length <= FILTERS_COUNT,
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
