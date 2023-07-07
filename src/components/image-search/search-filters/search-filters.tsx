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

const FILTERS_COUNT: number = 5;

const parseFilters = (filter: Link, filterType): string => {
  const result = {};
  if (!filter) return "";
  filter.href
    .split("?")[1]
    .split("included[]=")
    .join("")
    .split("&")
    .forEach((f) => {
      const [key, value] = f.split("%3A");
      result[key] = value;
    });

  if (filterType === "categories") {
    return result["product_type"];
  }
  return result[filterType];
};

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

  private handleFilterSelection(filter: Link): void {
    return this.isFilterSelected(filter)
      ? this.clearSelectedFilter(filter)
      : this.selectFilter(filter);
  }

  private selectFilter(filter: Link) {
    imageSearchState.activeIonLink = filter;
    this.selectedFilter = parseFilters(filter, this.filter.name);

    this.vviinnSelectFilter.emit({
      ...this.basicEventData,
      action: "select",
      filterName: filter.name,
    });
  }

  private clearSelectedFilter(filter: Link) {
    imageSearchState.activeIonLink = filter.clear;
    this.selectedFilter = parseFilters(filter.clear, this.filter.name);

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
    return this.filter.name === "categories"
      ? this.selectedFilter === parseFilters(filterLink, "categories")
      : this.selectedFilter === filterLink.name;
  }

  render() {
    if (!this.filter) return null;
    const { name, filters } = this.filter;
    return (
      <Host exportparts="filter, show-more-filters">
        <div class="filters no-scrollbar">
          {filters
            .filter((_, i) => (this.hideFilters ? i < FILTERS_COUNT : true))
            .map((f, n) => {
              const filterActive =
                name === "categories"
                  ? this.selectedFilter === parseFilters(f, "categories")
                  : this.selectedFilter === f.name;
              return (
                <div
                  role="button"
                  tabindex="0"
                  part={filterActive ? "filter active" : "filter"}
                  class={{
                    filter: true,
                    active: filterActive,
                  }}
                  style={{ "animation-delay": `${n * 10}ms` }}
                  onPointerUp={(ev) => {
                    if (imageSearchState.loading) return;
                    ev.stopPropagation();
                    this.handleFilterSelection(f);
                  }}
                  onKeyPress={(ev) => {
                    if (imageSearchState.loading) return;
                    this.handleEnter(ev, f);
                  }}
                >
                  {f.name}
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
