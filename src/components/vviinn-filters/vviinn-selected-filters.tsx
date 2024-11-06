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
  ResponseDynamicFilterItem,
  DynamicFilterValue,
  RequestDynamicFilterItem,
} from "../../campaign/VPRCampaignService";
import { FilterOptions, RenderButton, showActiveOnSubButton } from "./helpers";
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

  @State() filters: ResponseDynamicFilterItem[] = [];
  @State() requestFilters: RequestDynamicFilterItem[] = [];

  /** The filter's state changes */
  @Event({ bubbles: true })
  vviinnFiltersChanged: EventEmitter<ChangedFiltersEventData>;
  /** The filters received */
  @Event({ bubbles: true })
  vviinnFiltersReceived: EventEmitter<DynamicFiltersEventData>;

  /** Selected filters should be resetted */
  /** @internal */
  @Event({ bubbles: true })
  vviinnSelectedFiltersReset: EventEmitter;

  @Event() vviinnFilterTriggered: EventEmitter<DynamicFilterTrackingData>;

  private handleSubFilterSelection(
    filterValue: DynamicFilterValue,
    selectedFilter: ResponseDynamicFilterItem
  ) {
    this.requestFilters = triggerFilter(
      filterValue,
      selectedFilter,
      this.requestFilters,
      this.vviinnFilterTriggered,
      this.vviinnFiltersChanged,
      this.el,
      this.showInWidget
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

  private handleSelectedFiltersReset = () => {
    this.requestFilters = [];
  };

  connectedCallback() {
    document.addEventListener("vviinnFiltersReceived", this.handleSetFilters);
    document.addEventListener(
      "vviinnFiltersChanged",
      this.handleFiltersChanged
    );

    document.addEventListener(
      "vviinnSelectedFiltersReset",
      this.handleSelectedFiltersReset
    );
  }

  disconnectedCallback() {
    document.removeEventListener(
      "vviinnFiltersReceived",
      this.handleSetFilters
    );
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
    let selectedButtons = [];
    if (!this.filters?.length) return;
    this.filters.forEach((filter) => {
      if (!("values" in filter)) return;

      (filter.values as FilterOptions).forEach(({ value, label, active }) => {
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
      });
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
