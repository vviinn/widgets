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
import * as E from "fp-ts/Either";
import { pipe } from "fp-ts/lib/function";
import { version } from "../../../package.json";
import {
  makeAutoSuggestRequest,
  makeTextSearchRequest,
  setTextSearchQuery,
  SearchStoreName,
  SearchStore,
  useSearchStore,
} from "../../store/search.store";
import { TextSearchIcon } from "../vviinn-icons";
import { slotChangeListener } from "../customized-slots";
import {
  SearchIdEventData,
  TextSearchEventData,
  DynamicFilterInternalData,
  BasicEventData,
  TriggerSourceEventData,
  RedirectEventData,
  RedirectSource,
} from "../../recommendation/events";
import i18next from "i18next";
import { Locale, initializeLocale } from "../../locale";
import { SearchBarMode, VisualSearchMode } from "../../widget/types";
import { TextSearchResponse, QueryCompletion } from "../../interfaces";
import { searchBarParts, searchModalFirstScreenParts } from "../../cssParts";
import { findSlotElements } from "../../dom";
import { MicIcon } from "../vviinn-icons/icons/MicIcon";
import {
  createAutoSuggestHandler,
  handleSuggestionsKeyDown,
  initializeRecognition,
  renderSuggestions,
  speechTooltip,
} from "./helpers";
import Timeout = NodeJS.Timeout;
import { defaultConfig } from "../../store/store";
import { campaignTypeNames } from "../../campaign/Campaign";
import { addIfNotEmpty } from "../../utils/collections/collectionsUtils";
import {
  isOnResultsPage,
  buildTextSearchRedirectUrl,
  parseResultsPageParamNames,
} from "../../helpers/url/resultsPageUrl";
import { navigateTo } from "../../helpers/navigation/navigateTo";

