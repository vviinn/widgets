import {
  Component,
  Host,
  h,
  Prop,
  State,
  Event,
  EventEmitter,
  Element,
  Watch,
} from "@stencil/core";
import {
  DynamicFilters,
  DynamicFilter,
  DynamicFilterValue,
  RequestDynamicFilters,
} from "../../campaign/VPRCampaignService";
import { FiltersEventData } from "./types";
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
  @Prop() filtersString: string = "";

  @State() selectedFilter: DynamicFilter;
  @State() requestFilters: RequestDynamicFilters = [];

  /** @internal */
  @Event({ bubbles: true, composed: true })
  globalSlotsChanged: EventEmitter<any>;
  /** Event fires when filters position change */
  @Event({ bubbles: true })
  vviinnFiltersChanged: EventEmitter<FiltersEventData>;

  private handleMainFilterSelection(filter: DynamicFilter) {
    this.selectedFilter = filter;
  }

  private emitTequestFiltersMore(requestFilters: RequestDynamicFilters) {
    this.vviinnFiltersChanged.emit({ filters: requestFilters, el: this.el });
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

    this.emitTequestFiltersMore([...this.requestFilters]);
  }

  private showActiveOnMainButton({ column }: DynamicFilter) {
    if (!this.selectedFilter) return "";

    return this.selectedFilter.column === column ? "active" : "";
  }

  private showActiveOnSubButton(
    requestFilters: RequestDynamicFilters,
    filterValue: DynamicFilterValue
  ) {
    if (!this.selectedFilter || !requestFilters) return "";

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

  private handleSetFilters = (event) => {
    this.filters = event.detail;
  };

  private handleFiltersChanged = ({
    detail,
  }: CustomEvent<FiltersEventData>) => {
    const { filters, el: senderElement } = detail;

    if (senderElement === this.el) return;

    this.requestFilters = filters;

    if (!this.selectedFilter) {
      this.selectedFilter = this.filters.find(
        (f) => f.column === filters[0].column
      );
    }
  };

  @Watch("filtersString")
  filtersStringWatcher() {
    if (this.filtersString === "") return;

    try {
      this.filters = JSON.parse(this.filtersString) as DynamicFilters;
    } catch (e) {
      console.error("Invalid filters string", e);
    }
  }

  connectedCallback() {
    document.addEventListener("vviinnFilters", this.handleSetFilters);
    document.addEventListener(
      "vviinnFiltersChanged",
      this.handleFiltersChanged
    );

    this.filtersStringWatcher();
  }

  disconnectedCallback() {
    document.removeEventListener("vviinnFilters", this.handleSetFilters);
    document.removeEventListener(
      "vviinnFiltersChanged",
      this.handleFiltersChanged
    );
  }

  render() {
    const selectedFilterOptions = getFilterOptions(this.selectedFilter);
    //TODO - #36707: Will remove this logic then we have the `Primary filters` feature
    const filters = this.filters.slice(0, 4);
    if (filters.length === 0) return <Host></Host>;

    return (
      <Host part="filters">
        <div class="main-filters-wrapper">
          <ul class="main-filters-list">
            {filters.map((filter) => {
              return (
                <li>
                  <button
                    class={`filters-main-button ${this.showActiveOnMainButton(
                      filter
                    )}`}
                    onClick={() => this.handleMainFilterSelection(filter)}
                  >
                    {filter.label}
                  </button>
                </li>
              );
            })}
          </ul>
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
