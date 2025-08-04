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
import { announceToScreenReader } from "../../a11y";
import { IntervalFilterValueItem } from "../../interfaces/search";

import {
  ResponseDynamicFilterItem,
  DynamicFilterValue,
  RequestDynamicFilterItem,
} from "../../campaign/VPRCampaignService";
import { ChevronIconSmall, NewCloseIcon } from "../vviinn-icons";
import {
  FilterOptions,
  getFilterOptions,
  getIntervalLabel,
  isSubFilterActive,
  RenderFilterButton,
  getSelectedInterval,
} from "./helpers";
import { isPriceFilter } from "../../filters";
import { resources } from "../../locale";

import { SlotSkeleton, slotChangeListener } from "../customized-slots";
import { Histogram } from "../vviinn-range-filter/vviinn-range-filter";
import {
  ChangedFiltersEventData,
  DynamicFilterTrackingData,
  TriggerSourceEvent,
  TriggerSourceEventData,
} from "../../recommendation/events";
import { ClickEvent, isClickedInRectBound } from "../../geometry/Rectangle";
import { triggerFilter, triggerResetFilters } from "./helpers/triggerFilter";
import { SearchStore, useSearchStore } from "../../store/search.store";
import { globalState } from "../../store/store";
import { addEventListenersWithSignal } from "../../dom";
import { ResponseIntervalFilterItem } from "../../interfaces/search";

