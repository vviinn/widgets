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
  ResponseDynamicFilterItem,
  DynamicFilterValue,
  RequestDynamicFilterItem,
} from "../../campaign/VPRCampaignService";
import {
  getFilterOptions,
  RenderFilterButton,
  isSubFilterActive,
  getSelectedPriceInterval,
} from "./helpers";
import { Histogram } from "../vviinn-price-range/vviinn-price-range";
import {
  ChangedFiltersEventData,
  DynamicFilterInternalData,
  TriggerSourceEvent,
  TriggerSourceEventData,
} from "../../recommendation/events";
import { triggerFilter } from "./helpers/triggerFilter";
import { SearchStore, useSearchStore } from "../../store/search.store";
import { isIntervalFilter } from "../../filters";
import { addEventListenersWithSignal } from "../../dom";

/**
 * @part filters-wrapper - Wrapper for the main filters.
 * @part filters-list - List of main filters.
 * @part filters-main-button - Main filter button.
 * @part filters-footer - Wrapper for the sub filters.
 * @part filters-footer-list - List of sub filters.
 
 * @part filters-sub-row - Row of the sub filters.
 * @part filters-option-button - Button of the sub filter.
 * @part filters-option-image - Image of the sub filter.
 * @part filters-option-color-dot - Color Dot of the sub filter.
 * @part filters-option-text - Text of the sub filter.
 * @part filters-option-icon-wrapper - Icon Wrapper of the sub filter.

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

  /** @internal */
  @Prop() filtersString: string = "";
  /** @internal */
  @Prop() showInWidget: boolean = false;

  @State() innerFilters: ResponseDynamicFilterItem[] = [];
  @State() selectedFilter?: ResponseDynamicFilterItem;
  @State() requestFilters: RequestDynamicFilterItem[] = [];

  /** The filter's state changes */
  @Event({ bubbles: true })
  vviinnFiltersChanged: EventEmitter<ChangedFiltersEventData>;

  @Event() vviinnFilterTriggered: EventEmitter<DynamicFilterInternalData>;

  /** @internal */
  @Event({ bubbles: true, composed: true })
  globalSlotsChanged: EventEmitter<any>;

  /** Selected filters should be resetted */
  /** @internal */
  @Event() vviinnSelectedFiltersReset: EventEmitter<TriggerSourceEventData>;

  private state?: SearchStore;
  private eventAbortController?: AbortController;

  private getFilters = () =>
    this.innerFilters.length ? this.innerFilters : this.state.dynamicFilters;

  private handleMainFilterSelection(filter: ResponseDynamicFilterItem) {
    this.selectedFilter = filter;
    this.vviinnFilterTriggered.emit({
      action: "show",
      kind: filter.column,
      isTriggeredByVpsWidget: this.showInWidget,
    });
  }

  private handleSelectedFiltersReset = ({ detail }: TriggerSourceEvent) => {
    if (this.skipStateChanges(detail.isTriggeredByVpsWidget)) return;
    this.requestFilters = [];
    this.selectedFilter = undefined;
  };

  private skipStateChanges = (isTriggeredByVpsWidget: boolean) =>
    this.showInWidget !== isTriggeredByVpsWidget;

  private priceChangeHandler = (filterValue: DynamicFilterValue) => {
    this.handleSubFilterSelection(filterValue, this.selectedFilter);
  };

  private handleSubFilterSelection(
    filterValue: DynamicFilterValue,
    selectedFilter: ResponseDynamicFilterItem,
  ) {
    this.requestFilters = triggerFilter({
      filterValue,
      selectedFilter,
      requestFilters: this.requestFilters,
      vviinnFilterTriggered: this.vviinnFilterTriggered,
      vviinnFiltersChanged: this.vviinnFiltersChanged,
      el: this.el,
      isTriggeredByVpsWidget: this.showInWidget,
    });
  }

  private showActiveOnMainButton({ column }: ResponseDynamicFilterItem) {
    if (!this.selectedFilter) return "";
    return this.selectedFilter?.column === column ? "active" : "";
  }

  private handleFilterTriggered = ({
    detail,
  }: CustomEvent<DynamicFilterInternalData>) => {
    const { kind, isTriggeredByVpsWidget, action, customTrigger } = detail;
    if (this.skipStateChanges(isTriggeredByVpsWidget) || !!customTrigger)
      return;

    if (action === "select") {
      this.selectedFilter = this.getFilters().find((f) => f.column === kind);
    }
  };

  private handleFiltersChanged = ({
    detail,
  }: CustomEvent<ChangedFiltersEventData>) => {
    const { filters, el: senderElement, isTriggeredByVpsWidget } = detail;

    if (
      senderElement === this.el ||
      this.skipStateChanges(isTriggeredByVpsWidget)
    )
      return;

    this.requestFilters = filters;

    if (!this.selectedFilter) {
      this.selectedFilter = this.getFilters().find(
        (f) => f?.column === filters[0]?.column,
      );
    }
  };

  @Watch("filtersString")
  filtersStringWatcher() {
    if (this.filtersString === "") return;

    try {
      this.innerFilters = JSON.parse(
        this.filtersString,
      ) as ResponseDynamicFilterItem[];
    } catch (e) {
      console.error("Invalid filters string", e);
    }
  }

  connectedCallback() {
    const { state } = useSearchStore(this.showInWidget);
    this.state = state;

    this.eventAbortController = new AbortController();
    const { signal } = this.eventAbortController;

    addEventListenersWithSignal(
      document,
      [
        ["vviinnFiltersChanged", this.handleFiltersChanged],
        ["vviinnSelectedFiltersReset", this.handleSelectedFiltersReset],
        ["vviinnFilterTriggered", this.handleFilterTriggered],
      ],
      signal,
    );

    this.filtersStringWatcher();
  }

  disconnectedCallback() {
    this.eventAbortController?.abort();
  }

  render() {
    const filters = this.getFilters().filter((filter) => filter.isPrimary);

    const { column } = this.selectedFilter ?? {};
    const filterOptions = getFilterOptions(this.selectedFilter);

    return (
      <Host
        class={{
          "show-in-widget": this.showInWidget,
        }}
      >
        {filters?.length > 0 && (
          <ul class="main-filters-list" part="filters-list">
            {filters.map((filter) => {
              return (
                <li>
                  <button
                    class={`filters-main-button ${this.showActiveOnMainButton(
                      filter,
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
        )}

        {!!this.selectedFilter && this.selectedFilter.isPrimary && (
          <div class="filters-footer" part="filters-footer">
            {isIntervalFilter(column) ? (
              <vviinn-price-range
                histogram={(filterOptions as Histogram).filter(
                  (item) => item.value.frequency > 0,
                )}
                priceChangeHandler={this.priceChangeHandler}
                selectedInterval={getSelectedPriceInterval(this.requestFilters)}
              />
            ) : (
              <ul class="sub-filters-wrapper" part="filters-footer-list">
                {!!filterOptions &&
                  filterOptions.map(({ value, label, active }) => {
                    const isSelected = isSubFilterActive(
                      this.requestFilters,
                      value,
                      this.selectedFilter,
                    );

                    return RenderFilterButton({
                      handleSubFilterSelection:
                        this.handleSubFilterSelection.bind(this),
                      selectedFilter: this.selectedFilter,
                      value,
                      label,
                      active,
                      isSelected,
                    });
                  })}
              </ul>
            )}
          </div>
        )}
      </Host>
    );
  }
}
