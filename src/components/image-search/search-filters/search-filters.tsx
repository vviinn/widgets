import {
  Component,
  Host,
  h,
  Prop,
  EventEmitter,
  Event,
  State,
} from "@stencil/core";
import { IonLink } from "../../../network/ionClient";
import { SearchSessionFilter } from "../../../searchSession/searchSession";

const getFilterId = (filter: IonLink): string =>
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
  @Event() filterSelectedEvent: EventEmitter<IonLink>;

  private filterSelected(f: IonLink) {
    this.filterSelectedEvent.emit(f);
    this.selectedCategoryId = getFilterId(f);
  }

  private toggleFilters() {
    this.hideFilters = !this.hideFilters;
  }

  render() {
    return (
      <Host>
        <span>{this.filter.name}:</span>
        <div class="filters">
          {this.filter.filters
            .filter((_, i) => (this.hideFilters ? i < 5 : true))
            .map((f, n) => (
              <div
                class={{
                  filter: true,
                  active: this.selectedCategoryId == getFilterId(f),
                }}
                style={{ "animation-delay": `${n * 10}ms` }}
                onClick={() => this.filterSelected(f)}
              >
                {f.name}
              </div>
            ))}
          <div class="filter" onClick={() => this.toggleFilters()}>
            {this.hideFilters ? "show more" : "show less"}
          </div>
        </div>
      </Host>
    );
  }
}
