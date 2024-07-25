import {
  Component,
  Host,
  Prop,
  h,
  Element,
  Event,
  EventEmitter,
  Listen,
} from "@stencil/core";
import { makeTextSearchRequest, searchState } from "../../store/search.store";
import { CameraIcon, TextSearchIcon } from "../vviinn-icons";
import { slotChangeListener } from "../customized-slots";
import {
  SearchIdEvent,
  SearchIdEventData,
  TextSearchEventData,
} from "../../recommendation/events";
import i18next from "i18next";
import { Locale, resources } from "../../locale";
import { TextSearchMode } from "../../widget/types";

/**
 * @part text-search-input - Text search input.
 * @slot vviinn-text-search-icon - Icon of text search block.
 */
@Component({
  tag: "vviinn-text-search",
  styleUrl: "vviinn-text-search.css",
  shadow: true,
})
export class VviinnTextSearch {
  @Element() el: HTMLElement;

  /** A text search was initiated (used by the vviinn-results component) */
  @Event() vviinnTextSearchStarted: EventEmitter<TextSearchEventData>;

  /** @internal */
  /** A text search API response was received (used internally by vviinn-vps-widget) */
  @Event() vviinnTextSearchFinished: EventEmitter<TextSearchEventData>;
  /** @internal */
  @Event() vviinnSearchIdReceived: EventEmitter<SearchIdEventData>;

  /** Vviinn customer’s token (required) */
  @Prop() token: string;
  /** The locale for currency formatting and text localization */
  @Prop() locale: Locale = "de-DE";
  /** Default text search or text search with an image upload button */
  @Prop() mode: TextSearchMode = "text";

  /** @internal */
  /** API path passed from widget */
  @Prop() apiPath?: string = "https://api.vviinn.com";
  /** @internal */
  /** True, when used inside the widget */
  @Prop() showInWidget?: boolean = false;
  /** @internal */
  /** Query for the text search passed from widget */
  @Prop({ mutable: true }) searchQuery?: string;

  async componentWillLoad() {
    await i18next.init({
      lng: this.locale,
      fallbackLng: "en",
      resources,
    });
    slotChangeListener(this, this.el);
  }

  @Listen("vviinnImageUploadFinished")
  imageUploadFinished({ detail }: SearchIdEvent) {
    if (!this.showInWidget) {
      this.vviinnSearchIdReceived.emit({ searchId: detail.searchId });
    }
  }

  handleInputChange(event: Event) {
    this.setSearchQuery((event.target as HTMLInputElement).value);
  }

  private setSearchQuery = (query: string) => {
    this.searchQuery = query;
  };

  private async handleTextSearch() {
    if (!this.searchQuery) return;

    if (this.showInWidget) {
      await makeTextSearchRequest(this.searchQuery, this.token);
      this.vviinnTextSearchFinished.emit({ query: this.searchQuery });
    } else {
      this.vviinnTextSearchStarted.emit({
        query: this.searchQuery,
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
      <Host exportparts="text-search-input">
        <input
          class="text-search-input"
          part="text-search-input"
          type="text"
          placeholder={i18next.t("textSearchPlaceholder")}
          value={this.searchQuery}
          onInput={(event) => this.handleInputChange(event)}
          onKeyUp={(event) => this.handleKeyPress(event as KeyboardEvent)}
        />
        <button
          class="text-search-button"
          onClick={() => this.handleTextSearch()}
          disabled={searchState.loading}
        >
          {searchState.loading &&
          searchState.searchType === "text" &&
          this.showInWidget ? (
            <vviinn-preloader />
          ) : (
            <slot name="vviinn-text-search-icon">
              <TextSearchIcon />
            </slot>
          )}
        </button>

        {this.mode === "textAndImage" && (
          <vviinn-image-selector
            token={this.token}
            apiPath={this.apiPath}
            showInTextSearch={true}
          >
            <span slot="upload-button-text">
              <CameraIcon />
            </span>
          </vviinn-image-selector>
        )}
      </Host>
    );
  }
}
