import {
  Component,
  Host,
  h,
  Prop,
  Watch,
  State,
  Event,
  EventEmitter,
} from "@stencil/core";
import {
  DynamicFilters,
  DynamicFilter,
  DynamicFilterValue,
  RequestDynamicFilters,
} from "../../campaign/VPRCampaignService";
import { FiltersIcon, NewCloseIcon } from "../vviinn-icons";

import { getFilterOptions } from "./helpers";

/**
 * * @part filters - Wrapper itself.
 */
@Component({
  tag: "vviinn-filters",
  styleUrl: "vviinn-filters.css",
  shadow: true,
})
export class VviinnFilters {
  @Prop() filters: DynamicFilters = [];

  /** @internal */
  @Prop() widgetElementId?: string;

  @State() selectedFilter: DynamicFilter;
  @State() requestFilters: RequestDynamicFilters = [];
  @State() requestFiltersMore: RequestDynamicFilters = [];
  @State() showMore: boolean = false;
  @State() selectedMoreOptions: string[] = [];

  /** Event fires when filters position change */
  @Event({ bubbles: true })
  vviinnFiltersChanged: EventEmitter<RequestDynamicFilters>;

  private mainFilters: DynamicFilters = [];
  private moreFilters: DynamicFilters = [];

  connectedCallback() {
    this.setMainAndMoreFilters();
  }

  @Watch("filters")
  setMainAndMoreFilters() {
    this.mainFilters = this.filters.slice(0, 4);
    this.moreFilters = this.filters.slice(4);
  }

  private handleMainFilterSelection(filter: DynamicFilter) {
    this.selectedFilter = filter;
  }

  private subFilterSelection(
    filters: RequestDynamicFilters,
    { column: selectedColumn }: DynamicFilter,
    filterValue: DynamicFilterValue
  ) {
    const value = filterValue.interval ?? filterValue;

    const index = filters.findIndex(({ column }) => column === selectedColumn);
    const valueIndex = filters[index]?.values.findIndex((val) => val === value);

    const pushObject = { column: selectedColumn, values: [] };
    if (valueIndex > -1) pushObject.values.splice(valueIndex, 1);
    else pushObject.values.push(value);

    if (index === -1) filters = [...filters, pushObject];
    else {
      filters[index] = pushObject;

      if (filters[index].values.length === 0) {
        filters = [...filters.filter((filter) => filters[index] !== filter)];
      } else {
        filters = [...filters];
      }
    }

    return filters;
  }

  private emitTequestFiltersMore(requestFilters: RequestDynamicFilters) {
    this.vviinnFiltersChanged.emit(requestFilters);
    this.showMore = false;
  }

  private handleSubFilterSelection(
    filterValue: DynamicFilterValue,
    seletedFilter: DynamicFilter,
    type: "main" | "more" = "main"
  ) {
    if (type === "main") {
      this.requestFilters = this.subFilterSelection(
        this.requestFilters,
        seletedFilter,
        filterValue
      );

      this.emitTequestFiltersMore({
        ...this.requestFilters,
      });
    } else {
      this.requestFiltersMore = this.subFilterSelection(
        this.requestFiltersMore,
        seletedFilter,
        filterValue
      );
    }
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

  private showActiveOnModalSubButton(
    requestFilters: RequestDynamicFilters,
    filterValue: DynamicFilterValue
  ) {
    let className = "";
    requestFilters.forEach((filter) => {
      if (
        filter.values.some(
          (value) => value === filterValue || value === filterValue.interval
        )
      ) {
        className = "active";
      }
    });
    return className;
  }

  private handleMoreOptionsMainClick(column: string) {
    if (this.selectedMoreOptions.includes(column)) {
      this.selectedMoreOptions = this.selectedMoreOptions.filter(
        (option) => option !== column
      );
    } else {
      this.selectedMoreOptions = [...this.selectedMoreOptions, column];
    }
  }

  private filtersModalApply() {
    this.emitTequestFiltersMore({
      ...this.requestFilters,
      ...this.requestFiltersMore,
    });
  }

  render() {
    const selectedFilterOptions = getFilterOptions(this.selectedFilter);

    let moreFiltersOptionCount = 0;
    this.moreFilters.forEach((filter) => {
      moreFiltersOptionCount += getFilterOptions(filter).length;
    });

    return (
      <Host part="filters">
        <div class="filters-header">
          <ul class="main-filters-wrapper">
            {this.mainFilters.map((filter) => {
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

          {this.moreFilters.length > 0 && (
            <button
              class="filters-more-button"
              onClick={() => (this.showMore = true)}
            >
              <FiltersIcon />
            </button>
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

        <div class={`filters-modal ${this.showMore ? "open" : ""}`}>
          <div class="filters-modal-wrapper">
            <div class="filters-modal-header">
              Filters
              {moreFiltersOptionCount > 0 ? ` (${moreFiltersOptionCount})` : ""}
              <button
                class="filters-modal-close"
                onClick={() => {
                  this.showMore = false;
                  this.requestFiltersMore = [];
                }}
              >
                <NewCloseIcon />
              </button>
            </div>

            <ul class="filters-modal-list">
              {this.moreFilters.map((mainFilter) => {
                const filterOptions = getFilterOptions(mainFilter);

                return (
                  <li>
                    <button
                      onClick={() =>
                        this.handleMoreOptionsMainClick(mainFilter.column)
                      }
                      class="filters-modal-main-button"
                    >
                      {mainFilter.column}{" "}
                      {filterOptions.length > 0
                        ? `(${filterOptions.length})`
                        : ""}
                    </button>

                    <ul
                      class={`filters-modal-sub-list ${
                        this.selectedMoreOptions.includes(mainFilter.column)
                          ? "open"
                          : ""
                      }`}
                    >
                      {filterOptions &&
                        filterOptions.map((filter) => {
                          return (
                            <li>
                              <button
                                onClick={() =>
                                  this.handleSubFilterSelection(
                                    filter.value,
                                    mainFilter,
                                    "more"
                                  )
                                }
                                class={`filters-more-modal-button ${this.showActiveOnModalSubButton(
                                  this.requestFiltersMore,
                                  filter.value
                                )}`}
                              >
                                {filter.label}
                              </button>
                            </li>
                          );
                        })}
                    </ul>
                  </li>
                );
              })}
            </ul>

            <div class="filters-modal-actions">
              <button
                class="filters-modal-apply"
                onClick={() => this.filtersModalApply()}
                disabled={this.requestFiltersMore.length === 0}
              >
                Apply
              </button>

              <button
                class="filters-modal-reset"
                onClick={() => (this.requestFiltersMore = [])}
              >
                Reset Filters
              </button>
            </div>
          </div>
        </div>
      </Host>
    );
  }
}
