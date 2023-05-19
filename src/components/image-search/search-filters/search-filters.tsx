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
import { FilterAction } from "vviinn-tracking-client-ts";
import { Link } from "../../../network/ion/Link";
import { SearchSessionFilter } from "../../../searchSession/searchSession";
import { imageSearchState } from "../../../store/imageSearch.store";
import { CheckIcon } from "../../vviinn-icons";

const FILTERS_COUNT: number = 5;
const ACTIVE_FILTER_CLASSNAME = ".filter.active";

const getFilterId = (filter: Link): string =>
  filter.href.split("/").reverse()[0];

@Component({
  tag: "search-filters",
  styleUrl: "search-filters.css",
  shadow: true,
})
export class SearchFilters {
  @Element() el: HTMLElement;

  @Prop() filter: SearchSessionFilter | null = null;
  @State() selectedCategoryId: string | null = null;
  @State() hideFilters: boolean = true;

  @Event() vviinnSelectFilter: EventEmitter<FilterAction>;

  private handleFilterSelection(filter: Link): void {
    return this.isFilterSelected(filter)
      ? this.clearSelectedFilter()
      : this.selectFilter(filter);
  }

  private selectFilter(filter: Link) {
    this.selectedCategoryId = getFilterId(filter);
    imageSearchState.activeIonLink = filter;
    this.vviinnSelectFilter.emit("select");
  }

  private clearSelectedFilter() {
    this.selectedCategoryId = null;
    imageSearchState.activeIonLink = undefined;

    this.findSelectedFilter().blur();
    this.vviinnSelectFilter.emit("deselect");
  }

  private findSelectedFilter(): HTMLElement {
    return this.el.shadowRoot.querySelector(ACTIVE_FILTER_CLASSNAME);
  }

  private toggleFilters() {
    this.hideFilters = !this.hideFilters;
  }

  private handleEnter(ev: KeyboardEvent, f: Link) {
    if (ev.key !== "Enter") return;
    this.handleFilterSelection(f);
  }

  private isFilterSelected(filterLink: Link): boolean {
    return this.selectedCategoryId === getFilterId(filterLink);
  }

  render() {
    return (
      <Host exportparts="filter, show-more-filters">
        <div class="filters">
          {this.filter.filters
            .filter((_, i) => (this.hideFilters ? i < FILTERS_COUNT : true))
            .map((f, n) => (
              <div
                role="button"
                tabindex="0"
                part={this.isFilterSelected(f) ? "filter active" : "filter"}
                class={{
                  filter: true,
                  active: this.selectedCategoryId === getFilterId(f),
                }}
                style={{ "animation-delay": `${n * 10}ms` }}
                onPointerUp={(ev) => {
                  ev.stopPropagation();
                  this.handleFilterSelection(f);
                }}
                onKeyPress={(ev) => this.handleEnter(ev, f)}
              >
                {this.isFilterSelected(f) ? <CheckIcon /> : null}
                {f.name}
              </div>
            ))}

          <div
            class={{
              filter: true,
              "show-more": true,
              hidden: this.filter.filters.length <= FILTERS_COUNT,
              active: !this.hideFilters,
            }}
            role="button"
            tabindex="0"
            aria-role="button"
            onClick={() => this.toggleFilters()}
            onKeyPress={(ev) => {
              if (ev.key === "Enter") {
                this.toggleFilters();
              }
            }}
            part="show-more-filters"
          >
            {this.hideFilters ? "Zeige mehr" : "Zeige weniger"}
          </div>
        </div>
      </Host>
    );
  }
}
