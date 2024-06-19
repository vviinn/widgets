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
  Filters,
  Filter,
  FilterValue,
  RequestFilters,
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
  @Prop() filters: Filters = [];

  /** @internal */
  @Prop() widgetElementId?: string;

  @State() seletedFilter: Filter;
  @State() requestFilters: RequestFilters = [];
  @State() requestFiltersMore: RequestFilters = [];
  @State() showMore: boolean = false;
  @State() selectedMoreOptions: string[] = [];

  /** Event fires when user click on Add to Basket button */
  @Event({ bubbles: true })
  vviinnFiltersChanged: EventEmitter<RequestFilters>;

  private mainFilters: Filters = [];
  private moreFilters: Filters = [];

  connectedCallback() {
    this.setMainAndMoreFilters();
  }

  @Watch("filters")
  setMainAndMoreFilters() {
    this.mainFilters = this.filters.slice(0, 3);
    this.moreFilters = this.filters.slice(3);
  }

  private handleMainFilterSelection(filter: Filter) {
    this.seletedFilter = filter;
  }

  private subFilterSelection(
    filters: RequestFilters,
    seletedFilter: Filter,
    filterValue: FilterValue
  ) {
    const index = filters.findIndex(
      (filter) => filter.column === seletedFilter.column
    );
    const value = filterValue.interval ?? filterValue;
    const pushObject = {
      column: seletedFilter.column,
      values: [],
    };
    pushObject.values.push(value);
    if (index !== -1) {
      filters[index] = pushObject;
      filters = [...filters];
    } else {
      filters = [...filters, pushObject];
    }
    return filters;
  }

  private handleSubFilterSelection(
    filterValue: FilterValue,
    seletedFilter: Filter,
    type: "main" | "more" = "main"
  ) {
    if (type === "main") {
      this.requestFilters = this.subFilterSelection(
        this.requestFilters,
        seletedFilter,
        filterValue
      );
      this.vviinnFiltersChanged.emit({
        ...this.requestFilters,
      });
      this.showMore = false;
    } else {
      this.requestFiltersMore = this.subFilterSelection(
        this.requestFiltersMore,
        seletedFilter,
        filterValue
      );
    }
  }

  private showActiveOnMainButton({ column }: Filter) {
    if (!this.seletedFilter) return "";

    return this.seletedFilter.column === column ? "active" : "";
  }

  private showActiveOnSubButton(filterValue: FilterValue) {
    const mainFilter = this.requestFilters.find(
      (filter) => filter.column === this.seletedFilter.column
    );

    if (!mainFilter) return undefined;

    return mainFilter.values.some(
      (value) => value === filterValue || value === filterValue.interval
    )
      ? "active"
      : "";
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

  render() {
    const selectedFilterOptions = getFilterOptions(this.seletedFilter);

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

        {this.seletedFilter !== undefined && (
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
                            this.seletedFilter
                          )
                        }
                        class={`filters-sub-button ${this.showActiveOnSubButton(
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
              Filters{" "}
              {moreFiltersOptionCount > 0 ? `(${moreFiltersOptionCount})` : ""}
              <button
                class="filters-modal-close"
                onClick={() => {
                  this.showMore = false;
                }}
              >
                <NewCloseIcon />
              </button>
            </div>
            <ul class="filters-modal-ul">
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
                      class={`filters-modal-sub-ul ${
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
          </div>
        </div>
      </Host>
    );
  }
}
