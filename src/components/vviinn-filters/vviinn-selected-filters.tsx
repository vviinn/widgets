import {
  Component,
  Host,
  h,
  State,
  Event,
  EventEmitter,
  Element,
  Prop,
} from "@stencil/core";
import {
  DynamicFilters,
  DynamicFilter,
  DynamicFilterValue,
  RequestDynamicFilters,
} from "../../campaign/VPRCampaignService";
import {
  GetFilterOptions,
  RenderButton,
  showActiveOnSubButton,
} from "./helpers";
import {
  ChangedFiltersEventData,
  DynamicFiltersEvent,
  DynamicFiltersEventData,
  DynamicFilterTrackingData,
} from "../../recommendation/events";
import { triggerFilter } from "./helpers/triggerFilter";

/**
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

  /** @internal */
  @Prop() showInWidget: boolean = false;

  @State() filters: DynamicFilters = [];
  @State() requestFilters: RequestDynamicFilters = [];

  /** The filter's state changes */
  @Event({ bubbles: true })
  vviinnFiltersChanged: EventEmitter<ChangedFiltersEventData>;
  /** The filters received */
  @Event({ bubbles: true })
  vviinnFilters: EventEmitter<DynamicFiltersEventData>;

  @Event() vviinnFilterTriggered: EventEmitter<DynamicFilterTrackingData>;

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

  private handleSetFilters = ({ detail }: DynamicFiltersEvent) => {
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
    if (!this.filters?.length) return;
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
      <Host
        class={{
          "show-in-widget": this.showInWidget,
        }}
      >
        {selectedButtons.length > 0 && (
          <ul class="selected-filters-wrapper" part="selected-filters-list">
            {selectedButtons}
          </ul>
        )}
      </Host>
    );
  }
}
