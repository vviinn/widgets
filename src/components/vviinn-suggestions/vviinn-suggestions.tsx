import {
  Component,
  Host,
  Prop,
  h,
  State,
  Event,
  EventEmitter,
  Element,
  JSX,
} from "@stencil/core";
import i18next from "i18next";
import {
  Recommendation,
  ContextAnnotation,
  Interactions,
  Stream,
} from "../../interfaces";
import { useSearchStore, SearchStore } from "../../store/search.store";
import { globalState } from "../../store/store";
import {
  ChangedFiltersEventData,
  DynamicFilterInternalData,
  TextSearchEventData,
} from "../../recommendation/events";
import { RequestDynamicFilterItem } from "../../campaign/VPRCampaignService";
import { addEventListenersWithSignal } from "../../dom";
import { Locale } from "../../locale/types";
import { resources } from "../../locale";
import { slotChangeListener } from "../customized-slots";
import { SparkIcon } from "../vviinn-icons/icons/SparkIcon";
import { suggestionsParts } from "../../cssParts";
import {
  extractDataItems,
  applyFiltersForItems,
  handleDeeplinks,
  renderListItem,
  hasDynamicFilters,
  FilterHandlers,
  renderToggleButton,
  hasCategoricalFilters,
} from "./render-helpers";
import { toggleFilterInSet, syncSuggestionFilters } from "./helpers";

/**
 * @slot vviinn-suggestions-title - Custom title text to replace default "AI Suggestions".
 * @slot vviinn-suggestions-description - Custom description text to replace default description.
 * @slot vviinn-suggestions-icon - Custom icon to replace default sparkle emoji.
 *
 * @part suggestions-container - The main suggestions container element.
 * @part suggestions-header - The header section containing icon and title.
 * @part suggestions-icon - The sparkle icon wrapper.
 * @part suggestions-title - The title text element.
 * @part suggestions-description - The description text element.
 * @part suggestions-wrapper - The wrapper around the suggestions list.
 * @part suggestions-list - The list container for all suggestions.
 * @part suggestion-item - Individual suggestion item.
 * @part suggestion-link - Clickable suggestion text/link.
 * @part suggestion-filter-button - Toggle button for filter suggestions.
 */

@Component({
  tag: "vviinn-suggestions",
  styleUrl: "vviinn-suggestions.css",
  shadow: true,
})
export class VviinnSuggestions {
  @Element() el: HTMLElement;

  @Prop() showInWidget: boolean = false;

  @Prop() apiPath?: string;
  @Prop() locale?: Locale;
  @Prop() currencySign?: string;
  @Prop() pricePrefix?: string;
  @Prop() token?: string;

  @State() private stream: Stream | null = null;
  @State() private appliedSuggestionFilters: Set<string> = new Set();

  @Event({ bubbles: true })
  vviinnFiltersChanged: EventEmitter<ChangedFiltersEventData>;
  @Event() vviinnFilterTriggered: EventEmitter<DynamicFilterInternalData>;
  /** @internal */
  @Event({ bubbles: true, composed: true })
  globalSlotsChanged: EventEmitter<any>;

  private state?: SearchStore;
  private eventAbortController?: AbortController;
  private disposeStoreListener?: () => void;

  private skipStateChanges = (isTriggeredByVpsWidget: boolean) =>
    this.showInWidget !== isTriggeredByVpsWidget;

  private replaceSlotsContent() {
    const slots = this.el.querySelectorAll("[slot]");
    this.globalSlotsChanged.emit({
      slots: Array.from(slots),
      element: this.el,
    });
  }

  async componentWillLoad() {
    await i18next.init({
      lng: this.locale ?? globalState.locale,
      fallbackLng: "en",
      resources,
    });

    slotChangeListener(this, this.el);
  }

  componentDidRender() {
    this.replaceSlotsContent();
  }

  connectedCallback() {
    const { state, onChange } = useSearchStore(this.showInWidget);
    this.state = state;

    const disposeStreamListener = onChange("stream", () => {
      this.stream = this.state.stream;
      this.syncFiltersIfReady();
    });

    this.disposeStoreListener = () => {
      disposeStreamListener();
    };

    this.stream = this.state.stream;
    this.syncFiltersIfReady();

    this.eventAbortController = new AbortController();
    const { signal } = this.eventAbortController;

    addEventListenersWithSignal(
      document,
      [
        ["vviinnFiltersChanged", this.handleFiltersChanged],
        ["vviinnTextSearchStarted", this.handleTextSearchStarted],
      ],
      signal,
    );
  }

  disconnectedCallback() {
    this.eventAbortController?.abort();
    this.disposeStoreListener?.();
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

    this.syncSuggestionFiltersWithActiveFilters(filters);
    this.state.requestFilters = filters;
  };

  private handleTextSearchStarted = ({
    detail,
  }: CustomEvent<TextSearchEventData>) => {
    if (this.skipStateChanges(detail.isTriggeredByVpsWidget)) return;
    this.appliedSuggestionFilters = new Set();
  };

  private handleProductClick = (
    product: Recommendation,
    interactions: Interactions,
    suggestionText: string,
  ) => {
    this.toggleSuggestionFilter(suggestionText);
    this.applyProductFilters([product], interactions);
  };

