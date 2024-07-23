import {
  Component,
  Host,
  Prop,
  h,
  Element,
  Event,
  EventEmitter,
} from "@stencil/core";
import { makeTextSearchRequest, searchState } from "../../store/search.store";
import { TextSearchIcon } from "../vviinn-icons";
import { slotChangeListener } from "../customized-slots";
import i18next from "i18next";
import { TextSearchFinishedEventData } from "../../recommendation/events";

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

  @Event() textSearchFinished: EventEmitter<TextSearchFinishedEventData>;

  /** Vviinn customer’s token (required) */
  @Prop() token: string;

  /** @internal */
  @Prop() showInWidget: boolean = false;
  /** @internal */
  /** Query for the text search */
  @Prop({ mutable: true }) searchQuery: string;

  componentWillLoad() {
    slotChangeListener(this, this.el);
  }

  handleInputChange(event: Event) {
    this.setSearchQuery((event.target as HTMLInputElement).value);
  }

  private setSearchQuery = (query: string) => {
    this.searchQuery = query;
  };

  private async handleTextSearch() {
    if (!this.searchQuery) return;

    await makeTextSearchRequest(this.searchQuery, this.token);
    this.textSearchFinished.emit({
      searchQuery: this.searchQuery,
    });
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
          {searchState.loading && searchState.searchType === "text" ? (
            <vviinn-preloader />
          ) : (
            <slot name="vviinn-text-search-icon">
              <TextSearchIcon />
            </slot>
          )}
        </button>
      </Host>
    );
  }
}
