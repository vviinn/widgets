import {
  Component,
  Host,
  h,
  Prop,
  EventEmitter,
  Event,
  State,
  Listen,
} from "@stencil/core";
import { Link } from "../../../network/ion/Link";
import { SearchSessionFilter } from "../../../searchSession/searchSession";
import { imageSearchState } from "../../../store/imageSearch.store";

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
    imageSearchState.activeIonLink = f;
  }

  private toggleFilters() {
    this.hideFilters = !this.hideFilters;
  }

  private handleEnter(ev: KeyboardEvent, f: Link) {
    if (ev.key !== "Enter") return;
    this.filterSelected(f);
  }

  render() {
    return (
      <Host exportparts="filter, show-more-filters">
        <div class="filters">
          {this.filter.filters
            .filter((_, i) => (this.hideFilters ? i < 5 : true))
            .map((f, n) => (
              <div
                role="button"
                tabindex="0"
                part={
                  this.selectedCategoryId === getFilterId(f)
                    ? "filter active"
                    : "filter"
                }
                class={{
                  filter: true,
                  active: this.selectedCategoryId === getFilterId(f),
                }}
                style={{ "animation-delay": `${n * 10}ms` }}
                onClick={() => this.filterSelected(f)}
                onKeyPress={(ev) => this.handleEnter(ev, f)}
              >
                {f.name}
              </div>
            ))}

          <div
            class="filter"
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
            {this.hideFilters ? "show more" : "show less"}
          </div>
        </div>
      </Host>
    );
  }
}
