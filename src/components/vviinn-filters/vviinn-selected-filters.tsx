import {
  Component,
  Host,
  h,
  State,
  Event,
  EventEmitter,
  Element,
  Prop,
  JSX,
} from "@stencil/core";
import {
  ResponseDynamicFilterItem,
  DynamicFilterValue,
  RequestDynamicFilterItem,
} from "../../campaign/VPRCampaignService";
import {
  FilterOptions,
  RenderCustomButton,
  RenderFilterButton,
  showActiveOnSubButton,
} from "./helpers";
import {
  ChangedFiltersEventData,
  DynamicFilterInternalData,
  ResetSelectedFiltersEventData,
  SearchIdEvent,
} from "../../recommendation/events";
import { triggerFilter, triggerResetFilters } from "./helpers/triggerFilter";
import {
  componentsState,
  resetStore,
  searchState,
  SearchStore,
  SearchStoreName,
} from "../../store/search.store";
import { globalState } from "../../store/store";
import { ResponseDynamicFilterIntervalItem } from "../../interfaces/recommendation";
import { isIntervalFilter } from "../../filters";

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

  @State() requestFilters: RequestDynamicFilterItem[] = [];
  @State() selectedFilterButtons: JSX.Element[] = [];
  @State() textSearchCustomFilter: string | null = null;
  @State() priceCustomFilter: string | null = null;

  /** The filter's state changes */
  @Event({ bubbles: true })
  vviinnFiltersChanged: EventEmitter<ChangedFiltersEventData>;

  /** Selected filters should be resetted */
  /** @internal */
  @Event({ bubbles: true })
  vviinnSelectedFiltersReset: EventEmitter<ResetSelectedFiltersEventData>;

  @Event() vviinnFilterTriggered: EventEmitter<DynamicFilterInternalData>;

  private state?: SearchStore;
  private storeName?: SearchStoreName;

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

  private getPriceFilter = () =>
    this.state.dynamicFilters.find((filter) =>
      isIntervalFilter(filter.column),
    ) as ResponseDynamicFilterIntervalItem;

  private skipStateChanges = (isTriggeredByVpsWidget: boolean) =>
    (isTriggeredByVpsWidget && !this.showInWidget) ||
    (!isTriggeredByVpsWidget && this.showInWidget);

  private handleFilterTriggered = ({
    detail,
  }: CustomEvent<DynamicFilterInternalData>) => {
    if (this.skipStateChanges(detail.isTriggeredByVpsWidget)) return;

    if (detail.customTrigger === "TPS") {
      this.textSearchCustomFilter = detail.kind;
    }

    if (isIntervalFilter(detail.kind) && detail.action === "select") {
      const priceFilter = this.getPriceFilter();

      const { start: rangeStart, end: rangeEnd } = priceFilter.full;
      const { start, end } = detail.value.interval;

      if (start !== rangeStart || end !== rangeEnd) {
        this.priceCustomFilter = `${start} ${globalState.currencySign} – ${end} ${globalState.currencySign}`;
      } else {
        this.priceCustomFilter = null;
      }
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
  };

  private handleSelectedFiltersReset = ({
    detail,
  }: CustomEvent<ResetSelectedFiltersEventData>) => {
    if (this.skipStateChanges(detail.isTriggeredByVpsWidget)) return;
    this.requestFilters = [];
  };

  private resetState = () => {
    this.vviinnFilterTriggered.emit({
      kind: "",
      action: "deselect",
      customTrigger: "TPS",
      isTriggeredByVpsWidget: this.showInWidget,
    });

    this.textSearchCustomFilter = null;
    this.priceCustomFilter = null;

    triggerResetFilters({
      vviinnFilterTriggered: this.vviinnFilterTriggered,
      isTriggeredByVpsWidget: this.showInWidget,
      el: this.el,
    });

    this.vviinnSelectedFiltersReset.emit({
      isTriggeredByVpsWidget: this.showInWidget,
    });

    resetStore(this.storeName);
  };

  private imageUploadStartedHandler = ({ detail }: SearchIdEvent) => {
    if (this.skipStateChanges(detail.isTriggeredByVpsWidget)) return;
    this.resetState();
  };

  private handlePriceButtonClick = () => {
    this.priceCustomFilter = null;

    const priceFilter = this.getPriceFilter();
    this.handleSubFilterSelection(
      priceFilter.full as DynamicFilterValue,
      priceFilter,
    );
  };

  connectedCallback() {
    this.state = this.showInWidget ? searchState : componentsState;
    this.storeName = this.showInWidget ? "widget" : "components";

    document.addEventListener(
      "vviinnFiltersChanged",
      this.handleFiltersChanged,
    );
    document.addEventListener(
      "vviinnFilterTriggered",
      this.handleFilterTriggered,
    );
    document.addEventListener(
      "vviinnSelectedFiltersReset",
      this.handleSelectedFiltersReset,
    );
    document.addEventListener(
      "vviinnImageUploadStarted",
      this.imageUploadStartedHandler,
    );
  }

  disconnectedCallback() {
    document.removeEventListener(
      "vviinnFiltersChanged",
      this.handleFiltersChanged,
    );
    document.removeEventListener(
      "vviinnFilterTriggered",
      this.handleFilterTriggered,
    );
    document.removeEventListener(
      "vviinnSelectedFiltersReset",
      this.handleSelectedFiltersReset,
    );
    document.removeEventListener(
      "vviinnImageUploadStarted",
      this.imageUploadStartedHandler,
    );
  }

  componentWillRender() {
    this.selectedFilterButtons = [];
    const filters = this.state?.dynamicFilters || [];

    filters.forEach((filter) => {
      if (!("values" in filter)) return;
      (filter.values as FilterOptions).forEach(({ value, label, active }) => {
        if (showActiveOnSubButton(this.requestFilters, value, filter)) {
          this.selectedFilterButtons.push(
            RenderFilterButton({
              handleSubFilterSelection:
                this.handleSubFilterSelection.bind(this),
              selectedFilter: filter,
              value,
              label,
              active,
              isSelected: true,
              showClose: true,
            }),
          );
        }
      });
    });
  }

  render() {
    return (
      <Host
        class={{
          "show-in-widget": this.showInWidget,
        }}
      >
        {(this.selectedFilterButtons.length > 0 ||
          this.textSearchCustomFilter ||
          this.priceCustomFilter) && (
          <ul class="selected-filters-wrapper" part="selected-filters-list">
            {this.textSearchCustomFilter &&
              RenderCustomButton({
                label: this.textSearchCustomFilter,
                buttonType: "text",
                onClick: this.resetState.bind(this),
              })}

            {this.priceCustomFilter &&
              RenderCustomButton({
                label: this.priceCustomFilter,
                buttonType: "price",
                onClick: this.handlePriceButtonClick.bind(this),
              })}

            {this.selectedFilterButtons}
          </ul>
        )}
      </Host>
    );
  }
}