/**
 * @part text-search-container - Container for the text search block.
 * @part text-search-input - Text search input.
 * @part text-search-tooltip - Text search tooltip.
 * @part text-search-button - Text search input's search button.
 * @part speech-button - Speech recognition button.
 * @part suggestions-container - Auto-suggest dropdown container.
 * @part suggestion-item - Individual auto-suggest item.
 * @part close-button - Close Button in the search modal's header.
 * @part secondary-action - Back Button in the search modal's header.
 * @part upload-photo_button - Upload Photo Button in the search modal.
 * @part start-camera_button - Start Camera Button in the search modal.
 * @part vviinn-button - Visual search button element in the search bar (extended mode).
 * @slot vviinn-text-search-icon - Icon of the text search block.
 * @slot vviinn-text-search-actions - Additional actions for the text search block, e.g., a button to open the Search Modal.
 * @slot vviinn-teaser-text - Text on the search modal's main screen.
 * @slot vviinn-image-upload-button-text - Title of Upload Button in the search modal.
 * @slot vviinn-image-upload-icon - Icon of Upload Button in the search modal.
 * @slot vviinn-camera-button-text-start - Title of Start Camera button in the search modal.
 * @slot vviinn-camera-button-text-stop - Title of Stop Camera button in the search modal.
 * @slot vviinn-camera-icon - Icon of Camera Button in the search modal.
 * @slot vviinn-privacy-badge-text - Text content of privacy notification in the search modal.
 * @slot vviinn-image-search-modal-title - Search modal title.
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

  /** Selected filters should be resetted */
  /** @internal */
  @Event({ bubbles: true })
  vviinnSelectedFiltersReset: EventEmitter<TriggerSourceEventData>;

  /** Triggered when a text search request fails */
  @Event() vviinnNoResult: EventEmitter<BasicEventData>;

  /** A redirect URL is received from the API (can be intercepted by client) */
  @Event({
    cancelable: true,
    bubbles: true,
    composed: true,
  })
  vviinnRedirect: EventEmitter<RedirectEventData>;

  /** Vviinn customer's token (required) */
  @Prop() token: string;
  /** API endpoint URL (optional, defaults to production) */
  @Prop() apiPath?: string;
  /** Locale for text localization */
  @Prop() locale?: Locale;
  /** Basic or extended text search with search modal and speech recognition */
  @Prop() mode: SearchBarMode = "basic";
  /** Query for the text search passed from widget */
  @Prop() searchQuery?: string;
  /** Custom placeholder for the text search input */
  @Prop() placeholder?: string = "";
  /** URL of the results page for automatic search redirect. */
  @Prop() resultsPageUrl?: string;
  /** Custom URL param names for results page redirect. Default: "query=query&searchId=searchId". */
  @Prop() resultsPageParams?: string;
  /** Show auto-suggest dropdown with search completions */
  @Prop() autoSuggestShow: boolean = true;
  /** Example image shown in the visual search modal */
  @Prop() exampleImageSource?: string;
  /** URL to external CSS file for custom styling of the visual search modal */
  @Prop() cssUrl?: string | null;
  /** Visual search modal mode (modal/camera/upload) */
  @Prop() visualSearchMode?: VisualSearchMode;
  /** Accept image files dropped from the OS onto the upload button (desktop only) */
  @Prop() useDragAndDrop: boolean = false;

  /** True, when used inside the widget */
  /** @internal */
  @Prop() showInWidget: boolean = false;
  /** Search Bar is showing on first widget's screen */
  /** @internal */
  @Prop() showOnFirstScreen: boolean = false;
  /** uiSessionId from vps-widget */
  /** @internal */
  @Prop() uiSessionId?: string;
  /** basicEventData from vps-widget */
  /** @internal */
  @Prop() basicEventData: BasicEventData;

  @State() isRecording = false;
  @State() showTooltip = false;
  @State() autoSuggestCompletions: QueryCompletion[] = [];
  @State() activeSuggestionIndex = -1;
  private originalQuery = "";
  private searchSubmitted = false;
  private isDisconnected = false;
  private slots: HTMLSlotElement[] = [];

  private isShowPreloader = () =>
    this.state.searchStatus === "loading" && this.state.searchType === "text";

  private isShowRecording = () => this.isRecording;
  private showRecording = () => (this.isRecording = true);
  private hideRecording = () => (this.isRecording = false);

  private setShowTooltip = (show: boolean) => {
    this.showTooltip = show;
  };

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

  private recognition: ReturnType<typeof initializeRecognition> | null = null;
  private autoSuggestHandler: ReturnType<typeof createAutoSuggestHandler>;

  connectedCallback() {
    const { state, storeName } = useSearchStore(this.showInWidget);
    this.state = state;
    this.storeName = storeName;
    this.isDisconnected = false;
  }

  disconnectedCallback() {
    this.isDisconnected = true;
    clearTimeout(this.triggerTooltipStart);
    clearTimeout(this.triggerTooltipEnd);
    this.autoSuggestHandler?.cleanup();
  }

  private setAutoSuggestCompletions = (completions: QueryCompletion[]) => {
    if (this.isDisconnected) return;
    if (this.searchSubmitted && completions.length > 0) return;
    this.autoSuggestCompletions = completions;
    this.activeSuggestionIndex = -1;
  };

  private trackTextSearch = () =>
    this.vviinnFilterTriggered.emit({
      kind: this.state.textSearchQuery,
      action: "select",
      customTrigger: "TPS",
      isTriggeredByVpsWidget: this.showInWidget,
    });

  private getBasicEventData = (): BasicEventData => {
    if (this.showInWidget && this.basicEventData) {
      return this.basicEventData;
    }
    return {
      campaignTypeId: "TPS",
      campaignTypeName: campaignTypeNames["TPS"],
      widgetVersion: version,
      ...addIfNotEmpty("widgetId", this.el.id),
    };
  };

  async componentWillLoad() {
    await initializeLocale(this.locale);
    slotChangeListener(this, this.el);
    this.slots = findSlotElements(this.el);

    if (this.autoSuggestShow) {
      this.autoSuggestHandler = createAutoSuggestHandler(
        this.storeName,
        this.token,
        this.apiPath,
        this.setAutoSuggestCompletions,
      );
    }

    this.recognition = initializeRecognition(
      this.locale ?? defaultConfig.locale,
      () => {
        this.showRecording();
        this.setShowTooltip(false);
        clearTimeout(this.triggerTooltipStart);
      },
      this.hideRecording,
      (speechResult) => {
        setTextSearchQuery(this.storeName, speechResult);
        this.handleTextSearch();
      },
    );

    if (this.searchQuery?.length > 0) {
      setTextSearchQuery(this.storeName, this.searchQuery);
    }

    if (!this.showInWidget && this.searchQuery?.length > 0) {
      this.vviinnTextSearchStarted.emit({
        query: this.searchQuery,
        isTriggeredByVpsWidget: this.showInWidget,
      });
      this.trackTextSearch();
    }
  }

  private handleInputChange(event: Event) {
    this.searchSubmitted = false;
    const value = (event.target as HTMLInputElement).value;
    if (this.autoSuggestShow) {
      this.autoSuggestHandler.handleInputChange(value);
    } else {
      setTextSearchQuery(this.storeName, value);
    }
  }

  private handleSpeech = async () => {
    if (!this.recognition) return;

    if (this.isRecording) {
      this.recognition.stop();
      this.hideRecording();
      this.setShowTooltip(false);
    } else {
      this.recognition.start();
      setTextSearchQuery(this.storeName, null);
      this.triggerTooltipStart = setTimeout(() => {
        if (!this.isRecording) {
          this.setShowTooltip(true);
          this.triggerTooltipEnd = setTimeout(() => {
            this.setShowTooltip(false);
          }, 5000);
        }
      }, 1000);
    }
  };

  private hideSuggestions = () => {
    this.autoSuggestCompletions = [];
    this.activeSuggestionIndex = -1;
  };

  private selectSuggestion = (completion: QueryCompletion) => {
    setTextSearchQuery(this.storeName, completion.suggestion);
    this.hideSuggestions();

    if (completion.url) {
      this.trackTextSearch();
      this.handleTextSearchRedirect(
        completion.url,
        "auto-suggest",
        completion.suggestion,
      );
      return;
    }

    this.handleTextSearch(true);
  };

  private handleTextSearch = async (skipAutoSuggest = false) => {
    const queryToUse = this.state.textSearchQuery;
    if (!queryToUse) return;

    this.searchSubmitted = true;
    this.autoSuggestHandler?.cancelPending();
    this.hideSuggestions();
    if (!skipAutoSuggest) {
      await this.checkAutoSuggest(queryToUse);
      this.hideSuggestions();
    }

    this.trackTextSearch();

    const autoSuggestRedirect = this.state.redirect;
    const hasAutoSuggestRedirect =
      autoSuggestRedirect?.url && autoSuggestRedirect.query === queryToUse;

    if (hasAutoSuggestRedirect) {
      this.handleTextSearchRedirect(
        autoSuggestRedirect.url,
        "auto-suggest",
        queryToUse,
      );
      return;
    }

    const shouldRedirectToResultsPage =
      this.resultsPageUrl &&
      !this.showInWidget &&
      !isOnResultsPage(this.resultsPageUrl);

    if (shouldRedirectToResultsPage) {
      const redirectUrl = buildTextSearchRedirectUrl(
        this.resultsPageUrl,
        queryToUse,
        parseResultsPageParamNames(this.resultsPageParams).query,
      );
      this.handleTextSearchRedirect(redirectUrl, "text-search", queryToUse);
      return;
    }

    this.vviinnTextSearchStarted.emit({
      query: queryToUse,
      isTriggeredByVpsWidget: this.showInWidget,
    });

    if (this.showInWidget && this.showOnFirstScreen) {
      pipe(
        await makeTextSearchRequest(this.storeName, queryToUse, this.token, {
          apiPath: this.apiPath,
        }),
        E.fold(
          () => {
            this.vviinnNoResult.emit(this.getBasicEventData());
          },
          (response: TextSearchResponse) => {
            this.widgetTextSearchFinished.emit({
              query: queryToUse,
              requestId: response.requestId,
            });

            this.vviinnSelectedFiltersReset.emit({
              isTriggeredByVpsWidget: this.showInWidget,
            });
          },
        ),
      );
    }
  };

  private checkAutoSuggest = async (query: string) => {
    pipe(
      await makeAutoSuggestRequest(
        this.storeName,
        query,
        this.token,
        this.apiPath,
        this.setAutoSuggestCompletions,
      ),
      E.fold(
        // Intentionally ignore errors for auto-suggest
        () => {},
        () => {},
      ),
    );
  };

  private handleKeyDown = (event: KeyboardEvent) => {
    if (!this.autoSuggestShow) {
      if (event.key === "Enter") this.handleTextSearch();
      return;
    }

    handleSuggestionsKeyDown(event, {
      completions: this.autoSuggestCompletions,
      activeSuggestionIndex: this.activeSuggestionIndex,
      originalQuery: this.originalQuery,
      storeName: this.storeName,
      textSearchQuery: this.state.textSearchQuery,
      onActiveIndexChange: (index) => (this.activeSuggestionIndex = index),
      onOriginalQueryChange: (query) => (this.originalQuery = query),
      onSelectSuggestion: this.selectSuggestion,
      onHideSuggestions: this.hideSuggestions,
      onSearch: this.handleTextSearch,
    });
  };

  private handleButtonKeyDown = (event: KeyboardEvent, action: () => void) => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      action();
    }
  };

  private handleTextSearchRedirect(
    url: string,
    source: RedirectSource,
    query: string,
  ) {
    const redirectData: RedirectEventData = {
      ...this.getBasicEventData(),
      url,
      source,
      query,
    };
    const event = this.vviinnRedirect.emit(redirectData);

    if (event.defaultPrevented) {
      this.state.redirect = null;
      return;
    } else {
      navigateTo(url);
    }
  }

  render() {
    return (
      <Host exportparts={`${searchBarParts}, ${searchModalFirstScreenParts}`}>
        <div class="text-search-container" part="text-search-container">
          <input
            class="text-search-input"
            part="text-search-input"
            type="text"
            placeholder={this.getPlaceholderText()}
            value={this.state.textSearchQuery || ""}
            onInput={(event) => this.handleInputChange(event)}
            onKeyDown={this.handleKeyDown}
            onBlur={this.autoSuggestShow ? this.hideSuggestions : undefined}
            {...(this.autoSuggestShow && {
              role: "combobox",
              "aria-autocomplete": "list",
              "aria-expanded":
                this.autoSuggestCompletions.length > 0 &&
                !!this.state.textSearchQuery
                  ? "true"
                  : "false",
              "aria-controls": "suggestions-listbox",
              "aria-activedescendant":
                this.activeSuggestionIndex >= 0
                  ? `suggestion-${this.activeSuggestionIndex}`
                  : undefined,
            })}
          />

          {this.mode === "extended" && (
            <vviinn-vps-button
              token={this.token}
              locale={this.locale}
              apiPath={this.apiPath}
              addStyle={false}
              showResultsInModal={false}
              resultsPageUrl={this.resultsPageUrl}
              resultsPageParams={this.resultsPageParams}
              {...(this.exampleImageSource && {
                exampleImageSource: this.exampleImageSource,
              })}
              {...(this.cssUrl != null && { cssUrl: this.cssUrl })}
              {...(this.visualSearchMode && { mode: this.visualSearchMode })}
              useDragAndDrop={this.useDragAndDrop}
              parentSlots={this.slots}
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
                aria-label={i18next.t("a11y.speechButton")}
                onClick={this.handleSpeech}
                onKeyDown={(event) =>
                  this.handleButtonKeyDown(event, this.handleSpeech)
                }
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
            onKeyDown={(event) =>
              this.handleButtonKeyDown(event, this.handleTextSearch)
            }
            disabled={this.state.searchStatus === "loading"}
            aria-label={i18next.t("a11y.textSearchButton")}
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
        {this.autoSuggestShow &&
          renderSuggestions(
            this.autoSuggestCompletions,
            this.state.textSearchQuery,
            this.activeSuggestionIndex,
            this.selectSuggestion,
          )}
        {this.showTooltip && (
          <p class="text-search-tooltip" part="text-search-tooltip">
            {i18next.t(this.tooltipText)}
          </p>
        )}
      </Host>
    );
  }
}
