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
import i18next from "i18next";
import { announceToScreenReader } from "../../a11y";
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
  @State() selectedFilterColumn?: string;
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
  private filterAnnouncementRef?: HTMLElement;

  private getFilters = () =>
    this.innerFilters.length ? this.innerFilters : this.state.dynamicFilters;

  private get selectedFilter(): ResponseDynamicFilterItem | undefined {
    return this.getFilters().find(
      (f) => f.column === this.selectedFilterColumn,
    );
  }

  private handleMainFilterSelection(filter: ResponseDynamicFilterItem) {
    this.selectedFilterColumn = filter.column;
    this.vviinnFilterTriggered.emit({
      action: "show",
      kind: filter.column,
      isTriggeredByVpsWidget: this.showInWidget,
    });

    this.announceFilterChange(
      i18next.t("a11y.filterExpanded", { label: filter.label }),
    );
  }

  private announceFilterChange(message: string) {
    announceToScreenReader(message, this.filterAnnouncementRef);
  }

  private handleKeyDown = (event: KeyboardEvent) => {
    if (event.key === "Escape" && this.selectedFilterColumn) {
      this.selectedFilterColumn = undefined;
      this.announceFilterChange(i18next.t("a11y.filterSelectionCleared"));
    }
  };

  private handleSelectedFiltersReset = ({ detail }: TriggerSourceEvent) => {
    if (this.skipStateChanges(detail.isTriggeredByVpsWidget)) return;
    this.requestFilters = [];
    this.selectedFilterColumn = undefined;
  };

  private skipStateChanges = (isTriggeredByVpsWidget: boolean) =>
    this.showInWidget !== isTriggeredByVpsWidget;

  private priceChangeHandler = (filterValue: DynamicFilterValue) => {
    this.handleSubFilterSelection(filterValue, this.selectedFilter);
  };

  private handleSubFilterSelection = (
    filterValue: DynamicFilterValue,
    selectedFilter: ResponseDynamicFilterItem,
  ) => {
    this.requestFilters = triggerFilter({
      filterValue,
      selectedFilter,
      requestFilters: this.requestFilters,
      vviinnFilterTriggered: this.vviinnFilterTriggered,
      vviinnFiltersChanged: this.vviinnFiltersChanged,
      el: this.el,
      isTriggeredByVpsWidget: this.showInWidget,
    });
  };

  private showActiveOnMainButton({ column }: ResponseDynamicFilterItem) {
    if (!this.selectedFilterColumn) return "";
    return this.selectedFilterColumn === column ? "active" : "";
  }

  private handleFilterTriggered = ({
    detail,
  }: CustomEvent<DynamicFilterInternalData>) => {
    const { kind, isTriggeredByVpsWidget, action, customTrigger } = detail;
    if (this.skipStateChanges(isTriggeredByVpsWidget) || !!customTrigger)
      return;

    if (action === "select") {
      this.selectedFilterColumn = this.getFilters().find(
        (f) => f.column === kind,
      )?.column;
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

    if (!this.selectedFilterColumn) {
      this.selectedFilterColumn = this.getFilters().find(
        (f) => f?.column === filters[0]?.column,
      )?.column;
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

    const { selectedFilter, handleSubFilterSelection } = this;
    const { column } = selectedFilter ?? {};
    const filterOptions = getFilterOptions(selectedFilter);

    return (
      <Host
        class={{
          "show-in-widget": this.showInWidget,
        }}
        onKeyDown={this.handleKeyDown}
      >
        <div
          ref={(el) => (this.filterAnnouncementRef = el)}
          aria-live="polite"
          class="sr-only"
        ></div>

        {filters?.length > 0 && (
          <nav aria-label={i18next.t("a11y.productFilters")}>
            <ul class="main-filters-list" part="filters-list">
              {filters.map((filter) => {
                const isExpanded = this.selectedFilterColumn === filter.column;

                return (
                  <li>
                    <button
                      class={`filters-main-button ${this.showActiveOnMainButton(
                        filter,
                      )}`}
                      onClick={() => this.handleMainFilterSelection(filter)}
                      part="filters-main-button"
                      aria-expanded={isExpanded ? "true" : "false"}
                      aria-label={i18next.t("a11y.filterButton", {
                        label: filter.label,
                      })}
                      type="button"
                    >
                      {filter.label}
                    </button>
                  </li>
                );
              })}
            </ul>
          </nav>
        )}

        {!!selectedFilter && selectedFilter.isPrimary && (
          <section
            class="filters-footer"
            part="filters-footer"
            aria-label={i18next.t("a11y.filterOptions", {
              label: selectedFilter.label,
            })}
          >
            {isIntervalFilter(column) ? (
              <vviinn-price-range
                histogram={filterOptions as Histogram}
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
                      selectedFilter,
                    );

                    return RenderFilterButton({
                      handleSubFilterSelection,
                      selectedFilter,
                      value,
                      label,
                      active,
                      isSelected,
                    });
                  })}
              </ul>
            )}
          </section>
        )}
      </Host>
    );
  }
}
