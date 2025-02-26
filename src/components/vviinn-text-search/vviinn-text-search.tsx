import {
  Component,
  Host,
  Prop,
  h,
  Element,
  Event,
  EventEmitter,
  State,
} from "@stencil/core";
import {
  makeTextSearchRequest,
  searchState,
  componentsState,
  SearchStoreName,
  SearchStore,
} from "../../store/search.store";
import { TextSearchIcon } from "../vviinn-icons";
import { slotChangeListener } from "../customized-slots";
import {
  ResetSelectedFiltersEventData,
  SearchIdEventData,
  TextSearchEventData,
  DynamicFilterInternalData,
  BasicEventData,
} from "../../recommendation/events";
import i18next from "i18next";
import { Locale, resources } from "../../locale";
import { SearchBarMode } from "../../widget/types";
import { TextSearchResponse } from "../../interfaces/search";
import * as E from "fp-ts/Either";
import { pipe } from "fp-ts/lib/function";
import { searchBarParts } from "../../cssParts";
import { MicIcon } from "../vviinn-icons/icons/MicIcon";
import { initializeRecognition, speechTooltip } from "./helpers";
import Timeout = NodeJS.Timeout;
import { DefaultApi, WidgetEvent } from "vviinn-tracking-client-ts";
import { createWidgetEvent } from "../../tracking";
import { updateGlobalState } from "../../store/store";

/**
 * @part text-search-container - Container for the text search block.
 * @part text-search-input - Text search input.
 * @part text-search-tooltip - Text search tooltip.
 * @part text-search-button - Text search input's search button.
 * @slot vviinn-text-search-icon - Icon of the text search block.
 * @part speech-button - Speech recognition button.
 * @slot vviinn-text-search-actions - Additional actions for the text search block, e.g., a button to open the Search Modal.
 */
@Component({
  tag: "vviinn-text-search",
  styleUrl: "vviinn-text-search.css",
  shadow: true,
})
export class VviinnTextSearch {
  @Element() el: HTMLElement;

  /** An image search ID was received (used by vviinn-results component) */
  @Event() vviinnImageUploadFinished: EventEmitter<SearchIdEventData>;
  /** A filter was triggered */
  @Event() vviinnFilterTriggered: EventEmitter<DynamicFilterInternalData>;

  /** A text search was initiated (used by vviinn-results component) */
  /** @internal */
  @Event() vviinnTextSearchStarted: EventEmitter<TextSearchEventData>;

  /** A text search response was received (used internally by vviinn-vps-widget) */
  /** @internal */
  @Event() widgetTextSearchFinished: EventEmitter<TextSearchEventData>;

  /** A search response was received by vviinn-results (used internally for showing preloader) */
  /** @internal */
  @Event() resultsSearchFinished: EventEmitter;

  /** Selected filters should be resetted */
  /** @internal */
  @Event({ bubbles: true })
  vviinnSelectedFiltersReset: EventEmitter<ResetSelectedFiltersEventData>;

  /** Vviinn customer’s token (required) */
  @Prop() token: string;
  /** The locale for currency formatting and text localization */
  @Prop() locale: Locale = "de-DE";
  /** Basic or extended text search with search modal and speech recognition */
  @Prop() mode: SearchBarMode = "basic";
  /** Query for the text search passed from widget */
  @Prop({ mutable: true }) searchQuery?: string;
  /** Custom placeholder for the text search input */
  @Prop() placeholder?: string = "";

  /** True, when used inside the widget */
  /** @internal */
  @Prop() showInWidget?: boolean = false;
  /** @internal */
  @Prop() apiPath?: string = "https://api.vviinn.com";
  /** uiSessionId from vps-widget */
  /** @internal */
  @Prop() uiSessionId?: string;
  /** basicEventData from vps-widget */
  /** @internal */
  @Prop() basicEventData: BasicEventData;

  @State() isLoading = false;

  @State() isRecording = false;

  @State() showTooltip = false;

  private isShowPreloader = () =>
    this.state.loading && this.state.searchType === "text";

  private showLoader = () => (this.isLoading = true);
  private hideLoader = () => (this.isLoading = false);

  private isShowRecording = () => this.isRecording;
  private showRecording = () => (this.isRecording = true);
  private hideRecording = () => (this.isRecording = false);

  private setShowTooltip = (show: boolean) => {
    this.showTooltip = show;
  };

  private trackingApi?: DefaultApi;
  private state?: SearchStore;
  private storeName?: SearchStoreName;

  private triggerTooltipStart: Timeout;
  private triggerTooltipEnd: Timeout;

  private tooltipText = speechTooltip();
  private getPlaceholderText = () =>
    this.isShowRecording()
      ? i18next.t("speechRecognition.placeholder")
      : this.placeholder.length
        ? this.placeholder
        : i18next.t("textSearchPlaceholder");

  private recognition = initializeRecognition(
    this.locale,
    () => {
      this.showRecording();
      this.setShowTooltip(false);
      clearTimeout(this.triggerTooltipStart);
    },
    this.hideRecording,
    (speechResult) => {
      this.setSearchQuery(speechResult);
      this.handleTextSearch();
    },
  );

