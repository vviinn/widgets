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
  Listen,
  Fragment,
} from "@stencil/core";
import i18next from "i18next";

import {
  ResponseDynamicFilterItem,
  DynamicFilterValue,
  RequestDynamicFilterItem,
} from "../../campaign/VPRCampaignService";
import { ChevronIconSmall, NewCloseIcon } from "../vviinn-icons";
import {
  FilterOptions,
  getFilterOptions,
  getPriceLabel,
  RenderFilterButton,
} from "./helpers";
import { resources } from "../../locale";

import { SlotSkeleton, slotChangeListener } from "../customized-slots";
import { Histogram } from "../vviinn-price-range/vviinn-price-range";
import {
  ChangedFiltersEventData,
  DynamicFilterTrackingData,
  ExtendedFiltersButtonClickedEvent,
  TriggerSourceEventData,
} from "../../recommendation/events";
import { components } from "../../interfaces/generated";
import { ClickEvent, isClickedInRectBound } from "../../geometry/Rectangle";
import { triggerFilter, triggerResetFilters } from "./helpers/triggerFilter";
import {
  componentsState,
  searchState,
  SearchStore,
} from "../../store/search.store";
import { isIntervalFilter } from "../../filters";
import { globalState } from "../../store/store";
import { ResponseDynamicFilterIntervalItem } from "../../interfaces/recommendation";

/**
 * @slot vviinn-extended-filters-title - Text on widget's header.
 * @slot vviinn-extended-filters-apply - Title of Apply Button.
 * @slot vviinn-extended-filters-reset - Title of Reset Button.
 *
 * @part extended-filters-modal - Modal itself.
 * @part extended-filters-modal-wrapper - Wrapper for the modal.
 * @part extended-filters-header - Header of the modal.
 * @part extended-filters-modal-close - Close button of the modal.
 * @part extended-filters-main - Wrapper for the main modal content.
 * @part extended-filters-list - List of filters.
 * @part extended-filters-row - Row of the filters.
 * @part extended-filters-row-wrapper - Wrapper for the row.
 * @part extended-filters-main-button - Main button of the row.
 * @part extended-filters-selected-wrapper - Wrapper for the selected options.
 * @part extended-filters-sub-list - List of sub filters.
 * @part extended-filters-actions - Wrapper for the actions.
 * @part extended-filters-apply - Apply button.
 * @part extended-filters-reset - Reset button.
 *
 * @part filters-sub-row - Row of the sub filters.
 * @part filters-option-button - Button of the sub filter.
 * @part filters-option-color-dot - Color Dot of the sub filter.
 * @part filters-option-text - Text of the sub filter.
 * @part filters-option-icon-wrapper - Icon Wrapper of the sub filter.
 *
 * @part histogram - Wrapper itself.
 * @part histogram-bar - Bar of the histogram.
 * @part histogram-range-container - Container for the range sliders.
 * @part histogram-sliders-control - Container for the range sliders control.
 * @part histogram-from-slider - Slider for the minimum value.
 * @part histogram-to-slider - Slider for the maximum value.
 * @part histogram-label-wrapper - Wrapper for the labels.
 * @part histogram-label - Label for the histogram.
 */

const FILTER_OPTIONS_INITIAL_COUNT = 8;
const FILTER_OPTIONS_STEP_COUNT = 5;
@Component({
  tag: "vviinn-extended-filters",
  styleUrl: "vviinn-filters.css",
  shadow: true,
})
export class VviinnExtendedFilters {
  @Element() el: HTMLElement;

  @Prop({ mutable: true }) filters: ResponseDynamicFilterItem[] = [];
  @Prop() mode: "button" | "preview" | "modal" = "button";
  @Prop() showHeader?: boolean = true;

  /** @internal */
  @Prop() filtersString: string = "";
  /** @internal */
  @Prop() showInWidget: boolean = false;
  /** @internal */
  @Prop() widgetElement?: HTMLVviinnVpsWidgetElement;

  @State() innerFilters: ResponseDynamicFilterItem[] = [];
  @State() requestFilters: RequestDynamicFilterItem[] = [];
  @State() showMore: boolean = false;
  @State() selectedMoreOptions: string[] = [];
  @State() displayedOptionsCount: Map<string, number> = new Map();

