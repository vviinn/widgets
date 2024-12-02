import { Component, Host, h, Prop, Event, EventEmitter } from "@stencil/core";
import { FiltersIcon } from "../vviinn-icons";

/**
 *
 * @part extended-filters-button - Button to open the modal.
 */
@Component({
  tag: "vviinn-extended-filters-button",
  styleUrl: "vviinn-filters.css",
  shadow: true,
})
export class VviinnExtendedFiltersButton {
  @Prop() handleClick: () => void;

  /** The filters received */
  @Event({ bubbles: true })
  extendedFiltersButtonClicked: EventEmitter;

  render() {
    return (
      <Host exportparts="extended-filters-button">
        <button
          class="filters-more-button"
          onClick={() => {
            this.extendedFiltersButtonClicked.emit();
          }}
          part="extended-filters-button"
        >
          <FiltersIcon />
        </button>
      </Host>
    );
  }
}
