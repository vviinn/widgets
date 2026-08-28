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
  getSelectedInterval,
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
import { defaultConfig } from "../../store/store";
import i18next from "i18next";
import { Locale, initializeLocale } from "../../locale";
import { announceToScreenReader } from "../../a11y";
import { getLocalStorageItems } from "../../localStorage";
import { addEventListenersWithSignal } from "../../dom";
import { ResponseIntervalFilterItem } from "../../interfaces";
import { selectedFiltersParts } from "../../cssParts";

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

  /** Locale for text localization */
  @Prop() locale?: Locale;
  /** The currency sign displayed after price values */
  @Prop() currencySign?: string;

  /** @internal */
  @Prop() showInWidget: boolean = false;

  @State() requestFilters: RequestDynamicFilterItem[] = [];
  @State() textSearchCustomFilter: string | null = null;
  @State() imageSrc: string | null = null;

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
  private disposeStoreListener?: () => void;
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

    this.disposeStoreListener = syncRequestFilters(
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
    await initializeLocale(this.locale);
  }

  componentDidRender() {
    this.replaceSlotsContent();
  }

  disconnectedCallback() {
    this.eventAbortController?.abort();
    this.disposeStoreListener?.();
  }

  /** Built here so the dynamicFilters read happens under render() and registers a subscription. */
  private buildChips() {
    const intervalChips: JSX.Element[] = [];
    const selectedChips: JSX.Element[] = [];

    (this.state?.dynamicFilters ?? []).forEach((filter) => {
      if (filter.type === "interval") {
        const chip = this.renderIntervalChip(
          filter as ResponseIntervalFilterItem,
        );
        if (chip) intervalChips.push(chip);
        return;
      }
      if (!("values" in filter)) return;
      (filter.values as FilterOptions).forEach(({ value, label, active }) => {
        if (!isSubFilterActive(this.requestFilters, value, filter)) return;
        selectedChips.push(
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
      });
    });

    return { intervalChips, selectedChips };
  }

  /** A chip exists only while the column has an applied interval to show. */
  private renderIntervalChip(filter: ResponseIntervalFilterItem) {
    const applied = getSelectedInterval(this.requestFilters, filter.column);
    if (!applied) return null;

    const label = getIntervalLabel(
      filter,
      applied,
      this.currencySign ?? defaultConfig.currencySign,
      true,
    );
    if (!label) return null;

    const { column } = filter;

    return (
      <div key={column}>
        {RenderCustomButton({
          label,
          buttonType: "range",
          onClick: () => this.handleIntervalButtonClick(column),
        })}
      </div>
    );
  }

  render() {
    const { intervalChips, selectedChips } = this.buildChips();

    if (
      this.showInWidget &&
      !selectedChips.length &&
      !this.state.croppedImageUrl &&
      !intervalChips.length
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

            {intervalChips}

            {selectedChips}
          </ul>
        </section>
      </Host>
    );
  }
}