  /** The filter's state changes */
  @Event({ bubbles: true })
  vviinnFiltersChanged: EventEmitter<ChangedFiltersEventData>;

  @Event() vviinnFilterTriggered: EventEmitter<DynamicFilterTrackingData>;

  /** @internal */
  @Event({ bubbles: true, composed: true })
  globalSlotsChanged: EventEmitter<any>;

  /** Selected filters should be resetted */
  /** @internal */
  @Event({ bubbles: true })
  vviinnSelectedFiltersReset: EventEmitter<TriggerSourceEventData>;

  /** @internal */
  @Event({ bubbles: true })
  vviinnExtendedFiltersButtonClicked: EventEmitter<TriggerSourceEventData>;

  private state?: SearchStore;

  private getFilters = () =>
    this.innerFilters.length ? this.innerFilters : this.state.dynamicFilters;

  private resetOptionsInteractions() {
    this.displayedOptionsCount = new Map();
    this.selectedMoreOptions = [];
  }

  private resetFiltersState() {
    this.resetOptionsInteractions();
    this.requestFilters = [];
  }

  private skipStateChanges = (isTriggeredByVpsWidget: boolean) =>
    (isTriggeredByVpsWidget && !this.showInWidget) ||
    (!isTriggeredByVpsWidget && this.showInWidget);

  private replaceSlotsContent() {
    const slots = this.el.querySelectorAll("[slot]");
    this.globalSlotsChanged.emit({
      slots: Array.from(slots),
      element: this.el,
    });
  }

  private getSelectedPriceInterval = () =>
    (this.requestFilters.find(({ column }) => isIntervalFilter(column))
      ?.values[0] ?? {}) as components["schemas"]["interval"];

  private handleSelectedFiltersReset = ({
    detail,
  }: CustomEvent<TriggerSourceEventData>) => {
    if (this.skipStateChanges(detail.isTriggeredByVpsWidget)) return;
    this.resetFiltersState();
  };

  private handleCloseModal = () => {
    this.showMore = false;
    this.resetOptionsInteractions();
  };

  private resetModal = () => {
    triggerResetFilters({
      vviinnFilterTriggered: this.vviinnFilterTriggered,
      vviinnFiltersChanged: this.vviinnFiltersChanged,
      el: this.el,
      isTriggeredByVpsWidget: this.showInWidget,
    });
    this.vviinnSelectedFiltersReset.emit({
      isTriggeredByVpsWidget: this.showInWidget,
    });

    this.resetFiltersState();
    this.showMore = false;
  };

  private handleExtendedFiltersButtonClicked = ({
    detail,
  }: ExtendedFiltersButtonClickedEvent) => {
    const { isTriggeredByVpsWidget } = detail;

    if (!this.skipStateChanges(isTriggeredByVpsWidget)) {
      this.showMore = true;
    }
  };

  @Watch("showMore")
  showMoreWatcher(modalOpen) {
    this.vviinnFilterTriggered.emit({
      action: modalOpen ? "open" : "close",
      isTriggeredByVpsWidget: this.showInWidget,
    });
  }

  componentDidRender() {
    this.replaceSlotsContent();
  }

  async componentWillLoad() {
    await i18next.init({
      lng: globalState.locale,
      fallbackLng: "en",
      resources,
    });

    slotChangeListener(this, this.el);
  }

  private initializeDisplayedOptions(filterColumn: string) {
    if (!this.displayedOptionsCount.has(filterColumn)) {
      this.displayedOptionsCount.set(
        filterColumn,
        FILTER_OPTIONS_INITIAL_COUNT,
      );
    }
  }

  private showMoreOptions(filterColumn: string, totalOptions: number) {
    const currentCount =
      this.displayedOptionsCount.get(filterColumn) ||
      FILTER_OPTIONS_INITIAL_COUNT;
    const newCount = Math.min(
      currentCount + FILTER_OPTIONS_STEP_COUNT,
      totalOptions,
    );
    this.displayedOptionsCount = new Map(this.displayedOptionsCount);
    this.displayedOptionsCount.set(filterColumn, newCount);
  }

