import { Component, Host, h, State, Event, EventEmitter } from "@stencil/core";
import { performTextSearch, searchState } from "../../store/search.store";
import { TextSearchIcon } from "../vviinn-icons";

/**
 * @part button -  button look and feel
 */
@Component({
  tag: "vviinn-text-search",
  styleUrl: "vviinn-text-search.css",
  shadow: true,
})
export class VviinnTextSearch {
  @State() searchQuery: string = "";
  @Event() vviinnTextSearchFinished: EventEmitter;

  handleInputChange(event: Event) {
    this.searchQuery = (event.target as HTMLInputElement).value;
  }

  private async handleSearch() {
    if (!this.searchQuery) return;
    await performTextSearch(this.searchQuery);
    this.vviinnTextSearchFinished.emit();
    this.searchQuery = "";
  }

  render() {
    return (
      <Host exportparts="button">
        <input
          class="text-search-input"
          type="text"
          placeholder="Search by text"
          value={this.searchQuery}
          onInput={(event) => this.handleInputChange(event)}
        />
        <button
          type="submit"
          class="text-search-button"
          onClick={() => this.handleSearch()}
          disabled={searchState.loading}
        >
          {searchState.loading && searchState.searchType === "text" ? (
            <vviinn-preloader />
          ) : (
            <TextSearchIcon />
          )}
        </button>
      </Host>
    );
  }
}
