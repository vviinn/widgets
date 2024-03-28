import { Component, Host, h, State } from "@stencil/core";
import "../../store/imageSearch.store";
import { TextSearchIcon } from "../vviinn-icons";
import { performTextSearch } from "../../store/textSearch.store";

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

  handleInputChange(event: Event) {
    this.searchQuery = (event.target as HTMLInputElement).value;
  }

  private async handleSearch() {
    await performTextSearch(this.searchQuery);
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
        >
          <TextSearchIcon />
        </button>
      </Host>
    );
  }
}