  private renderModal(filters: ResponseDynamicFilterItem[]) {
    return (
      <div
        class={`filters-modal ${this.mode} ${this.showMore ? "open" : ""}`}
        part="extended-filters-modal"
      >
        <aside
          class="filters-modal-wrapper"
          part="extended-filters-modal-wrapper"
        >
          {this.showHeader && (
            <div class="filters-modal-header" part="extended-filters-header">
              <slot name="vviinn-extended-filters-title">
                <span>{i18next.t("filters.modal.title")}</span>
              </slot>

              <button
                class="filters-modal-close"
                onClick={this.handleCloseModal}
                part="extended-filters-modal-close"
              >
                <NewCloseIcon />
              </button>
            </div>
          )}
          <div class="filters-modal-main" part="extended-filters-main">
            <ul class="filters-modal-list" part="extended-filters-list">
              {(filters ?? []).map((mainFilter) => {
                const mainColumn = mainFilter.column;
                const filterOptions = getFilterOptions(mainFilter);

                const requestFilter = this.requestFilters.find(
                  ({ column }) => column === mainColumn,
                );
                const addedOptions = [];
                requestFilter?.values?.forEach((value) => {
                  if (isIntervalFilter(mainColumn)) {
                    const intervalFilter = filters.find(
                      (filter) => filter.column === mainColumn,
                    ) as ResponseDynamicFilterIntervalItem;

                    const priceLabel = getPriceLabel(
                      intervalFilter,
                      value,
                      globalState.currencySign,
                    );
                    priceLabel && addedOptions.push(<span>{priceLabel}</span>);
                  } else {
                    const index = filterOptions.findIndex(
                      (f) => (f.value.value ?? f.value) === value,
                    );

                    if (index > -1) {
                      addedOptions.push(
                        <span>{filterOptions[index].label}</span>,
                      );
                    }
                  }
                });

                return (
                  <li part="extended-filters-row">
                    <div
                      class={`filters-modal-main-button-wrapper ${
                        this.selectedMoreOptions.includes(mainFilter.column)
                          ? "open"
                          : ""
                      }`}
                      part="extended-filters-row-wrapper"
                    >
                      <button
                        onClick={() =>
                          this.handleMoreOptionsMainClick(mainFilter.column)
                        }
                        class="filters-modal-main-button"
                        part="extended-filters-main-button"
                      >
                        {mainFilter.label}
                        {addedOptions.length > 0 && (
                          <div
                            class="filters-modal-main-button-added-options"
                            part="extended-filters-selected-wrapper"
                          >
                            {addedOptions}
                          </div>
                        )}
                        <ChevronIconSmall />
                      </button>

                      {isIntervalFilter(mainColumn) &&
                      this.selectedMoreOptions.includes(mainFilter.column) ? (
                        <vviinn-price-range
                          histogram={(filterOptions as Histogram).filter(
                            (item) => item.value.frequency > 0,
                          )}
                          priceChangeHandler={this.priceChangeHandler}
                          selectedInterval={this.getSelectedPriceInterval()}
                        />
                      ) : (
                        <ul
                          class="filters-modal-sub-list"
                          part="extended-filters-sub-list"
                        >
                          {this.renderFilterOptions(mainFilter, filterOptions)}
                        </ul>
                      )}
                    </div>
                  </li>
                );
              })}
            </ul>

            {filters?.length > 0 && (
              <div
                class="filters-modal-actions"
                part="extended-filters-actions"
              >
                {this.mode === "button" && (
                  <button
                    class="filters-modal-apply"
                    onClick={() => (this.showMore = false)}
                    disabled={this.requestFilters.length === 0}
                    part="extended-filters-apply"
                  >
                    <slot name="vviinn-extended-filters-apply">
                      {i18next.t("filters.modal.apply")}
                    </slot>
                  </button>
                )}

                <button
                  class="filters-modal-reset"
                  onClick={this.resetModal}
                  part="extended-filters-reset"
                >
                  <slot name="vviinn-extended-filters-reset">
                    {i18next.t("filters.modal.resetFilters")}
                  </slot>
                </button>
              </div>
            )}
          </div>
        </aside>
      </div>
    );
  }

