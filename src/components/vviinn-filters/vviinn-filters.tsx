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
import {
  getFilterOptions,
  RenderButton,
  showActiveOnSubButton,
} from "./helpers";
import { Histogram } from "../vviinn-price-range/vviinn-price-range";
import {
  ChangedFiltersEventData,
  DynamicFiltersEventData,
  DynamicFilterTrackingData,
} from "../../recommendation/events";
import { components } from "../../interfaces/generated";
import { triggerFilter } from "./helpers/triggerFilter";

/**
 * @part filters-wrapper - Wrapper for the main filters.
 * @part filters-list - List of main filters.
 * @part filters-main-button - Main filter button.
 * @part filters-footer - Wrapper for the sub filters.
 * @part filters-footer-list - List of sub filters.

 * @part filters-sub-button - Sub filter button.
 
 * @part histogram - Wrapper itself.
 * @part histogram-bar - Bar of the histogram.
 * @part histogram-range-container - Container for the range sliders.
 * @part histogram-sliders-control - Container for the range sliders control.
 * @part histogram-from-slider - Slider for the minimum value.
 * @part histogram-to-slider - Slider for the maximum value.
 * @part histogram-label-wrapper - Wrapper for the labels.
 * @part histogram-label - Label for the histogram.
 */

@Component({
  tag: "vviinn-filters",
  styleUrl: "vviinn-filters.css",
  shadow: true,
})
export class VviinnFilters {
  @Element() el: HTMLElement;

  @Prop({ mutable: true }) filters: DynamicFilters = [];
  /** @internal */
  @Prop() filtersString: string = "";
  /** @internal */
  @Prop() showInWidget: boolean = false;
  /** The currency sign is displayed after the price */
  @Prop() currencySign?: string = "€";

  @State() selectedFilter: DynamicFilter;
  @State() requestFilters: RequestDynamicFilters = [];

  /** The filter's state changes */
  @Event({ bubbles: true })
  vviinnFiltersChanged: EventEmitter<ChangedFiltersEventData>;
  /** The filters received */
  @Event({ bubbles: true })
  vviinnFilters: EventEmitter<DynamicFiltersEventData>;

  @Event() vviinnFilterTriggered: EventEmitter<DynamicFilterTrackingData>;

  /** @internal */
  @Event({ bubbles: true, composed: true })
  globalSlotsChanged: EventEmitter<any>;

  /** Selected filters should be resetted */
  /** @internal */
  @Event({ bubbles: true })
  vviinnSelectedFiltersReset: EventEmitter;

  private handleMainFilterSelection(filter: DynamicFilter) {
    this.selectedFilter = filter;
  }

  timer: NodeJS.Timeout = null;

  private priceChangeHandler = (filterValue: DynamicFilterValue) => {
    if (this.timer) clearTimeout(this.timer);

    this.timer = setTimeout(() => {
      this.handleSubFilterSelection(filterValue, this.selectedFilter);
    }, 200);
  };

  private handleSubFilterSelection(
    filterValue: DynamicFilterValue,
    selectedFilter: DynamicFilter
  ) {
    this.requestFilters = triggerFilter(
      filterValue,
      selectedFilter,
      this.requestFilters,
      this.vviinnFilterTriggered,
      this.el,
      this.vviinnFiltersChanged
    );
  }

  private showActiveOnMainButton({ column }: DynamicFilter) {
    if (!this.selectedFilter) return "";

    return this.selectedFilter.column === column ? "active" : "";
  }

  private handleSetFilters = ({
    detail,
  }: CustomEvent<DynamicFiltersEventData>) => {
    this.filters = detail;
    if (!this.filters?.length) return;

    if (this.selectedFilter) {
      this.selectedFilter = this.filters.find(
        (f) => f.column === this.selectedFilter.column
      );
    }

    if (!detail.some(({ column }) => column === this.selectedFilter?.column)) {
      this.selectedFilter = undefined;
    }
  };

  private handleFiltersChanged = ({
    detail,
  }: CustomEvent<ChangedFiltersEventData>) => {
    const { filters, el: senderElement } = detail;

    if (senderElement === this.el) return;

    this.requestFilters = filters;

    if (!this.selectedFilter) {
      this.selectedFilter = this.filters.find(
        (f) => f.column === filters[0].column
      );
    }
  };

  private handleSelectedFiltersReset = () => {
    this.requestFilters = [];
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
    document.addEventListener(
      "vviinnSelectedFiltersReset",
      this.handleSelectedFiltersReset
    );

    this.filtersStringWatcher();
  }

  disconnectedCallback() {
    document.removeEventListener("vviinnFilters", this.handleSetFilters);
    document.removeEventListener(
      "vviinnFiltersChanged",
      this.handleFiltersChanged
    );
    document.removeEventListener(
      "vviinnSelectedFiltersReset",
      this.handleSelectedFiltersReset
    );
  }

  render() {
    if (!this.filters) return <Host></Host>;
    const { column } = this.selectedFilter ?? {};
    const selectedFilterOptions = getFilterOptions(this.selectedFilter);
    const filters = this.filters.filter((filter) => filter.isPrimary);

    if (filters.length === 0) return <Host></Host>;

    return (
      <Host
        class={{
          "show-in-widget": this.showInWidget,
        }}
      >
        <div class="main-filters-wrapper" part="filters-wrapper">
          <ul class="main-filters-list" part="filters-list">
            {filters.map((filter) => {
              return (
                <li>
                  <button
                    class={`filters-main-button ${this.showActiveOnMainButton(
                      filter
                    )}`}
                    onClick={() => this.handleMainFilterSelection(filter)}
                    part="filters-main-button"
                  >
                    {filter.label}
                  </button>
                </li>
              );
            })}
          </ul>
        </div>

        {this.selectedFilter !== undefined && (
          <div class="filters-footer" part="filters-footer">
            {column === "price" ? (
              <vviinn-price-range
                histogram={selectedFilterOptions as Histogram}
                priceChangeHandler={this.priceChangeHandler}
                selectedInterval={
                  (this.requestFilters.find(({ column }) => column === "price")
                    ?.values[0] ?? {}) as components["schemas"]["interval"]
                }
                currencySign={this.currencySign}
              />
            ) : (
              <ul class="sub-filters-wrapper" part="filters-footer-list">
                {selectedFilterOptions &&
                  selectedFilterOptions.map(({ value, label, active }) => {
                    const isSelected = showActiveOnSubButton(
                      this.requestFilters,
                      value,
                      this.selectedFilter
                    );

                    return RenderButton(
                      this.handleSubFilterSelection.bind(this),
                      value,
                      label,
                      active,
                      this.selectedFilter,
                      isSelected
                    );
                  })}
              </ul>
            )}
          </div>
        )}
      </Host>
    );
  }
}
