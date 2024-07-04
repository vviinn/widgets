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
import { FiltersEventData } from "./types";
import { Locale } from "../../locale";
import i18next from "i18next";
import { resources } from "../../locale";
import { SlotSkeleton, slotChangeListener } from "../customized-slots";

/**
 * * @part filters - Wrapper itself.
 */
@Component({
  tag: "vviinn-extended-filters",
  styleUrl: "vviinn-filters.css",
  shadow: true,
})
export class VviinnExtendedFilters {
  @Element() el: HTMLElement;

  @Prop() filters: DynamicFilters = [];
  @Prop() filtersString: string = "";
  /** The locale for currency formatting and text localization */
  @Prop() locale: Locale = "de-DE";

  @State() requestFilters: RequestDynamicFilters = [];
  @State() showMore: boolean = false;
  @State() selectedMoreOptions: string[] = [];

  /** @internal */
  @Event({ bubbles: true, composed: true })
  globalSlotsChanged: EventEmitter<any>;
  /** Event fires when user click on Add to Basket button */
  @Event({ bubbles: true })
  vviinnFiltersChanged: EventEmitter<FiltersEventData>;

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

  private emitTequestFiltersMore(requestFilters: RequestDynamicFilters) {
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

    this.emitTequestFiltersMore([...this.requestFilters]);
  }

  private showActiveOnModalSubButton(
    requestFilters: RequestDynamicFilters,
    filterValue: DynamicFilterValue
  ) {
    let className = "";
    requestFilters.forEach((filter) => {
      if (
        filter.values.some(
          (value) => value === filterValue || value === filterValue.interval
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

  private handleSetFilters = (event) => {
    this.filters = event.detail;
  };

  private handleFiltersChanged = ({
    detail,
  }: CustomEvent<FiltersEventData>) => {
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
              {this.filters.map((mainFilter) => {
                const filterOptions = getFilterOptions(mainFilter);

                return (
                  <li>
                    <button
                      onClick={() =>
                        this.handleMoreOptionsMainClick(mainFilter.column)
                      }
                      class="filters-modal-main-button"
                    >
                      {mainFilter.column}
                      {filterOptions.length > 0
                        ? ` (${filterOptions.length})`
                        : ""}
                    </button>

                    <ul
                      class={`filters-modal-sub-list ${
                        this.selectedMoreOptions.includes(mainFilter.column)
                          ? "open"
                          : ""
                      }`}
                    >
                      {filterOptions &&
                        filterOptions.map((filter) => {
                          return (
                            <li>
                              <button
                                onClick={() =>
                                  this.handleSubFilterSelection(
                                    filter.value,
                                    mainFilter
                                  )
                                }
                                class={`filters-more-modal-button ${this.showActiveOnModalSubButton(
                                  this.requestFilters,
                                  filter.value
                                )}`}
                              >
                                {filter.label}
                              </button>
                            </li>
                          );
                        })}
                    </ul>
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
                onClick={() => (this.requestFilters = [])}
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
