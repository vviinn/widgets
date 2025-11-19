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
  getIntervalLabel,
  isSubFilterActive,
  RenderCustomButton,
  RenderFilterButton,
  syncRequestFilters,
} from "./helpers";
import {
  ChangedFiltersEventData,
  DynamicFilterInternalData,
  SearchIdEvent,
  TriggerSourceEvent,
  TriggerSourceEventData,
} from "../../recommendation/events";
import {
  triggerFilter,
  triggerRemoveIntervalFilter,
} from "./helpers/triggerFilter";
import { SearchStore, useSearchStore } from "../../store/search.store";
import { globalState } from "../../store/store";
import i18next from "i18next";
import { resources } from "../../locale";
import { announceToScreenReader } from "../../a11y";
import { getLocalStorageItems } from "../../localStorage";
import { addEventListenersWithSignal } from "../../dom";
import { Interval, ResponseIntervalFilterItem } from "../../interfaces";
import { selectedFiltersParts } from "../../cssParts";
import { Locale } from "../../locale";

/**
 * @part selected-filters-list - List of selected filters.
 
 * @part filters-sub-row - Row of the sub filters.
 * @part filters-option-button - Button of the sub filter.
 * @part filters-option-image - Image of the sub filter.
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

  /** The locale for currency formatting and text localization */
  @Prop() locale?: Locale;
  /** The currency sign displayed after price values */
  @Prop() currencySign?: string;

  /** @internal */
  @Prop() showInWidget: boolean = false;

  @State() requestFilters: RequestDynamicFilterItem[] = [];
  @State() selectedFilterButtons: JSX.Element[] = [];
  @State() textSearchCustomFilter: string | null = null;
  @State() imageSrc: string | null = null;
  @State() intervalCustomFilters: { [column: string]: string } = {};

  /** The filter's state changes */
  @Event({ bubbles: true })
  vviinnFiltersChanged: EventEmitter<ChangedFiltersEventData>;
  @Event() vviinnFilterTriggered: EventEmitter<DynamicFilterInternalData>;

  /** Selected filters should be resetted */
  /** @internal */
  @Event() vviinnSelectedFiltersReset: EventEmitter<TriggerSourceEventData>;
  /** @internal */
  @Event() vviinnCropperResetState: EventEmitter<TriggerSourceEventData>;
  /** @internal */
  @Event() vviinnResetCropArea: EventEmitter<TriggerSourceEventData>;
  /** @internal */
  @Event({ bubbles: true, composed: true })
  globalSlotsChanged: EventEmitter<any>;

  private state?: SearchStore;
  private eventAbortController?: AbortController;
  private filterAnnouncementRef?: HTMLElement;

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

    this.announceFilterChange(
      i18next.t("a11y.filterRemoved", { label: selectedFilter.label }),
    );
  };

  private announceFilterChange(message: string) {
    announceToScreenReader(message, this.filterAnnouncementRef);
  }

  private replaceSlotsContent() {
    const slots = this.el.querySelectorAll("[slot]");
    this.globalSlotsChanged.emit({
      slots: Array.from(slots),
      element: this.el,
    });
  }

  private skipStateChanges = (isTriggeredByVpsWidget: boolean) =>
    this.showInWidget !== isTriggeredByVpsWidget;

  private resetInnerState = (
    resetTextSearchFilter: boolean = false,
    resetImageFilter: boolean = false,
  ) => {
    this.requestFilters = [];
    this.selectedFilterButtons = [];
    this.intervalCustomFilters = {};
    resetTextSearchFilter && (this.textSearchCustomFilter = null);
    resetImageFilter && (this.imageSrc = null);
  };

  private handleFilterTriggered = ({
    detail,
  }: CustomEvent<DynamicFilterInternalData>) => {
    if (this.skipStateChanges(detail.isTriggeredByVpsWidget)) return;

    if (detail.customTrigger === "TPS") {
      this.resetInnerState(true, true);
      this.textSearchCustomFilter = detail.kind;
    }

    if (detail.action === "select" && detail.filter?.type === "interval") {
      const intervalLabel = getIntervalLabel(
        detail.filter as ResponseIntervalFilterItem,
        detail.value.interval as Interval,
        this.currencySign ?? globalState.currencySign,
        true,
      );
      if (intervalLabel) {
        this.intervalCustomFilters = {
          ...this.intervalCustomFilters,
          [detail.filter.column]: intervalLabel,
        };
      } else {
        const { [detail.filter.column]: removed, ...remaining } =
          this.intervalCustomFilters;
        this.intervalCustomFilters = remaining;
      }
    }
  };

  private handleImageUploadStarted = ({ detail }: SearchIdEvent) => {
    if (this.skipStateChanges(detail.isTriggeredByVpsWidget)) return;
    this.resetInnerState(true);
  };

  private handleImageUploadFinished = ({ detail }: SearchIdEvent) => {
    if (this.skipStateChanges(detail.isTriggeredByVpsWidget)) return;
    this.textSearchCustomFilter = null;
    this.getUploadedImageSrc();
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

    const activeIntervalColumns = new Set(
      filters
        .filter((f) => f.values && f.values.length > 0)
        .map((f) => f.column),
    );

    const updatedIntervalFilters = Object.fromEntries(
      Object.entries(this.intervalCustomFilters).filter(([column]) =>
        activeIntervalColumns.has(column),
      ),
    );

    if (
      Object.keys(updatedIntervalFilters).length !==
      Object.keys(this.intervalCustomFilters).length
    )
      this.intervalCustomFilters = updatedIntervalFilters;
  };

  private handleSelectedFiltersReset = ({ detail }: TriggerSourceEvent) => {
    if (this.skipStateChanges(detail.isTriggeredByVpsWidget)) return;
    this.resetInnerState();
  };

  private handleImageCrop = ({ detail }: TriggerSourceEvent) => {
    if (this.skipStateChanges(detail.isTriggeredByVpsWidget)) return;
    this.textSearchCustomFilter = null;
  };

  private getUploadedImageSrc = () => {
    const { imageSrc: localStorageImageSrc } = getLocalStorageItems();
    const imageSrc = this.state.image?.src || localStorageImageSrc;
    if (!imageSrc?.length) return null;
    this.imageSrc = imageSrc;
  };

  private handleIntervalButtonClick = (column: string) => {
    const { [column]: removed, ...remaining } = this.intervalCustomFilters;
    this.intervalCustomFilters = remaining;

    this.requestFilters = triggerRemoveIntervalFilter({
      column,
      requestFilters: this.requestFilters,
      el: this.el,
      isTriggeredByVpsWidget: this.showInWidget,
      vviinnFilterTriggered: this.vviinnFilterTriggered,
      vviinnFiltersChanged: this.vviinnFiltersChanged,
    });
  };

  private handleCropButtonClick = () => {
    this.vviinnResetCropArea.emit({
      isTriggeredByVpsWidget: this.showInWidget,
    });
  };

  connectedCallback() {
    const { state, onChange } = useSearchStore(this.showInWidget);
    this.state = state;

    syncRequestFilters(
      state,
      onChange,
      (filters) => (this.requestFilters = filters),
    );

    this.eventAbortController = new AbortController();
    const { signal } = this.eventAbortController;

    addEventListenersWithSignal(
      document,
      [
        ["vviinnFiltersChanged", this.handleFiltersChanged],
        ["vviinnFilterTriggered", this.handleFilterTriggered],
        ["vviinnSelectedFiltersReset", this.handleSelectedFiltersReset],
        ["vviinnImageUploadStarted", this.handleImageUploadStarted],
        ["vviinnImageUploadFinished", this.handleImageUploadFinished],
        ["vviinnImageCrop", this.handleImageCrop],
      ],
      signal,
    );
  }

  async componentWillLoad() {
    this.getUploadedImageSrc();
    await i18next.init({
      lng: this.locale ?? globalState.locale,
      fallbackLng: "en",
      resources,
    });
  }

  componentDidRender() {
    this.replaceSlotsContent();
  }

  disconnectedCallback() {
    this.eventAbortController?.abort();
  }

  componentWillRender() {
    this.selectedFilterButtons = [];
    const filters = this.state?.dynamicFilters || [];

    filters.forEach((filter) => {
      if (!("values" in filter)) return;
      (filter.values as FilterOptions).forEach(({ value, label, active }) => {
        if (isSubFilterActive(this.requestFilters, value, filter)) {
          this.selectedFilterButtons.push(
            RenderFilterButton({
              handleSubFilterSelection: this.handleSubFilterSelection,
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
    if (
      this.showInWidget &&
      !this.selectedFilterButtons.length &&
      !this.state.croppedImageUrl &&
      !Object.keys(this.intervalCustomFilters).length
    )
      return null;
    return (
      <Host
        class={{
          "show-in-widget": this.showInWidget,
        }}
        exportParts={selectedFiltersParts}
      >
        <div
          ref={(el) => (this.filterAnnouncementRef = el)}
          aria-live="polite"
          class="sr-only"
        ></div>

        <section
          class="selected-filters-container"
          aria-label={i18next.t("a11y.selectedFilters")}
        >
          <ul class="selected-filters-wrapper" part="selected-filters-list">
            {RenderCustomButton({
              label: this.textSearchCustomFilter,
              buttonType: "text",
              hidden: !this.textSearchCustomFilter?.length || this.showInWidget,
            })}

            {RenderCustomButton({
              label: i18next.t("filters.imageFilterText"),
              buttonType: "image",
              imageSrc: this.imageSrc,
              hidden:
                !this.imageSrc?.length ||
                !this.state.visualSearchStarted ||
                !this.state.image ||
                this.showInWidget,
            })}

            {RenderCustomButton({
              label: i18next.t("filters.cropFilterText"),
              buttonType: "crop",
              imageSrc: this.state.croppedImageUrl,
              onClick: this.handleCropButtonClick,
              hidden: !this.state.searchArea,
            })}

            {Object.entries(this.intervalCustomFilters)
              .filter(([, label]) => label && label.trim().length > 0)
              .map(([column, label]) => (
                <div key={column}>
                  {RenderCustomButton({
                    label,
                    buttonType: "range",
                    onClick: () => this.handleIntervalButtonClick(column),
                    hidden: false,
                  })}
                </div>
              ))}

            {this.selectedFilterButtons}
          </ul>
        </section>
      </Host>
    );
  }
}
