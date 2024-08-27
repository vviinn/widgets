import {
  Component,
  Host,
  h,
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
import {
  subFilterSelection,
  GetFilterOptions,
  RenderButton,
  showActiveOnSubButton,
  emitRequestFiltersMore,
} from "./helpers";
import {
  ChangedFiltersEventData,
  DynamicFiltersEventData,
} from "../../recommendation/events";

/**
 * @part selected-filters - Wrapper itself.
 * @part selected-filters-list - List of selected filters.

 * @part filters-sub-button - Sub filter button.
 */

@Component({
  tag: "vviinn-selected-filters",
  styleUrl: "vviinn-filters.css",
  shadow: true,
})
export class VviinnSelectedFilters {
  @Element() el: HTMLElement;

  @State() filters: DynamicFilters = [];
  @State() requestFilters: RequestDynamicFilters = [];

  /** The filter's state changes */
  @Event({ bubbles: true })
  vviinnFiltersChanged: EventEmitter<ChangedFiltersEventData>;
  /** The filters received */
  @Event({ bubbles: true })
  vviinnFilters: EventEmitter<DynamicFiltersEventData>;

  private handleSubFilterSelection(
    filterValue: DynamicFilterValue,
    seletedFilter: DynamicFilter
  ) {
    this.requestFilters = subFilterSelection(
      this.requestFilters,
      seletedFilter,
      filterValue
    );

    emitRequestFiltersMore(
      [...this.requestFilters],
      this.el,
      this.vviinnFiltersChanged
    );
  }

  private handleSetFilters = ({
    detail,
  }: CustomEvent<DynamicFiltersEventData>) => {
    this.filters = detail;
  };

  private handleFiltersChanged = ({
    detail,
  }: CustomEvent<ChangedFiltersEventData>) => {
    const { filters, el: senderElement } = detail;

    if (senderElement === this.el) return;

    this.requestFilters = filters;
  };

  connectedCallback() {
    document.addEventListener("vviinnFilters", this.handleSetFilters);
    document.addEventListener(
      "vviinnFiltersChanged",
      this.handleFiltersChanged
    );
  }

  disconnectedCallback() {
    document.removeEventListener("vviinnFilters", this.handleSetFilters);
    document.removeEventListener(
      "vviinnFiltersChanged",
      this.handleFiltersChanged
    );
  }

  render() {
    let selectedButtons = [];
    this.filters.forEach((filter) => {
      if (!("values" in filter)) return;

      (filter.values as GetFilterOptions).forEach(
        ({ value, label, active }) => {
          if (
            showActiveOnSubButton(this.requestFilters, value, filter) &&
            active
          ) {
            selectedButtons.push(
              RenderButton(
                this.handleSubFilterSelection.bind(this),
                value,
                label,
                active,
                filter,
                true,
                true
              )
            );
          }
        }
      );
    });

    return (
      <Host>
        {selectedButtons.length > 0 && (
          <ul class="selected-filters-wrapper" part="selected-filters-list">
            {selectedButtons}
          </ul>
        )}
      </Host>
    );
  }
}
