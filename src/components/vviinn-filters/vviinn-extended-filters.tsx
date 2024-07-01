import {
  Component,
  Host,
  h,
  Prop,
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

import { getFilterOptions, subFilterSelection } from "./helpers";
/**
 * * @part filters - Wrapper itself.
 */
@Component({
  tag: "vviinn-extended-filters",
  styleUrl: "vviinn-filters.css",
  shadow: true,
})
export class VviinnExtendedFilters {
  @Prop() filters: DynamicFilters = [];

  @State() requestFilters: RequestDynamicFilters = [];
  @State() showMore: boolean = false;
  @State() selectedMoreOptions: string[] = [];

  /** Event fires when user click on Add to Basket button */
  @Event({ bubbles: true })
  vviinnFiltersChanged: EventEmitter<RequestDynamicFilters>;

  private emitTequestFiltersMore(requestFilters: RequestDynamicFilters) {
    this.vviinnFiltersChanged.emit(requestFilters);
    this.showMore = false;
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
    });
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
    let moreFiltersOptionCount = 0;
    this.filters.forEach((filter) => {
      moreFiltersOptionCount += getFilterOptions(filter).length;
    });

    return (
      <Host part="filters">
        {this.filters.length > 0 && (
          <button
            class="filters-more-button"
            onClick={() => (this.showMore = true)}
          >
            <FiltersIcon />
          </button>
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
                  this.requestFilters = [];
                }}
              >
                <NewCloseIcon />
              </button>
            </div>

            <ul class="filters-modal-ul">
              {this.filters.map((mainFilter) => {
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
                                    mainFilter
                                  )
                                }
                                class={`filters-more-modal-button ${this.showActiveOnModalSubButton(
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
                  </li>
                );
              })}
            </ul>

            <div class="filters-modal-actions">
              <button
                class="filters-modal-apply"
                onClick={() => this.filtersModalApply()}
                disabled={this.requestFilters.length === 0}
              >
                Apply
              </button>

              <button
                class="filters-modal-reset"
                onClick={() => (this.requestFilters = [])}
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
