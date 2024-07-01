import {
  Component,
  Host,
  h,
  Prop,
  State,
  Event,
  EventEmitter,
  Element,
} from "@stencil/core";
import {
  DynamicFilters,
  DynamicFilter,
  DynamicFilterValue,
  RequestDynamicFilters,
} from "../../campaign/VPRCampaignService";

import { getFilterOptions, subFilterSelection } from "./helpers";
/**
 * * @part filters - Wrapper itself.
 */

@Component({
  tag: "vviinn-filters",
  styleUrl: "vviinn-filters.css",
  shadow: true,
})
export class VviinnFilters {
  @Element() el: HTMLElement;

  @Prop() filters: DynamicFilters = [];
  @Prop() showExtended: boolean = false;
  @Prop() showFirst: number = 4;

  @State() selectedFilter: DynamicFilter;
  @State() requestFilters: RequestDynamicFilters = [];

  /** Event fires when user click on Add to Basket button */
  @Event({ bubbles: true })
  vviinnFiltersChanged: EventEmitter<RequestDynamicFilters>;

  private handleMainFilterSelection(filter: DynamicFilter) {
    this.selectedFilter = filter;
  }

  private emitTequestFiltersMore(requestFilters: RequestDynamicFilters) {
    this.vviinnFiltersChanged.emit(requestFilters);
  }

  private handleSubFilterSelection(
    filterValue: DynamicFilterValue,
    seletedFilter: DynamicFilter
  ) {
    this.requestFilters = subFilterSelection(
      this.requestFilters,
      seletedFilter,
      filterValue
    );

    this.emitTequestFiltersMore({
      ...this.requestFilters,
    });
  }

  private showActiveOnMainButton({ column }: DynamicFilter) {
    if (!this.selectedFilter) return "";

    return this.selectedFilter.column === column ? "active" : "";
  }

  private showActiveOnSubButton(
    requestFilters: RequestDynamicFilters,
    filterValue: DynamicFilterValue
  ) {
    if (!this.selectedFilter) return "";

    const mainFilter = requestFilters.find(
      (filter) => filter.column === this.selectedFilter.column
    );

    if (!mainFilter) return "";

    return mainFilter.values.some(
      (value) => value === filterValue || value === filterValue.interval
    )
      ? "active"
      : "";
  }

  private handleFiltersChanged = (event) => {
    this.filters = event.detail;
  };

  connectedCallback() {
    document.addEventListener("vviinnFilters", this.handleFiltersChanged);
  }

  disconnectedCallback() {
    document.removeEventListener("vviinnFilters", this.handleFiltersChanged);
  }

  render() {
    const selectedFilterOptions = getFilterOptions(this.selectedFilter);
    const filters = this.filters.slice(0, this.showFirst);

    if (filters.length === 0) return <Host></Host>;

    return (
      <Host part="filters">
        <div class="filters-header">
          <ul class="main-filters-wrapper">
            {filters.map((filter) => {
              return (
                <li>
                  <button
                    class={`filters-main-button ${this.showActiveOnMainButton(
                      filter
                    )}`}
                    onClick={() => this.handleMainFilterSelection(filter)}
                  >
                    {filter.column}
                  </button>
                </li>
              );
            })}
          </ul>
          {this.showExtended && (
            <vviinn-extended-filters
              filters={this.filters}
            ></vviinn-extended-filters>
          )}
        </div>

        {this.selectedFilter !== undefined && (
          <div class="filters-footer">
            <ul class="sub-filters-wrapper">
              {selectedFilterOptions &&
                selectedFilterOptions.map((filter) => {
                  return (
                    <li>
                      <button
                        onClick={() =>
                          this.handleSubFilterSelection(
                            filter.value,
                            this.selectedFilter
                          )
                        }
                        class={`filters-sub-button ${this.showActiveOnSubButton(
                          this.requestFilters,
                          filter.value
                        )}`}
                      >
                        {filter.label}
                      </button>
                    </li>
                  );
                })}
            </ul>
          </div>
        )}
      </Host>
    );
  }
}
