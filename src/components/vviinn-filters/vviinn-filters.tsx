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
  subFilterSelection,
  GetFilterOptions,
} from "./helpers";
import { Histogram } from "../vviinn-price-range/vviinn-price-range";
import {
  ChangedFiltersEventData,
  DynamicFiltersEventData,
} from "../../recommendation/events";
import { components } from "../../interfaces/generated";
import { StarsIcon, CheckFilterIcon, CloseFilterIcon } from "../vviinn-icons";

/**
 * @part filters - Wrapper itself.
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

  @State() selectedFilter: DynamicFilter;
  @State() requestFilters: RequestDynamicFilters = [];

  /** The filter's state changes */
  @Event({ bubbles: true })
  vviinnFiltersChanged: EventEmitter<ChangedFiltersEventData>;
  /** The filters received */
  @Event({ bubbles: true })
  vviinnFilters: EventEmitter<DynamicFiltersEventData>;

  /** @internal */
  @Event({ bubbles: true, composed: true })
  globalSlotsChanged: EventEmitter<any>;

  private handleMainFilterSelection(filter: DynamicFilter) {
    this.selectedFilter = filter;
  }

  private emitRequestFiltersMore(requestFilters: RequestDynamicFilters) {
    this.vviinnFiltersChanged.emit({ filters: requestFilters, el: this.el });
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
    seletedFilter: DynamicFilter
  ) {
    this.requestFilters = subFilterSelection(
      this.requestFilters,
      seletedFilter,
      filterValue
    );

    this.emitRequestFiltersMore([...this.requestFilters]);
  }

  private showActiveOnMainButton({ column }: DynamicFilter) {
    if (!this.selectedFilter) return "";

    return this.selectedFilter.column === column ? "active" : "";
  }

  private showActiveOnSubButton(
    requestFilters: RequestDynamicFilters,
    filterValue: DynamicFilterValue,
    selectedFilter: DynamicFilter
  ) {
    if (!selectedFilter || !requestFilters) return false;

    const mainFilter = requestFilters.find(
      (filter) => filter.column === selectedFilter.column
    );

    if (!mainFilter) return "";

    return mainFilter.values.some(
      (value) =>
        value === filterValue ||
        value === filterValue.interval ||
        value === filterValue.value
    )
      ? true
      : false;
  }

  private handleSetFilters = ({
    detail,
  }: CustomEvent<DynamicFiltersEventData>) => {
    this.filters = detail;
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
    const { column } = this.selectedFilter ?? {};
    const selectedFilterOptions = getFilterOptions(this.selectedFilter);
    const filters = this.filters.filter((filter) => filter.isPrimary);
    if (filters.length === 0) return <Host></Host>;

    const RenderButton = (
      value,
      label,
      active,
      selectedFilter,
      isSelected = false
    ) => {
      const hexCode = value.hexCode;
      return (
        <li
          onClick={() => this.handleSubFilterSelection(value, selectedFilter)}
        >
          <button
            class={`filters-sub-button${isSelected ? "-selected" : ""} ${
              hexCode ? "filters-sub-button-color" : ""
            }`}
            style={{ backgroundColor: hexCode }}
            disabled={!active}
          >
            <span>
              {label} {!isSelected ? <StarsIcon /> : <CheckFilterIcon />}
            </span>
          </button>
          {isSelected && hexCode && <CloseFilterIcon />}
        </li>
      );
    };

    let selectedButtons = [];
    this.filters.forEach((filter) => {
      if (!("values" in filter)) return;

      (filter.values as GetFilterOptions).forEach(
        ({ value, label, active }) => {
          if (this.showActiveOnSubButton(this.requestFilters, value, filter)) {
            selectedButtons.push(
              RenderButton(value, label, active, filter, true)
            );
          }
        }
      );
    });

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
            {column === "price" ? (
              <vviinn-price-range
                histogram={selectedFilterOptions as Histogram}
                priceChangeHandler={this.priceChangeHandler}
                selectedInterval={
                  (this.requestFilters.find((f) => f.column === "price")
                    ?.values[0] ?? {}) as components["schemas"]["interval"]
                }
              />
            ) : (
              <ul class="sub-filters-wrapper">
                {selectedFilterOptions &&
                  selectedFilterOptions.map(({ value, label, active }) => {
                    if (
                      this.showActiveOnSubButton(
                        this.requestFilters,
                        value,
                        this.selectedFilter
                      )
                    ) {
                      return null;
                    }

                    return RenderButton(
                      value,
                      label,
                      active,
                      this.selectedFilter
                    );
                  })}
              </ul>
            )}

            {selectedButtons.length > 0 && (
              <ul class="selected-filters-wrapper">{selectedButtons}</ul>
            )}
          </div>
        )}
      </Host>
    );
  }
}
