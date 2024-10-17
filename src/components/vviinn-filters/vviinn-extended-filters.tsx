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
} from "@stencil/core";
import i18next from "i18next";

import {
  DynamicFilters,
  DynamicFilter,
  DynamicFilterValue,
  RequestDynamicFilters,
} from "../../campaign/VPRCampaignService";
import {
  FiltersIcon,
  NewCloseIcon,
  SquareFilterIcon,
  CheckFilterIcon,
} from "../vviinn-icons";
import { getFilterOptions, emitRequestFiltersMore } from "./helpers";
import { Locale, resources } from "../../locale";

import { SlotSkeleton, slotChangeListener } from "../customized-slots";
import { Histogram } from "../vviinn-price-range/vviinn-price-range";
import {
  ChangedFiltersEventData,
  DynamicFiltersEventData,
  DynamicFilterTrackingData,
} from "../../recommendation/events";
import { components } from "../../interfaces/generated";
import { ClickEvent, isClickedInRectBound } from "../../geometry/Rectangle";
import { triggerFilter } from "./helpers/triggerFilter";

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
 * @part extended-filters-sub-row - Row of the sub filters.
 * @part extended-filters-option-button - Button for the sub filter.
 * @part extended-filters-actions - Wrapper for the actions.
 * @part extended-filters-apply - Apply button.
 * @part extended-filters-reset - Reset button.
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
@Component({
  tag: "vviinn-extended-filters",
  styleUrl: "vviinn-filters.css",
  shadow: true,
})
export class VviinnExtendedFilters {
  @Element() el: HTMLElement;

  @Prop({ mutable: true }) filters: DynamicFilters = [];
  /** @internal */
  @Prop() filtersString: string = "";
  /** The locale for currency formatting and text localization */
  @Prop() locale: Locale = "de-DE";
  @Prop() mode: "button" | "preview" = "button";
  /** The currency sign is displayed after the price */
  @Prop() currencySign?: string = "€";

  @State() requestFilters: RequestDynamicFilters = [];
  @State() showMore: boolean = false;
  @State() selectedMoreOptions: string[] = [];

  /** The filter's state changes */
  @Event({ bubbles: true })
  vviinnFiltersChanged: EventEmitter<ChangedFiltersEventData>;
  /** The filters received */
  @Event({ bubbles: true })
  vviinnFilters: EventEmitter<DynamicFiltersEventData>;

  /** @internal */
  @Event({ bubbles: true, composed: true })
  globalSlotsChanged: EventEmitter<any>;

  @Event() vviinnFilterTriggered: EventEmitter<DynamicFilterTrackingData>;

  private replaceSlotsContent() {
    const slots = this.el.querySelectorAll("[slot]");
    this.globalSlotsChanged.emit({
      slots: Array.from(slots),
      element: this.el,
    });
  }

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

  private showActiveOnModalSubButton(
    requestFilters: RequestDynamicFilters,
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

  @Watch("filtersString")
  filtersStringWatcher() {
    if (this.filtersString === "") return;

    try {
      this.filters = JSON.parse(this.filtersString) as DynamicFilters;
    } catch (e) {
      console.error("Invalid filters string", e);
    }
  }

  connectedCallback() {
    document.addEventListener("vviinnFilters", this.handleSetFilters);
    document.addEventListener(
      "vviinnFiltersChanged",
      this.handleFiltersChanged
    );
    this.filtersStringWatcher();
  }

  disconnectedCallback() {
    document.removeEventListener("vviinnFilters", this.handleSetFilters);
    document.addEventListener(
      "vviinnFiltersChanged",
      this.handleFiltersChanged
    );
  }

  private resetModal() {
    emitRequestFiltersMore([], this.el, this.vviinnFiltersChanged);
    this.requestFilters = [];
    this.showMore = false;
  }

  timer: NodeJS.Timeout = null;

  private priceChangeHandler = (filterValue: DynamicFilterValue) => {
    if (this.timer) clearTimeout(this.timer);

    const selectedFilter = this.filters.find(
      (filter) => filter.column === "price"
    );

    if (selectedFilter) {
      this.timer = setTimeout(() => {
        this.handleSubFilterSelection(filterValue, selectedFilter);
      }, 200);
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
    return (
      <Host>
        {SlotSkeleton("filters")}

        {this.filters.length > 0 && this.mode === "button" && (
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

            <ul class="filters-modal-list" part="extended-filters-list">
              {this.filters.map((mainFilter) => {
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
                      </button>
                      {addedOptions.length > 0 && (
                        <div
                          class="filters-modal-main-button-added-options"
                          part="extended-filters-selected-wrapper"
                        >
                          {addedOptions}
                        </div>
                      )}
                    </div>
                    {mainColumn === "price" &&
                    this.selectedMoreOptions.includes(mainFilter.column) ? (
                      <vviinn-price-range
                        histogram={filterOptions as Histogram}
                        priceChangeHandler={this.priceChangeHandler}
                        selectedInterval={
                          (this.requestFilters.find(
                            ({ column }) => column === "price"
                          )?.values[0] ??
                            {}) as components["schemas"]["interval"]
                        }
                        currencySign={this.currencySign}
                      />
                    ) : (
                      <ul
                        class={`filters-modal-sub-list ${
                          mainColumn === "color_confirmed"
                            ? "filters-modal-sub-list-inline"
                            : ""
                        } ${
                          this.selectedMoreOptions.includes(mainFilter.column)
                            ? "open"
                            : ""
                        }`}
                        part="extended-filters-sub-list"
                      >
                        {filterOptions &&
                          filterOptions.map(({ value, label, active }) => {
                            const hexCode = value.hexCode;
                            const selected = this.showActiveOnModalSubButton(
                              this.requestFilters,
                              value
                            );

                            return (
                              <li part="extended-filters-sub-row">
                                <button
                                  onClick={() =>
                                    this.handleSubFilterSelection(
                                      value,
                                      mainFilter
                                    )
                                  }
                                  class={`filters-more-modal-button ${
                                    hexCode ? "filters-sub-button-color" : ""
                                  } ${selected ? "active" : ""}`}
                                  style={{ backgroundColor: hexCode }}
                                  disabled={!active}
                                  part="extended-filters-option-button"
                                >
                                  <span>
                                    <span>{label}</span>
                                    {selected ? (
                                      <CheckFilterIcon />
                                    ) : (
                                      <SquareFilterIcon />
                                    )}
                                  </span>
                                </button>
                              </li>
                            );
                          })}
                      </ul>
                    )}
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