/**
 * @slot vviinn-extended-filters-title - Text on widget's header.
 * @slot vviinn-extended-filters-apply - Title of Apply Button.
 * @slot vviinn-extended-filters-reset - Title of Reset Button.
 * @slot vviinn-extended-filters-no-filters - Message shown when no filters are available.
 *
 * @part extended-filters-modal - Modal itself.
 * @part extended-filters-modal-wrapper - Wrapper for the modal.
 * @part extended-filters-header - Header of the modal.
 * @part extended-filters-title - Title heading (h2) of the modal.
 * @part extended-filters-modal-close - Close button of the modal.
 * @part extended-filters-no-filters - No filters message container.
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
 * @part filters-option-image - Image of the sub filter.
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

  @Prop() mode: "button" | "preview" | "modal" = "button";
  @Prop() showHeader?: boolean = true;

  /** @internal */
  @Prop() filtersString: string = "";
  /** @internal */
  @Prop() showInWidget: boolean = false;
  /** @internal */
  @Prop() showingInButton: boolean = false;
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
  @Event() vviinnSelectedFiltersReset: EventEmitter<TriggerSourceEventData>;
  /** @internal */
  @Event()
  vviinnExtendedFiltersButtonClicked: EventEmitter<TriggerSourceEventData>;

  private triggerElement?: HTMLElement;
  private state?: SearchStore;
  private eventAbortController?: AbortController;
  private filterAnnouncementRef?: HTMLElement;

  private skipStateChanges = (isTriggeredByVpsWidget: boolean) =>
    this.showInWidget !== isTriggeredByVpsWidget;

  private getFilters = () =>
    this.innerFilters.length ? this.innerFilters : this.state.dynamicFilters;

  private resetOptionsInteractions() {
    this.displayedOptionsCount = new Map();
    this.selectedMoreOptions = [];
  }

  private announceFilterChange(message: string) {
    announceToScreenReader(message, this.filterAnnouncementRef);
  }

  private handleModalKeyDown = (event: KeyboardEvent) => {
    if (event.key === "Escape" && this.showMore) {
      event.preventDefault();
      this.handleCloseModal();
    }
  };

  private handleSelectedFiltersReset = ({ detail }: TriggerSourceEvent) => {
    if (this.skipStateChanges(detail.isTriggeredByVpsWidget)) return;
    this.requestFilters = [];
    this.innerFilters = [];
    this.showMore = false;
    this.resetOptionsInteractions();
  };

  private handleCloseModal = () => {
    this.showMore = false;
    this.resetOptionsInteractions();
    this.announceFilterChange(i18next.t("a11y.filterDialogClosed"));
    this.triggerElement?.focus();
  };

  private replaceSlotsContent() {
    const slots = this.el.querySelectorAll("[slot]");
    this.globalSlotsChanged.emit({
      slots: Array.from(slots),
      element: this.el,
    });
  }

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

    this.handleCloseModal();
  };

  private handleExtendedFiltersButtonClicked = ({
    detail,
  }: TriggerSourceEvent) => {
    const { isTriggeredByVpsWidget, triggerElement } = detail;

    if (!this.skipStateChanges(isTriggeredByVpsWidget)) {
      this.triggerElement = triggerElement;
      this.showMore = true;
    }
  };

  @Watch("showMore")
  showMoreWatcher(modalOpen) {
    this.vviinnFilterTriggered.emit({
      action: modalOpen ? "open" : "close",
      isTriggeredByVpsWidget: this.showInWidget,
    });

    if (modalOpen) {
      this.announceFilterChange(i18next.t("a11y.filterDialogOpened"));
      setTimeout(() => {
        const closeButton = this.el.shadowRoot.querySelector(
          ".filters-modal-close",
        ) as HTMLElement;
        closeButton?.focus();
      }, 0);
    }
  }

  componentDidRender() {
    this.replaceSlotsContent();
  }

  componentWillRender() {
    const filters = this.getFilters();
    if (!filters.length) {
      return;
    }

    const newMap = new Map(this.displayedOptionsCount);
    let hasChanges = false;

    filters.forEach(({ column }) => {
      if (!newMap.has(column)) {
        newMap.set(column, FILTER_OPTIONS_INITIAL_COUNT);
        hasChanges = true;
      }
    });

    if (hasChanges) {
      this.displayedOptionsCount = newMap;
    }
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
        role="dialog"
        aria-labelledby="filters-modal-title"
        onKeyDown={this.handleModalKeyDown}
      >
        <aside
          class="filters-modal-wrapper"
          part="extended-filters-modal-wrapper"
        >
          {this.showHeader && (
            <div class="filters-modal-header" part="extended-filters-header">
              <h2
                id="filters-modal-title"
                class="filters-modal-title"
                part="extended-filters-title"
              >
                <slot name="vviinn-extended-filters-title">
                  {i18next.t("filters.modal.title")}
                </slot>
              </h2>

              <button
                class="filters-modal-close"
                onClick={this.handleCloseModal}
                part="extended-filters-modal-close"
                aria-label={i18next.t("a11y.closeDialog")}
                type="button"
              >
                <NewCloseIcon />
              </button>
            </div>
          )}

          <div class="filters-modal-main" part="extended-filters-main">
            {filters.length === 0 && this.state.searchStatus !== "loading" ? (
              <div
                class="filters-modal-no-filters-message"
                part="extended-filters-no-filters"
              >
                <slot name="vviinn-extended-filters-no-filters">
                  {i18next.t("filters.modal.noFiltersMessage")}
                </slot>
              </div>
            ) : (
              <ul class="filters-modal-list" part="extended-filters-list">
                {(filters ?? []).map((mainFilter) => {
                  const mainColumn = mainFilter.column;
                  const filterOptions = getFilterOptions(mainFilter);
                  const isExpanded = this.selectedMoreOptions.includes(
                    mainFilter.column,
                  );

                  const requestFilter = this.requestFilters.find(
                    ({ column }) => column === mainColumn,
                  );
                  const addedOptions = [];
                  requestFilter?.values?.forEach((value) => {
                    if (mainFilter.type === "interval") {
                      const intervalFilter = filters.find(
                        (filter) => filter.column === mainColumn,
                      ) as ResponseIntervalFilterItem;

                      const intervalLabel = getIntervalLabel(
                        intervalFilter,
                        value,
                        globalState.currencySign,
                      );
                      intervalLabel &&
                        addedOptions.push(<span>{intervalLabel}</span>);
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
                        class={`filters-modal-main-button-wrapper ${isExpanded ? "open" : ""}`}
                        part="extended-filters-row-wrapper"
                      >
                        <button
                          onClick={() =>
                            this.handleMoreOptionsMainClick(mainFilter.column)
                          }
                          class="filters-modal-main-button"
                          part="extended-filters-main-button"
                          aria-expanded={isExpanded ? "true" : "false"}
                          type="button"
                        >
                          <span>{mainFilter.label}</span>
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

                        {mainFilter.type === "interval" && isExpanded ? (
                          <vviinn-range-filter
                            histogram={filterOptions as Histogram}
                            intervalChangeHandler={(filterValue) =>
                              this.intervalFilterChangeHandler(
                                filterValue,
                                mainFilter.column,
                              )
                            }
                            selectedInterval={getSelectedInterval(
                              this.requestFilters,
                              mainFilter.column,
                            )}
                            showCurrency={isPriceFilter(mainFilter.column)}
                          />
                        ) : (
                          <ul
                            class="filters-modal-sub-list"
                            part="extended-filters-sub-list"
                          >
                            {this.renderFilterOptions(
                              mainFilter,
                              filterOptions,
                            )}
                          </ul>
                        )}
                      </div>
                    </li>
                  );
                })}
              </ul>
            )}

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
                    type="button"
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
                  type="button"
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
            const isSelected = isSubFilterActive(
              this.requestFilters,
              value,
              filter,
            );

            return RenderFilterButton({
              handleSubFilterSelection: this.handleSubFilterSelection,
              selectedFilter: filter,
              value,
              label,
              active,
              isSelected,
            });
          })}
        {displayedCount < filterOptions.length && (
          <li role="listitem">
            <button
              onClick={() =>
                this.showMoreOptions(filterColumn, filterOptions.length)
              }
              class="filters-more-modal-button"
              part="filters-option-button"
              type="button"
              aria-label={i18next.t("a11y.showMoreOptions", {
                count: filterOptions.length - displayedCount,
                label: filter.label,
              })}
            >
              <ChevronIconSmall />
            </button>
          </li>
        )}
      </Fragment>
    );
  }

  private handleSubFilterSelection = (
    filterValue: DynamicFilterValue,
    selectedFilter: ResponseDynamicFilterItem,
  ) => {
    this.requestFilters = triggerFilter({
      filterValue,
      selectedFilter,
      requestFilters: this.requestFilters,
      vviinnFilterTriggered: this.vviinnFilterTriggered,
      vviinnFiltersChanged: this.vviinnFiltersChanged,
      el: this.el,
      isTriggeredByVpsWidget: this.showInWidget,
    });
  };

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
    const { state } = useSearchStore(this.showInWidget);
    this.state = state;

    this.eventAbortController = new AbortController();
    const { signal } = this.eventAbortController;

    addEventListenersWithSignal(
      document,
      [
        ["vviinnFiltersChanged", this.handleFiltersChanged],
        ["vviinnSelectedFiltersReset", this.handleSelectedFiltersReset],
        ...(this.mode !== "preview"
          ? [
              [
                "vviinnExtendedFiltersButtonClicked",
                this.handleExtendedFiltersButtonClicked,
              ] as [string, EventListenerOrEventListenerObject],
            ]
          : []),
      ],
      signal,
    );

    this.filtersStringWatcher();
  }

  disconnectedCallback() {
    this.eventAbortController?.abort();
  }

  private intervalFilterChangeHandler = (
    filterValue: IntervalFilterValueItem,
    filterColumn: string,
  ) => {
    const selectedFilter = this.getFilters().find(
      (filter) => filter.column === filterColumn,
    );

    if (selectedFilter) {
      this.handleSubFilterSelection(filterValue as DynamicFilterValue, selectedFilter);
    }
  };

  private getAsideElement(): HTMLElement {
    return this.el.shadowRoot.querySelector("aside");
  }

  private getSidebarRectangle(): DOMRect {
    const asideElement = this.getAsideElement();
    return asideElement.getBoundingClientRect();
  }

  private isKeyboardClick = (event: ClickEvent): boolean =>
    event.clientX === 0 && event.clientY === 0;

  @Listen("click", { target: "body" })
  bodyClickListener(event: ClickEvent) {
    if (
      this.mode === "preview" ||
      !this.showMore ||
      this.isKeyboardClick(event)
    ) {
      return;
    }
    const sidebarRect = this.getSidebarRectangle();
    if (
      !sidebarRect ||
      sidebarRect.width === 0 ||
      sidebarRect.height === 0 ||
      isClickedInRectBound(event, sidebarRect)
    ) {
      return;
    }

    this.handleCloseModal();
  }

  render() {
    const filters = this.getFilters();

    return (
      <Host
        class={{
          "show-in-widget": this.showInWidget,
        }}
      >
        <div
          ref={(el) => (this.filterAnnouncementRef = el)}
          aria-live="polite"
          class="sr-only"
        ></div>

        {SlotSkeleton("filters")}

        {filters?.length > 0 && this.mode === "button" && (
          <vviinn-extended-filters-button />
        )}

        {this.renderModal(filters)}
      </Host>
    );
  }
}
