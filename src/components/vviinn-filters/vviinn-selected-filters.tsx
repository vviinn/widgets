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
  getPriceLabel,
  isSubFilterActive,
  RenderCustomButton,
  RenderFilterButton,
} from "./helpers";
import {
  ChangedFiltersEventData,
  DynamicFilterInternalData,
  SearchIdEvent,
  TriggerSourceEvent,
  TriggerSourceEventData,
} from "../../recommendation/events";
import { triggerFilter } from "./helpers/triggerFilter";
import {
  componentsState,
  searchState,
  SearchStore,
} from "../../store/search.store";
import { globalState } from "../../store/store";
import { ResponseDynamicFilterIntervalItem } from "../../interfaces/recommendation";
import { isIntervalFilter } from "../../filters";
import { components } from "../../interfaces/generated";
import i18next from "i18next";
import { resources } from "../../locale";

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

  /** @internal */
  @Prop() showInWidget: boolean = false;

  @State() requestFilters: RequestDynamicFilterItem[] = [];
  @State() selectedFilterButtons: JSX.Element[] = [];
  @State() textSearchCustomFilter: string | null = null;
  @State() imageSrc: string | null = null;
  @State() priceCustomFilter: string | null = null;

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

  private replaceSlotsContent() {
    const slots = this.el.querySelectorAll("[slot]");
    this.globalSlotsChanged.emit({
      slots: Array.from(slots),
      element: this.el,
    });
  }

  private getPriceFilter = () =>
    this.state.dynamicFilters.find((filter) =>
      isIntervalFilter(filter.column),
    ) as ResponseDynamicFilterIntervalItem;

  private skipStateChanges = (isTriggeredByVpsWidget: boolean) =>
    this.showInWidget !== isTriggeredByVpsWidget;

  private resetInnerState = (
    resetTextSearchFilter: boolean = false,
    resetImageFilter: boolean = false,
  ) => {
    this.requestFilters = [];
    this.selectedFilterButtons = [];
    this.priceCustomFilter = null;
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

    if (isIntervalFilter(detail.kind) && detail.action === "select") {
      this.priceCustomFilter = getPriceLabel(
        this.getPriceFilter(),
        detail.value.interval as components["schemas"]["interval"],
        globalState.currencySign,
      );
    }
  };

  private handleImageUploadStarted = ({ detail }: SearchIdEvent) => {
    if (this.skipStateChanges(detail.isTriggeredByVpsWidget)) return;
    this.resetInnerState(true);
  };

  private handleImageUploadFinished = () => {
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
    const imageSrc =
      this.state?.image?.src || localStorage.getItem("cropperImageSrc");
    if (!imageSrc?.length) return null;
    this.imageSrc = imageSrc;
  };

  private handlePriceButtonClick = () => {
    this.priceCustomFilter = null;

    const priceFilter = this.getPriceFilter();
    this.handleSubFilterSelection(
      priceFilter.full as DynamicFilterValue,
      priceFilter,
    );
  };

  private handleCropButtonClick = () => {
    this.vviinnResetCropArea.emit({
      isTriggeredByVpsWidget: this.showInWidget,
    });
  };

  connectedCallback() {
    this.state = this.showInWidget ? searchState : componentsState;

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
      this.handleImageUploadStarted,
    );
    document.addEventListener(
      "vviinnImageUploadFinished",
      this.handleImageUploadFinished,
    );
    document.addEventListener("vviinnImageCrop", this.handleImageCrop);
  }

  async componentWillLoad() {
    this.getUploadedImageSrc();
    await i18next.init({
      lng: globalState.locale,
      fallbackLng: "en",
      resources,
    });
  }

  componentDidRender() {
    this.replaceSlotsContent();
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
      this.handleImageUploadStarted,
    );
    document.removeEventListener(
      "vviinnImageUploadFinished",
      this.handleImageUploadFinished,
    );
    document.removeEventListener("vviinnImageCrop", this.handleImageCrop);
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
    return (
      <Host
        class={{
          "show-in-widget": this.showInWidget,
        }}
      >
        <ul class="selected-filters-wrapper" part="selected-filters-list">
          {RenderCustomButton({
            label: this.textSearchCustomFilter,
            buttonType: "text",
            hidden: !this.textSearchCustomFilter?.length,
          })}

          {RenderCustomButton({
            label: i18next.t("filters.imageFilterText"),
            buttonType: "image",
            imageSrc: this.imageSrc,
            hidden: !this.imageSrc?.length,
          })}

          {RenderCustomButton({
            label: i18next.t("filters.cropFilterText"),
            buttonType: "crop",
            imageSrc: this.state.croppedImageUrl,
            onClick: this.handleCropButtonClick,
            hidden: !this.state.searchArea,
          })}

          {RenderCustomButton({
            label: this.priceCustomFilter,
            buttonType: "price",
            onClick: this.handlePriceButtonClick,
            hidden: !this.priceCustomFilter,
          })}

          {this.selectedFilterButtons}
        </ul>
      </Host>
    );
  }
}
