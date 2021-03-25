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

@Component({
  tag: "search-filters",
  styleUrl: "search-filters.css",
  shadow: true,
})
export class SearchFilters {
  @Prop() filter: SearchSessionFilter | null = null;
  @State() selectedCategoryName: string | null = null;
  @Event() filterSelectedEvent: EventEmitter<IonLink>;

  private filterSelected(f: IonLink) {
    this.filterSelectedEvent.emit(f);
    this.selectedCategoryName = f.name;
  }

  render() {
    return (
      <Host>
        <span>{this.filter.name}:</span>
        <div class="filters">
          {this.filter.filters.map((f) => (
            <div
              class={{
                filter: true,
                active: this.selectedCategoryName == f.name,
              }}
              onClick={() => this.filterSelected(f)}
            >
              {f.name}
            </div>
          ))}
        </div>
      </Host>
    );
  }
}
