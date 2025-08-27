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
import { components } from "../../interfaces/generated";
import { useSearchStore, SearchStore } from "../../store/search.store";
import { updateGlobalState, globalState } from "../../store/store";
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
import {
  extractDataItems,
  applyFiltersForItems,
  handleDeeplinks,
  renderListItem,
  cleanLineText,
  splitAnnotationText,
  hasDynamicFilters,
  FilterHandlers,
  renderToggleButton,
  hasCategoricalFilters,
  renderFallbackListItem,
} from "./render-helpers";
import {
  toggleFilterInSet,
  syncSuggestionFilters,
} from "./helpers";

/**
 * @slot vviinn-suggestions-title - Custom title text to replace default "AI Suggestions".
 * @slot vviinn-suggestions-description - Custom description text to replace default description.
 * @slot vviinn-suggestions-icon - Custom icon to replace default sparkle emoji.
 *
 * @part container - The main container element.
 * @part header - The header section containing icon and title.
 * @part icon - The sparkle icon wrapper.
 * @part title - The title text element.
 * @part description - The description text element.
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

  @State() private stream: components["schemas"]["stream"] | null = null;
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

  private replaceSlotsContent() {
    const slots = this.el.querySelectorAll("[slot]");
    this.globalSlotsChanged.emit({
      slots: Array.from(slots),
      element: this.el,
    });
  }

  async componentWillLoad() {
    await i18next.init({
      lng: globalState.locale,
      fallbackLng: "en",
      resources,
    });

    slotChangeListener(this, this.el);
  }

  componentDidRender() {
    this.replaceSlotsContent();
  }

  connectedCallback() {
    updateGlobalState(this);
    const { state, onChange } = useSearchStore(this.showInWidget);
    this.state = state;

    // Listen to stream changes
    const disposeStreamListener = onChange("stream", () => {
      this.stream = this.state.stream;
    });

    // Listen to filter changes for consistency
    const disposeFilterListener = onChange("requestFilters", () => {
      // Store state is automatically updated, no need for local copy
    });

    // Combine disposers
    this.disposeStoreListener = () => {
      disposeStreamListener();
      disposeFilterListener();
    };

    this.stream = this.state.stream;

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

    // Skip if this event came from this component or different widget mode
    if (
      senderElement === this.el ||
      this.showInWidget !== isTriggeredByVpsWidget
    ) {
      return;
    }

    // Check if any suggestion filters should be deactivated
    this.syncSuggestionFiltersWithActiveFilters(filters);

    // Update the store state with the new filters (this ensures consistency)
    this.state.requestFilters = filters;
  };

  private handleTextSearchStarted = ({
    detail,
  }: CustomEvent<TextSearchEventData>) => {
    // Clear all applied suggestion filters when text search starts
    if (this.showInWidget === detail.isTriggeredByVpsWidget) {
      this.appliedSuggestionFilters = new Set();
    }
  };

  private handleProductClick = (
    product: any,
    interactions: any,
    suggestionText: string,
  ) => {
    this.toggleSuggestionFilter(suggestionText);
    this.applyProductFilters([product], interactions);
  };

  private handleSuggestionClick = (
    annotation: components["schemas"]["context-annotation"],
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
      suggestionText
    );
  }

  private syncSuggestionFiltersWithActiveFilters(activeFilters: RequestDynamicFilterItem[]) {
    this.appliedSuggestionFilters = syncSuggestionFilters(
      activeFilters,
      this.stream
    );
  }

  private applyProductFilters(dataItems: any[], interactions: any) {
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

  private renderDataItemsAnnotation(
    dataItems: any[],
    annotationText: string,
    annotation: components["schemas"]["context-annotation"],
    key: string,
    idx: number,
    listItems: JSX.Element[],
  ) {
    const lines = splitAnnotationText(annotationText);

    if (lines.length === dataItems.length) {
      // Create separate list items for each product
      lines.forEach((line, productIdx) => {
        const product = dataItems[productIdx];
        const cleanLine = cleanLineText(line);

        if ("deeplink" in product && product.deeplink) {
          listItems.push(
            renderListItem(
              cleanLine,
              `${key}-${idx}-${productIdx}`,
              false,
              undefined,
              product.deeplink,
            ),
          );
        } else {
          this.renderProductListItem(
            product,
            cleanLine,
            annotation,
            `${key}-${idx}-${productIdx}`,
            listItems,
          );
        }
      });
    } else {
      // Fallback to full annotation if we can't match lines to products
      this.renderAnnotationAsFilter(
        annotationText,
        annotation,
        `${key}-${idx}-filter`,
        listItems,
      );
    }
  }

  private renderPlainAnnotation(
    annotationText: string,
    annotation: components["schemas"]["context-annotation"],
    key: string,
    idx: number,
    listItems: JSX.Element[],
  ) {
    this.renderAnnotationAsFilter(
      annotationText,
      annotation,
      `${key}-${idx}-no-data-filter`,
      listItems,
    );
  }

  private renderProductListItem(
    product: any,
    cleanLine: string,
    annotation: components["schemas"]["context-annotation"],
    itemKey: string,
    listItems: JSX.Element[],
  ) {
    const { hasFilters, selectedFilter } = hasCategoricalFilters(annotation);

    if (hasFilters && selectedFilter && "values" in selectedFilter) {
      const matchingFilterOption = selectedFilter.values.find((option) => {
        return (
          option.label === cleanLine ||
          option.label === product.title ||
          option.label === product.productId
        );
      });

      if (matchingFilterOption) {
        const isSelected = this.appliedSuggestionFilters.has(cleanLine);
        listItems.push(
          renderToggleButton(
            cleanLine,
            isSelected,
            () =>
              this.handleProductClick(
                product,
                annotation.interactions,
                cleanLine,
              ),
            `${itemKey}-filter`,
          ),
        );
      }
    } else {
      listItems.push(
        renderFallbackListItem(cleanLine, itemKey, () =>
          this.handleSuggestionClick(annotation),
        ),
      );
    }
  }

  private renderAnnotationAsFilter(
    annotationText: string,
    annotation: components["schemas"]["context-annotation"],
    itemKey: string,
    listItems: JSX.Element[],
  ) {
    const { hasFilters, selectedFilter } = hasCategoricalFilters(annotation);

    if (hasFilters && selectedFilter) {
      const isSelected = this.appliedSuggestionFilters.has(annotationText);
      listItems.push(
        renderToggleButton(
          annotationText,
          isSelected,
          () => this.handleSuggestionClick(annotation, annotationText),
          itemKey,
        ),
      );
    } else {
      listItems.push(
        renderFallbackListItem(annotationText, itemKey, () =>
          this.handleSuggestionClick(annotation),
        ),
      );
    }
  }

  private renderSuggestionItem(
    content: string,
    annotations: components["schemas"]["context-annotation"][],
    key: string,
  ) {
    if (!annotations || annotations.length === 0) {
      return renderListItem(content, key);
    }

    const listItems: JSX.Element[] = [];
    let currentIndex = 0;

    // Process each annotation to create separate list items
    annotations.forEach((annotation, idx) => {
      const { locator } = annotation;

      // Add text before annotation as plain list item if not empty
      if (currentIndex < locator.start) {
        const plainText = content.substring(currentIndex, locator.start).trim();
        if (plainText) {
          listItems.push(renderListItem(plainText, `plain-${key}-${idx}`));
        }
      }

      const dataItems = extractDataItems(annotation);

      const annotationText = content.substring(
        locator.start,
        locator.start + locator.length,
      );

      // Render individual products or fallback to full annotation
      if (dataItems.length > 0) {
        this.renderDataItemsAnnotation(
          dataItems,
          annotationText,
          annotation,
          key,
          idx,
          listItems,
        );
      } else {
        this.renderPlainAnnotation(
          annotationText,
          annotation,
          key,
          idx,
          listItems,
        );
      }

      currentIndex = locator.start + locator.length;
    });

    // Add remaining text as plain list item if not empty
    if (currentIndex < content.length) {
      const remainingText = content.substring(currentIndex).trim();
      if (remainingText) {
        listItems.push(renderListItem(remainingText, `remaining-${key}`));
      }
    }

    return listItems;
  }

  private renderStreamItems() {
    return (
      <ul class="suggestions-list" part="suggestions-list">
        {this.stream.items.map((item, index) => {
          if (item.role !== "assistant" || !item.parts) return null;

          return item.parts.map((part, partIndex) => {
            if (part.text?.content) {
              return this.renderSuggestionItem(
                part.text.content,
                part.text.annotations || [],
                index + "-" + partIndex,
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
      >
        <div class="container" part="container">
          <div class="header" part="header">
            <div class="icon" part="icon">
              <slot name="vviinn-suggestions-icon">{<SparkIcon />}</slot>
            </div>
            <h3 class="title" part="title">
              <slot name="vviinn-suggestions-title">
                {i18next.t("suggestions.title")}
              </slot>
            </h3>
          </div>
          <div class="description" part="description">
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
