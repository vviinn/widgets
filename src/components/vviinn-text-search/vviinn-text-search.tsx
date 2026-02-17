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
import { SearchBarMode } from "../../widget/types";
import { TextSearchResponse } from "../../interfaces";
import { searchBarParts } from "../../cssParts";
import { MicIcon } from "../vviinn-icons/icons/MicIcon";
import { initializeRecognition, speechTooltip } from "./helpers";
import Timeout = NodeJS.Timeout;
import { defaultConfig } from "../../store/store";
import { campaignTypeNames } from "../../campaign/Campaign";
import { addIfNotEmpty } from "../../utils/collections/collectionsUtils";
import {
  isOnResultsPage,
  buildTextSearchRedirectUrl,
} from "../../helpers/url/resultsPageUrl";

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
  @Prop({ mutable: true }) searchQuery?: string;
  /** Custom placeholder for the text search input */
  @Prop() placeholder?: string = "";
  /** URL of the results page for automatic search redirect. */
  @Prop() resultsPageUrl?: string;

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

  connectedCallback() {
    const { state, storeName } = useSearchStore(this.showInWidget);
    this.state = state;
    this.storeName = storeName;
  }

  disconnectedCallback() {
    clearTimeout(this.triggerTooltipStart);
    clearTimeout(this.triggerTooltipEnd);
  }

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

  handleInputChange(event: Event) {
    const value = (event.target as HTMLInputElement).value;
    setTextSearchQuery(this.storeName, value);
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

  private handleTextSearch = async () => {
    const queryToUse = this.state.textSearchQuery;
    if (!queryToUse) return;

    await this.checkAutoSuggest(queryToUse);

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
        await makeTextSearchRequest(
          this.storeName,
          queryToUse,
          this.token,
          this.apiPath,
        ),
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
      ),
      E.fold(
        // Intentionally ignore errors for auto-suggest
        () => {},
        () => {},
      ),
    );
  };

  private handleKeyPress(event: KeyboardEvent) {
    if (event.key === "Enter") {
      this.handleTextSearch();
    }
  }

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
      window.location.href = url;
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
            value={this.state.textSearchQuery || ""}
            onInput={(event) => this.handleInputChange(event)}
            onKeyUp={(event) => this.handleKeyPress(event as KeyboardEvent)}
          />

          {this.mode === "extended" && (
            <vviinn-vps-button
              token={this.token}
              locale={this.locale}
              apiPath={this.apiPath}
              addStyle={false}
              showResultsInModal={false}
              resultsPageUrl={this.resultsPageUrl}
              exportparts="vviinn-button"
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
            onClick={this.handleTextSearch}
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
        {this.showTooltip && (
          <p class="text-search-tooltip" part="text-search-tooltip">
            {i18next.t(this.tooltipText)}
          </p>
        )}
      </Host>
    );
  }
}
