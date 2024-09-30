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
import { SearchModalUploadIcon, TextSearchIcon } from "../vviinn-icons";
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
 * @slot vviinn-text-search-icon - Icon of the text search block.
 * @slot vviinn-text-search-actions - Additional actions for the text search block, e.g., a button to open the Search Modal.
 */
@Component({
  tag: "vviinn-text-search",
  styleUrl: "vviinn-text-search.css",
  shadow: true,
})
export class VviinnTextSearch {
  @Element() el: HTMLElement;

  /** A text search was initiated (used by vviinn-results component) */
  @Event() vviinnTextSearchStarted: EventEmitter<TextSearchEventData>;
  /** An image search ID was received (used by vviinn-results component) */
  @Event() vviinnSearchIdReceived: EventEmitter<SearchIdEventData>;

  /** A text search response was received (used internally by vviinn-vps-widget) */
  /** @internal */
  @Event() vviinnTextSearchFinished: EventEmitter<TextSearchEventData>;

  /** Vviinn customer’s token (required) */
  @Prop() token: string;
  /** The locale for currency formatting and text localization */
  @Prop() locale: Locale = "de-DE";
  /** Default text search or text search with an image upload button */
  @Prop() mode: TextSearchMode = "text";
  /** True, when used inside the widget */
  @Prop() showInWidget?: boolean = false;
  /** Query for the text search passed from widget */
  @Prop({ mutable: true }) searchQuery?: string;

  /** @internal */
  @Prop() apiPath?: string = "https://api.vviinn.com";

  async componentWillLoad() {
    await i18next.init({
      lng: this.locale,
      fallbackLng: "en",
      resources,
    });
    slotChangeListener(this, this.el);
  }

  async componentDidLoad() {
    if (this.showInWidget) return;

    this.searchQuery?.length > 0 &&
      this.vviinnTextSearchStarted.emit({
        query: this.searchQuery,
      });
  }

  @Listen("vviinnImageUploadFinished")
  imageUploadFinished({ detail }: SearchIdEvent) {
    if (!this.showInWidget && this.mode === "textAndUpload") {
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
      await makeTextSearchRequest(this.token, this.searchQuery);
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
          class={{
            "text-search-input": true,
            "text-search-input--with-icon": this.mode === "textAndUpload",
          }}
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

        {this.mode === "textAndUpload" ? (
          <vviinn-image-selector
            token={this.token}
            apiPath={this.apiPath}
            showInTextSearch={true}
          >
            <span slot="upload-button-text">
              <SearchModalUploadIcon />
            </span>
          </vviinn-image-selector>
        ) : (
          <slot name="vviinn-text-search-actions"></slot>
        )}
      </Host>
    );
  }
}