  private renderFilterOptions(
    filter: ResponseDynamicFilterItem,
    filterOptions: FilterOptions,
  ) {
    const { column: filterColumn } = filter;
    this.initializeDisplayedOptions(filterColumn);

    const displayedCount =
      this.displayedOptionsCount.get(filterColumn) ||
      FILTER_OPTIONS_INITIAL_COUNT;

    return (
      <Fragment>
        {filterOptions
          .slice(0, displayedCount)
          .map(({ value, label, active }) => {
            const isSelected = this.showActiveOnModalSubButton(
              this.requestFilters,
              value,
            );

            return RenderFilterButton({
              handleSubFilterSelection:
                this.handleSubFilterSelection.bind(this),
              selectedFilter: filter,
              value,
              label,
              active,
              isSelected,
            });
          })}
        {displayedCount < filterOptions.length && (
          <button
            onClick={() =>
              this.showMoreOptions(filterColumn, filterOptions.length)
            }
            class="filters-more-modal-button"
            part="filters-option-button"
          >
            <ChevronIconSmall />
          </button>
        )}
      </Fragment>
    );
  }

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

  private showActiveOnModalSubButton(
    requestFilters: RequestDynamicFilterItem[],
    filterValue: DynamicFilterValue,
  ) {
    let active = false;
    requestFilters.forEach((filter) => {
      if (
        filter.values.some(
          (value) =>
            value === filterValue ||
            value === filterValue.interval ||
            value === filterValue.value,
        )
      ) {
        active = true;
      }
    });
    return active;
  }

  private handleMoreOptionsMainClick(column: string) {
    const optionsVisible = this.selectedMoreOptions.includes(column);

    if (optionsVisible) {
      this.selectedMoreOptions = this.selectedMoreOptions.filter(
        (option) => option !== column,
      );
      this.displayedOptionsCount.delete(column);
    } else {
      this.vviinnFilterTriggered.emit({
        action: "show",
        kind: column,
        isTriggeredByVpsWidget: this.showInWidget,
      });
      this.selectedMoreOptions = [...this.selectedMoreOptions, column];
    }
  }

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
    this.state = this.showInWidget ? searchState : componentsState;

    document.addEventListener(
      "vviinnFiltersChanged",
      this.handleFiltersChanged,
    );
    document.addEventListener(
      "vviinnSelectedFiltersReset",
      this.handleSelectedFiltersReset,
    );

    this.mode !== "preview" &&
      document.addEventListener(
        "vviinnExtendedFiltersButtonClicked",
        this.handleExtendedFiltersButtonClicked,
      );

    this.filtersStringWatcher();
  }

  disconnectedCallback() {
    document.addEventListener(
      "vviinnFiltersChanged",
      this.handleFiltersChanged,
    );
    document.addEventListener(
      "vviinnSelectedFiltersReset",
      this.handleSelectedFiltersReset,
    );
    this.mode !== "preview" &&
      document.removeEventListener(
        "vviinnExtendedFiltersButtonClicked",
        this.handleExtendedFiltersButtonClicked,
      );
  }

  private priceChangeHandler = (filterValue: DynamicFilterValue) => {
    const selectedFilter = this.getFilters().find((filter) =>
      isIntervalFilter(filter.column),
    );

    if (selectedFilter) {
      this.handleSubFilterSelection(filterValue, selectedFilter);
    }
  };

  private getAsideElement(): HTMLElement {
    return this.el.shadowRoot.querySelector("aside");
  }

  private getSidebarRectangle(): DOMRect {
    return this.getAsideElement()?.getBoundingClientRect();
  }

  @Listen("click", { target: "body" })
  bodyClickListener(event: ClickEvent) {
    if (this.mode !== "button") return;

    const sidebarRect = this.getSidebarRectangle();

    if (!sidebarRect || sidebarRect.width === 0 || sidebarRect.height === 0) {
      return;
    }

    if (!isClickedInRectBound(event, sidebarRect)) {
      this.showMore = false;
    }
  }

  render() {
    const filters = this.getFilters();

    return (
      <Host
        class={{
          "show-in-widget": this.showInWidget,
        }}
      >
        {SlotSkeleton("filters")}

        {filters?.length > 0 && this.mode === "button" && (
          <vviinn-extended-filters-button />
        )}

        {this.renderModal(filters)}
      </Host>
    );
  }
}
