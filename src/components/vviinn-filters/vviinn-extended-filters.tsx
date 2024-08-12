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
} from "@stencil/core";
import {
  DynamicFilters,
  DynamicFilter,
  DynamicFilterValue,
  RequestDynamicFilters,
} from "../../campaign/VPRCampaignService";
import { FiltersIcon, NewCloseIcon } from "../vviinn-icons";
import { getFilterOptions, subFilterSelection } from "./helpers";
import { Locale } from "../../locale";
import i18next from "i18next";
import { resources } from "../../locale";
import { SlotSkeleton, slotChangeListener } from "../customized-slots";
import { Histogram } from "../vviinn-price-range/vviinn-price-range";
import {
  ChangedFiltersEventData,
  DynamicFiltersEventData,
} from "../../recommendation/events";

/**
 * @part filters - Wrapper itself.
 */
@Component({
  tag: "vviinn-extended-filters",
  styleUrl: "vviinn-filters.css",
  shadow: true,
})
export class VviinnExtendedFilters {
  @Element() el: HTMLElement;

  @Prop({ mutable: true }) filters: DynamicFilters = [];
  @Prop() filtersString: string = "";
  /** The locale for currency formatting and text localization */
  @Prop() locale: Locale = "de-DE";

  @State() requestFilters: RequestDynamicFilters = [];
  @State() showMore: boolean = false;
  @State() selectedMoreOptions: string[] = [];

  /** The filter's state changes */
  /** @internal */
  @Event({ bubbles: true })
  vviinnFiltersChanged: EventEmitter<ChangedFiltersEventData>;
  /** @internal */
  @Event({ bubbles: true, composed: true })
  globalSlotsChanged: EventEmitter<any>;
  /** @internal */
  @Event({ bubbles: true })
  vviinnFilters: EventEmitter<DynamicFiltersEventData>;

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

  private emitRequestFiltersMore(requestFilters: RequestDynamicFilters) {
    this.vviinnFiltersChanged.emit({ filters: requestFilters, el: this.el });
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

    this.emitRequestFiltersMore([...this.requestFilters]);
  }

  private showActiveOnModalSubButton(
    requestFilters: RequestDynamicFilters,
    filterValue: DynamicFilterValue
  ) {
    let className = "";
    requestFilters.forEach((filter) => {
      if (
        filter.values.some(
          (value) =>
            value === filterValue ||
            value === filterValue.interval ||
            value === filterValue.value
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
    this.emitRequestFiltersMore([]);
    this.requestFilters = [];
    this.showMore = false;
  }

  timer: NodeJS.Timeout = null;

  private priceChangeHandler = (filterValue: DynamicFilterValue) => {
    if (this.timer) clearTimeout(this.timer);

    const seletedFilter = this.filters.find(
      (filter) => filter.column === "price"
    );

    if (seletedFilter) {
      this.timer = setTimeout(() => {
        this.handleSubFilterSelection(filterValue, seletedFilter);
      }, 200);
    }
  };

  render() {
    let moreFiltersOptionCount = 0;
    this.filters.forEach((filter) => {
      moreFiltersOptionCount += getFilterOptions(filter).length;
    });

    return (
      <Host part="filters">
        {SlotSkeleton("filters")}

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
              <slot name="vviinn-extended-filters-title">
                <span>{i18next.t("filters.modal.title")}</span>
              </slot>

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

            <ul class="filters-modal-list">
              {this.filters
                .filter((filter) => filter.column !== "color")
                .map((mainFilter) => {
                  const column = mainFilter.column;
                  const filterOptions = getFilterOptions(mainFilter);

                  return (
                    <li>
                      <button
                        onClick={() =>
                          this.handleMoreOptionsMainClick(mainFilter.column)
                        }
                        class="filters-modal-main-button"
                      >
                        {mainFilter.label}
                        {filterOptions.length > 0
                          ? ` (${filterOptions.length})`
                          : ""}
                      </button>

                      {column === "price" &&
                      this.selectedMoreOptions.includes(mainFilter.column) ? (
                        <vviinn-price-range
                          histogram={filterOptions as Histogram}
                          priceChangeHandler={this.priceChangeHandler}
                        />
                      ) : (
                        <ul
                          class={`filters-modal-sub-list ${
                            column === "color_confirmed"
                              ? "filters-modal-sub-list-inline"
                              : ""
                          } ${
                            this.selectedMoreOptions.includes(mainFilter.column)
                              ? "open"
                              : ""
                          }`}
                        >
                          {filterOptions &&
                            filterOptions.map(({ value, label, active }) => {
                              const hexCode = value.hexCode;
                              return (
                                <li>
                                  <button
                                    onClick={() =>
                                      this.handleSubFilterSelection(
                                        value,
                                        mainFilter
                                      )
                                    }
                                    class={`filters-more-modal-button ${
                                      hexCode ? "filters-sub-button-color" : ""
                                    } ${this.showActiveOnModalSubButton(
                                      this.requestFilters,
                                      value
                                    )}`}
                                    style={{ backgroundColor: hexCode }}
                                    disabled={!active}
                                  >
                                    <span>{label}</span>
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

            <div class="filters-modal-actions">
              <button
                class="filters-modal-apply"
                onClick={() => (this.showMore = false)}
                disabled={this.requestFilters.length === 0}
              >
                <slot name="vviinn-extended-filters-apply">
                  {i18next.t("filters.modal.apply")}
                </slot>
              </button>

              <button
                class="filters-modal-reset"
                onClick={() => this.resetModal()}
              >
                <slot name="vviinn-extended-filters-reset">
                  {i18next.t("filters.modal.resetFilters")}
                </slot>
              </button>
            </div>
          </div>
        </div>
      </Host>
    );
  }
}
