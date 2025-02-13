import { Component, Host, h, Prop, Event, EventEmitter } from "@stencil/core";
import { FiltersIcon } from "../vviinn-icons";
import { ExtendedFiltersButtonClickedEventData } from "../../recommendation/events";

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
  @Prop() showInWidget?: boolean = false;

  @Event({ bubbles: true })
  vviinnExtendedFiltersButtonClicked: EventEmitter<ExtendedFiltersButtonClickedEventData>;

  render() {
    return (
      <Host exportparts="extended-filters-button">
        <button
          class="filters-more-button"
          onClick={() => {
            this.vviinnExtendedFiltersButtonClicked.emit({
              isTriggeredByVpsWidget: this.showInWidget,
            });
          }}
          part="extended-filters-button"
        >
          <FiltersIcon />
        </button>
      </Host>
    );
  }
}