  private handleSuggestionClick = (
    annotation: ContextAnnotation,
    suggestionText?: string,
  ) => {
    const dataItems = extractDataItems(annotation);

    if (handleDeeplinks(dataItems)) {
      return;
    }

    if (suggestionText && hasDynamicFilters(annotation)) {
      this.toggleSuggestionFilter(suggestionText);
    }

    this.applyProductFilters(dataItems, annotation.interactions);
  };

  private toggleSuggestionFilter(suggestionText: string) {
    this.appliedSuggestionFilters = toggleFilterInSet(
      this.appliedSuggestionFilters,
      suggestionText,
    );
  }

  private syncFiltersIfReady() {
    if (this.stream && this.state.requestFilters?.length > 0) {
      this.syncSuggestionFiltersWithActiveFilters(this.state.requestFilters);
    }
  }

  private syncSuggestionFiltersWithActiveFilters(
    activeFilters: RequestDynamicFilterItem[],
  ) {
    this.appliedSuggestionFilters = syncSuggestionFilters(
      activeFilters,
      this.stream,
    );
  }

  private applyProductFilters(
    dataItems: Recommendation[],
    interactions: Interactions,
  ) {
    const handlers = this.getFilterHandlers();
    const updatedFilters = applyFiltersForItems(
      dataItems,
      interactions,
      this.state.requestFilters,
      handlers,
    );
    this.state.requestFilters = updatedFilters;
  }

  private getFilterHandlers(): FilterHandlers {
    return {
      vviinnFilterTriggered: this.vviinnFilterTriggered,
      vviinnFiltersChanged: this.vviinnFiltersChanged,
      el: this.el,
      isTriggeredByVpsWidget: this.showInWidget,
    };
  }

  private renderProductItems(
    dataItems: Recommendation[],
    annotation: ContextAnnotation,
    key: string,
    listItems: JSX.Element[],
  ) {
    dataItems.forEach((product, productIdx) => {
      const itemKey = `${key}-${productIdx}`;

      if ("deeplink" in product && product.deeplink) {
        listItems.push(
          renderListItem(
            product.title || product.productId,
            itemKey,
            false,
            undefined,
            product.deeplink,
          ),
        );
      } else {
        this.renderProductAsFilter(product, annotation, itemKey, listItems);
      }
    });
  }

  private renderProductAsFilter(
    product: Recommendation,
    annotation: ContextAnnotation,
    itemKey: string,
    listItems: JSX.Element[],
  ) {
    const { hasFilters, selectedFilter } = hasCategoricalFilters(annotation);

    if (hasFilters && selectedFilter && "values" in selectedFilter) {
      const productLabel = product.title || product.productId;
      const matchingFilterOption = selectedFilter.values.find((option) => {
        return (
          option.label === productLabel || option.label === product.productId
        );
      });

      if (matchingFilterOption) {
        const isSelected = this.appliedSuggestionFilters.has(productLabel);
        listItems.push(
          renderToggleButton(
            productLabel,
            isSelected,
            () =>
              this.handleProductClick(
                product,
                annotation.interactions,
                productLabel,
              ),
            itemKey,
          ),
        );
      }
    } else {
      listItems.push(
        renderListItem(product.title || product.productId, itemKey, true, () =>
          this.handleSuggestionClick(annotation),
        ),
      );
    }
  }

  private renderSuggestionItem(annotations: ContextAnnotation[], key: string) {
    if (!annotations || annotations.length === 0) {
      return null;
    }

    const listItems: JSX.Element[] = [];

    annotations.forEach((annotation, idx) => {
      const dataItems = extractDataItems(annotation);

      if (dataItems.length > 0) {
        this.renderProductItems(
          dataItems,
          annotation,
          `${key}-${idx}`,
          listItems,
        );
      }
    });

    return listItems;
  }

  private renderStreamItems() {
    return (
      <ul class="suggestions-list" part="suggestions-list">
        {this.stream.items.map((item, index) => {
          if (item.role !== "assistant" || !item.parts) return null;

          return item.parts.map((part, partIndex) => {
            if (part.text?.annotations) {
              return this.renderSuggestionItem(
                part.text.annotations,
                `${index}-${partIndex}`,
              );
            }
            return null;
          });
        })}
      </ul>
    );
  }

  render() {
    if (!this.stream?.items || this.stream.items.length === 0) {
      return null;
    }

    return (
      <Host
        class={{
          "show-in-widget": this.showInWidget,
        }}
        exportparts={suggestionsParts}
      >
        <div class="container" part="suggestions-container">
          <div class="header" part="suggestions-header">
            <div class="icon" part="suggestions-icon">
              <slot name="vviinn-suggestions-icon">{<SparkIcon />}</slot>
            </div>
            <h3 class="title" part="suggestions-title">
              <slot name="vviinn-suggestions-title">
                {i18next.t("suggestions.title")}
              </slot>
            </h3>
          </div>
          <div class="description" part="suggestions-description">
            <slot name="vviinn-suggestions-description">
              {i18next.t("suggestions.description")}
            </slot>
          </div>
          <div class="suggestions-wrapper" part="suggestions-wrapper">
            {this.renderStreamItems()}
          </div>
        </div>
      </Host>
    );
  }
}