  connectedCallback() {
    this.storeName = this.showInWidget ? "widget" : "components";
    this.state = this.showInWidget ? searchState : componentsState;

    updateGlobalState({
      apiPath: this.apiPath,
      token: this.token,
      locale: this.locale,
    });

    document.addEventListener("resultsSearchFinished", this.hideLoader);
    document.addEventListener(
      "vviinnFilterTriggered",
      this.filterTriggeredHandler,
    );
  }

  disconnectedCallback() {
    document.removeEventListener("resultsSearchFinished", this.hideLoader);
    document.removeEventListener(
      "vviinnFilterTriggered",
      this.filterTriggeredHandler,
    );

    clearTimeout(this.triggerTooltipStart);
    clearTimeout(this.triggerTooltipEnd);
  }

  private filterTriggeredHandler = ({
    detail,
  }: CustomEvent<DynamicFilterInternalData>) => {
    const { action, customTrigger } = detail;
    if (action === "deselect" && customTrigger === "TPS") {
      this.searchQuery = "";
    }
  };

  private trackTextSearch = () =>
    this.vviinnFilterTriggered.emit({
      kind: this.searchQuery,
      action: "select",
      customTrigger: "TPS",
      isTriggeredByVpsWidget: this.showInWidget,
    });

  async componentWillLoad() {
    await i18next.init({
      lng: this.locale,
      fallbackLng: "en",
      resources,
    });
    slotChangeListener(this, this.el);
    if (!this.showInWidget && this.searchQuery?.length > 0) {
      this.showLoader();
      this.vviinnTextSearchStarted.emit({
        query: this.searchQuery,
        isTriggeredByVpsWidget: this.showInWidget,
      });
      this.trackTextSearch();
    }
  }

  handleInputChange(event: Event) {
    this.setSearchQuery((event.target as HTMLInputElement).value);
  }

  private setSearchQuery = (query: string) => {
    this.searchQuery = query;
  };

  private async handleSpeech() {
    if (this.isRecording) {
      this.recognition.stop();
      this.hideRecording();
      this.setShowTooltip(false);
    } else {
      this.recognition.start();
      this.setSearchQuery("");
      this.triggerTooltipStart = setTimeout(() => {
        if (!this.isRecording) {
          this.setShowTooltip(true);
          this.triggerTooltipEnd = setTimeout(() => {
            this.setShowTooltip(false);
          }, 5000);
        }
      }, 1000);
    }
  }

  private async handleTextSearch() {
    if (!this.searchQuery) return;
    this.trackTextSearch();
    if (this.showInWidget) {
      if (this.basicEventData && this.uiSessionId) {
        const { campaignTypeId, ...rest } = this.basicEventData;
        const textSearchStartedEvent: WidgetEvent = createWidgetEvent("TPS")({
          action: "search",
          session_id: this.uiSessionId,
          ...rest,
        });
        this.trackingApi.trackEvent(textSearchStartedEvent);
      }

      const response = pipe(
        await makeTextSearchRequest(this.storeName, this.searchQuery),
        E.getOrElse(() => null),
        (response: TextSearchResponse) => response,
      );

      if (response) {
        this.widgetTextSearchFinished.emit({
          query: this.searchQuery,
          requestId: response.requestId,
        });

        this.vviinnSelectedFiltersReset.emit({
          isTriggeredByVpsWidget: this.showInWidget,
        });
      }
    } else {
      this.showLoader();
      this.vviinnTextSearchStarted.emit({
        query: this.searchQuery,
        isTriggeredByVpsWidget: this.showInWidget,
      });
    }
  }

  private handleKeyPress(event: KeyboardEvent) {
    if (event.key === "Enter") {
      this.handleTextSearch();
    }
  }

  render() {
    return (
      <Host exportparts={searchBarParts}>
        <div class="text-search-container" part="text-search-container">
          <input
            class="text-search-input"
            part="text-search-input"
            type="text"
            placeholder={this.getPlaceholderText()}
            value={this.searchQuery}
            onInput={(event) => this.handleInputChange(event)}
            onKeyUp={(event) => this.handleKeyPress(event as KeyboardEvent)}
          />

          {this.mode === "extended" && (
            <vviinn-vps-button
              token={this.token}
              locale={this.locale}
              addStyle={false}
              useComponentsStore={true}
              apiPath={this.apiPath}
            />
          )}

          {this.mode === "basic" && (
            <slot name="vviinn-text-search-actions"></slot>
          )}

          {(this.mode === "extended" || this.showInWidget) &&
            this.recognition && (
              <button
                class="speech-button"
                part="speech-button"
                onClick={() => this.handleSpeech()}
              >
                <MicIcon />
                {this.isShowRecording() && (
                  <span class="recording-indicator"></span>
                )}
              </button>
            )}
          <button
            class="text-search-button"
            part="text-search-button"
            onClick={() => this.handleTextSearch()}
            disabled={this.state.loading}
          >
            {this.isShowPreloader() ? (
              <vviinn-preloader />
            ) : (
              <slot name="vviinn-text-search-icon">
                <TextSearchIcon />
              </slot>
            )}
          </button>
        </div>
        {this.showTooltip && (
          <p class="text-search-tooltip" part="text-search-tooltip">
            {i18next.t(this.tooltipText)}
          </p>
        )}
      </Host>
    );
  }
}
