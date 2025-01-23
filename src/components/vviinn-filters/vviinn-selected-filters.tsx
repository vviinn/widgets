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
  DynamicFilterTrackingData,
  ResetSelectedFiltersEventData,
} from "../../recommendation/events";
import { triggerFilter } from "./helpers/triggerFilter";
import {
  componentsState,
  searchState,
  SearchStore,
} from "../../store/search.store";

/**
 * @part selected-filters-list - List of selected filters.
 
 * @part filters-sub-row - Row of the sub filters.
 * @part filters-option-button - Button of the sub filter.
 * @part filters-option-color-dot - Color Dot of the sub filter.
 * @part filters-option-text - Text of the sub filter.
 * @part filters-option-icon-wrapper - Icon Wrapper of the sub filter.
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

  /** Selected filters should be resetted */
  /** @internal */
  @Event({ bubbles: true })
  vviinnSelectedFiltersReset: EventEmitter<ResetSelectedFiltersEventData>;

  @Event() vviinnFilterTriggered: EventEmitter<DynamicFilterTrackingData>;

  private state?: SearchStore;

  private handleSubFilterSelection(
    filterValue: DynamicFilterValue,
    selectedFilter: ResponseDynamicFilterItem,
  ) {
    this.requestFilters = triggerFilter(
      filterValue,
      selectedFilter,
      this.requestFilters,
      this.vviinnFilterTriggered,
      this.vviinnFiltersChanged,
      this.el,
      this.showInWidget,
    );
  }

  private skipFiltersChanges = (isTriggeredByVpsWidget: boolean) =>
    (isTriggeredByVpsWidget && !this.showInWidget) ||
    (!isTriggeredByVpsWidget && this.showInWidget);

  private handleFiltersChanged = ({
    detail,
  }: CustomEvent<ChangedFiltersEventData>) => {
    const { filters, el: senderElement, isTriggeredByVpsWidget } = detail;

    if (
      senderElement === this.el ||
      this.skipFiltersChanges(isTriggeredByVpsWidget)
    )
      return;

    this.requestFilters = filters;
  };

  private handleSelectedFiltersReset = ({
    detail,
  }: CustomEvent<ResetSelectedFiltersEventData>) => {
    if (this.skipFiltersChanges(detail.isTriggeredByVpsWidget)) return;
    this.requestFilters = [];
  };

  connectedCallback() {
    this.state = this.showInWidget ? searchState : componentsState;

    document.addEventListener(
      "vviinnFiltersChanged",
      this.handleFiltersChanged,
    );
    document.addEventListener(
      "vviinnSelectedFiltersReset",
      this.handleSelectedFiltersReset,
    );
  }

  disconnectedCallback() {
    document.removeEventListener(
      "vviinnFiltersChanged",
      this.handleFiltersChanged,
    );
    document.removeEventListener(
      "vviinnSelectedFiltersReset",
      this.handleSelectedFiltersReset,
    );
  }

  render() {
    const filters = this.state.dynamicFilters;
    if (!filters?.length) return;

    let selectedButtons = [];

    filters.forEach((filter) => {
      if (!("values" in filter)) return;

      (filter.values as FilterOptions).forEach(({ value, label, active }) => {
        if (showActiveOnSubButton(this.requestFilters, value, filter)) {
          selectedButtons.push(
            RenderButton(
              this.handleSubFilterSelection.bind(this),
              value,
              label,
              active,
              filter,
              true,
              true,
            ),
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
