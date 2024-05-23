import { Component, Host, Prop, h, Element } from "@stencil/core";
import { searchState } from "../../store/search.store";
import { TextSearchIcon } from "../vviinn-icons";
import { slotChangeListener } from "../customized-slots";
import i18next from "i18next";

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

  @Prop() searchQuery: string;
  @Prop() setSearchQuery: (query: string) => void;
  @Prop() handleMultiSearch: () => void;

  componentWillLoad() {
    slotChangeListener(this, this.el);
  }

  handleInputChange(event: Event) {
    this.setSearchQuery((event.target as HTMLInputElement).value);
  }

  private handleKeyPress(event: KeyboardEvent) {
    if (event.key === "Enter") {
      this.handleMultiSearch();
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
          onClick={() => this.handleMultiSearch()}
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
