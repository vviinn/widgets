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
import { ChevronIconSmall, FiltersIcon, NewCloseIcon } from "../vviinn-icons";
import { FilterOptions, getFilterOptions, RenderButton } from "./helpers";
import { Locale, resources } from "../../locale";

import { SlotSkeleton, slotChangeListener } from "../customized-slots";
import { Histogram } from "../vviinn-price-range/vviinn-price-range";
import {
  ChangedFiltersEventData,
  DynamicFiltersEvent,
  DynamicFiltersEventData,
  DynamicFilterTrackingData,
  ResetSelectedFiltersEventData,
} from "../../recommendation/events";
import { components } from "../../interfaces/generated";
import { ClickEvent, isClickedInRectBound } from "../../geometry/Rectangle";
import { triggerFilter, triggerResetFilters } from "./helpers/triggerFilter";

/**
 * @slot vviinn-extended-filters-title - Text on widget's header.
 * @slot vviinn-extended-filters-apply - Title of Apply Button.
 * @slot vviinn-extended-filters-reset - Title of Reset Button.
 *
 * @part extended-filters-button - Button to open the modal.
 * @part extended-filters-modal - Modal itself.
 * @part extended-filters-modal-wrapper - Wrapper for the modal.
 * @part extended-filters-header - Header of the modal.
 * @part extended-filters-modal-close - Close button of the modal.
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

const FILTER_OPTIONS_INITIAL_COUNT = 5;
@Component({
  tag: "vviinn-extended-filters",
  styleUrl: "vviinn-filters.css",
  shadow: true,
})
export class VviinnExtendedFilters {
  @Element() el: HTMLElement;

  @Prop({ mutable: true }) filters: ResponseDynamicFilterItem[] = [];
  /** The locale for currency formatting and text localization */
  @Prop() locale: Locale = "de-DE";
  @Prop() mode: "button" | "preview" = "button";
  /** The currency sign is displayed after the price */
  @Prop() currencySign?: string = "€";
  /** The currency sign is displayed after the price */
  @Prop() showHeader?: boolean = true;

  /** @internal */
  @Prop() filtersString: string = "";
  /** @internal */
  @Prop() showInWidget: boolean = false;

  @State() innerFilters: ResponseDynamicFilterItem[] = [];
  @State() requestFilters: RequestDynamicFilterItem[] = [];
  @State() showMore: boolean = false;
  @State() selectedMoreOptions: string[] = [];
  @State() displayedOptionsCount: Map<string, number> = new Map();

  /** The filter's state changes */
  @Event({ bubbles: true })
  vviinnFiltersChanged: EventEmitter<ChangedFiltersEventData>;
  /** The filters received */
  @Event({ bubbles: true })
  vviinnFiltersReceived: EventEmitter<DynamicFiltersEventData>;

  /** @internal */
  @Event({ bubbles: true, composed: true })
  globalSlotsChanged: EventEmitter<any>;

  /** Selected filters should be resetted */
  /** @internal */
  @Event({ bubbles: true })
  vviinnSelectedFiltersReset: EventEmitter<ResetSelectedFiltersEventData>;

  @Event() vviinnFilterTriggered: EventEmitter<DynamicFilterTrackingData>;

  private replaceSlotsContent() {
    const slots = this.el.querySelectorAll("[slot]");
    this.globalSlotsChanged.emit({
      slots: Array.from(slots),
      element: this.el,
    });
  }

  private getFilters = () =>
    this.showInWidget ? this.filters : this.innerFilters;

  private getSelectedPriceInterval = () =>
    (this.requestFilters.find(({ column }) => column === "price")?.values[0] ??
      {}) as components["schemas"]["interval"];

  private handleSelectedFiltersReset = ({
    detail,
  }: CustomEvent<ResetSelectedFiltersEventData>) => {
    if (this.skipFiltersChanges(detail.isTriggeredByVpsWidget)) return;
    this.requestFilters = [];
    this.selectedMoreOptions = [];
  };

  private skipFiltersChanges = (isTriggeredByVpsWidget: boolean) =>
    (isTriggeredByVpsWidget && !this.showInWidget) ||
    (!isTriggeredByVpsWidget && this.showInWidget);

  componentDidRender() {
    this.replaceSlotsContent();
  }

  async componentWillLoad() {
    await i18next.init({
      lng: this.locale,
      fallbackLng: "en",
      resources,
    });

    slotChangeListener(this, this.el);
  }

  private initializeDisplayedOptions(filterColumn: string) {
    if (!this.displayedOptionsCount.has(filterColumn)) {
      this.displayedOptionsCount.set(
        filterColumn,
        FILTER_OPTIONS_INITIAL_COUNT
      );
    }
  }

  private showMoreOptions(filterColumn: string, totalOptions: number) {
    const currentCount =
      this.displayedOptionsCount.get(filterColumn) ||
      FILTER_OPTIONS_INITIAL_COUNT;
    const newCount = Math.min(
      currentCount + FILTER_OPTIONS_INITIAL_COUNT,
      totalOptions
    );
    this.displayedOptionsCount = new Map(this.displayedOptionsCount);
    this.displayedOptionsCount.set(filterColumn, newCount);
  }

  private renderFilterOptions(
    filter: ResponseDynamicFilterItem,
    filterOptions: FilterOptions
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
            const selected = this.showActiveOnModalSubButton(
              this.requestFilters,
              value
            );

            return RenderButton(
              this.handleSubFilterSelection.bind(this),
              value,
              label,
              active,
              filter,
              selected
            );
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

  private showActiveOnModalSubButton(
    requestFilters: RequestDynamicFilterItem[],
    filterValue: DynamicFilterValue
  ) {
    let className = false;
    requestFilters.forEach((filter) => {
      if (
        filter.values.some(
          (value) =>
            value === filterValue ||
            value === filterValue.interval ||
            value === filterValue.value
        )
      ) {
        className = true;
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

  private handleSetFilters = ({ detail }: DynamicFiltersEvent) => {
    if (this.showInWidget) return;
    this.innerFilters = detail;
  };

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

  @Watch("filtersString")
  filtersStringWatcher() {
    if (this.filtersString === "") return;

    try {
      this.innerFilters = JSON.parse(
        this.filtersString
      ) as ResponseDynamicFilterItem[];
    } catch (e) {
      console.error("Invalid filters string", e);
    }
  }

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

    this.filtersStringWatcher();
  }

  disconnectedCallback() {
    document.removeEventListener(
      "vviinnFiltersReceived",
      this.handleSetFilters
    );
    document.addEventListener(
      "vviinnFiltersChanged",
      this.handleFiltersChanged
    );
    document.addEventListener(
      "vviinnSelectedFiltersReset",
      this.handleSelectedFiltersReset
    );
  }

  private resetModal() {
    triggerResetFilters(this.vviinnFiltersChanged, this.el, this.showInWidget);

    this.selectedMoreOptions = [];
    this.requestFilters = [];
    this.showMore = false;
  }

  private priceChangeHandler = (filterValue: DynamicFilterValue) => {
    const selectedFilter = this.getFilters().find(
      (filter) => filter.column === "price"
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
      <Host>
        {SlotSkeleton("filters")}

        {filters?.length > 0 && this.mode === "button" && (
          <button
            class="filters-more-button"
            onClick={() => (this.showMore = true)}
            part="extended-filters-button"
          >
            <FiltersIcon />
          </button>
        )}

        <div
          class={`filters-modal filters-modal-${this.mode} ${
            this.showMore ? "open" : ""
          }`}
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
                  onClick={() => {
                    this.showMore = false;
                    this.requestFilters = [];
                  }}
                  part="extended-filters-modal-close"
                >
                  <NewCloseIcon />
                </button>
              </div>
            )}

            <ul class="filters-modal-list" part="extended-filters-list">
              {(filters ?? []).map((mainFilter) => {
                const mainColumn = mainFilter.column;
                const filterOptions = getFilterOptions(mainFilter);

                const requestFilter = this.requestFilters.find(
                  ({ column }) => column === mainColumn
                );
                const addedOptions = [];
                requestFilter?.values?.forEach((value) => {
                  const index = filterOptions.findIndex(
                    (f) => f.value.value === value || f.value === value
                  );
                  if (index > -1) {
                    addedOptions.push(
                      <span>{filterOptions[index].label}</span>
                    );
                  }
                });

                return (
                  <li part="extended-filters-row">
                    <div
                      class="filters-modal-main-button-wrapper"
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
                      </button>

                      {mainColumn === "price" &&
                      this.selectedMoreOptions.includes(mainFilter.column) ? (
                        <vviinn-price-range
                          histogram={(filterOptions as Histogram).filter(
                            (item) => item.value.frequency > 0
                          )}
                          priceChangeHandler={this.priceChangeHandler}
                          selectedInterval={this.getSelectedPriceInterval()}
                          currencySign={this.currencySign}
                        />
                      ) : (
                        <ul
                          class={`filters-modal-sub-list  ${
                            this.selectedMoreOptions.includes(mainFilter.column)
                              ? "open"
                              : ""
                          }`}
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

            <div class="filters-modal-actions" part="extended-filters-actions">
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
                onClick={() => this.resetModal()}
                part="extended-filters-reset"
              >
                <slot name="vviinn-extended-filters-reset">
                  {i18next.t("filters.modal.resetFilters")}
                </slot>
              </button>
            </div>
          </aside>
        </div>
      </Host>
    );
  }
}
