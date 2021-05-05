import {
  Component,
  Host,
  h,
  Prop,
  EventEmitter,
  Event,
  State,
  Listen
} from "@stencil/core";
import { Link } from "../../../network/ion/Link";
import { SearchSessionFilter } from "../../../searchSession/searchSession";

const getFilterId = (filter: Link): string =>
  filter.href.split("/").reverse()[0];

@Component({
  tag: "search-filters",
  styleUrl: "search-filters.css",
  shadow: true,
})
export class SearchFilters {
  @Prop() filter: SearchSessionFilter | null = null;
  @State() selectedCategoryId: string | null = null;
  @State() hideFilters: boolean = true;
  @Event() filterSelectedEvent: EventEmitter<Link>;

  @Listen("filtersCleared", { target: "window" })
  handleClearingFilters() {
    this.selectedCategoryId = null;
  }

  private filterSelected(f: Link) {
    this.filterSelectedEvent.emit(f);
    this.selectedCategoryId = getFilterId(f);
  }

  private toggleFilters() {
    this.hideFilters = !this.hideFilters;
  }

  render() {
    return (
      <Host exportparts="filter, show-more-filters">
        <span>{this.filter.name}:</span>
        <div class="filters">
          {this.filter.filters
            .filter((_, i) => (this.hideFilters ? i < 5 : true))
            .map((f, n) => (
              <div
                part="filter"
                class={{
                  filter: true,
                  active: this.selectedCategoryId === getFilterId(f),
                }}
                style={{ "animation-delay": `${n * 10}ms` }}
                onClick={() => this.filterSelected(f)}
              >
                {f.name}
              </div>
            ))}
          <div
            class="filter"
            onClick={() => this.toggleFilters()}
            part="show-more-filters"
          >
            {this.hideFilters ? "show more" : "show less"}
          </div>
        </div>
      </Host>
    );
  }
}
