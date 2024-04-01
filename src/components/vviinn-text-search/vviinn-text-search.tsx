import {
  Component,
  Host,
  Prop,
  h,
  State,
  Event,
  EventEmitter,
  Element,
} from "@stencil/core";
import { performTextSearch, searchState } from "../../store/search.store";
import { TextSearchIcon } from "../vviinn-icons";
import { slotChangeListener } from "../customized-slots";
import i18next from "i18next";

/**
 * @part text-search - Text search block with input and button.
 * @slot vviinn-text-search-icon - Icon of text search block.
 */
@Component({
  tag: "vviinn-text-search",
  styleUrl: "vviinn-text-search.css",
  shadow: true,
})
export class VviinnTextSearch {
  @Element() el: HTMLElement;

  @Prop() clearSearchQuery: boolean = false;
  @Prop() initialSearchQuery: string = "";

  @State() searchQuery: string = this.initialSearchQuery;

  @Event() vviinnTextSearchFinished: EventEmitter;

  componentWillLoad() {
    slotChangeListener(this, this.el);
  }

  handleInputChange(event: Event) {
    this.searchQuery = (event.target as HTMLInputElement).value;
  }

  private handleKeyPress(event: KeyboardEvent) {
    if (event.key === "Enter") {
      this.handleSearch();
    }
  }

  private async handleSearch() {
    if (!this.searchQuery) return;

    await performTextSearch(this.searchQuery);
    this.vviinnTextSearchFinished.emit(this.searchQuery);

    if (this.clearSearchQuery) {
      this.searchQuery = "";
    }
  }

  render() {
    return (
      <Host part="text-search">
        <input
          class="text-search-input"
          type="text"
          placeholder={i18next.t("textSearchPlaceholder")}
          value={this.searchQuery}
          onInput={(event) => this.handleInputChange(event)}
          onKeyUp={(event) => this.handleKeyPress(event as KeyboardEvent)}
        />
        <button
          class="text-search-button"
          onClick={() => this.handleSearch()}
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
