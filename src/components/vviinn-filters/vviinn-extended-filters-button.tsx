import { Component, Host, h, Prop, Event, EventEmitter } from "@stencil/core";
import i18next from "i18next";
import { FiltersIcon } from "../vviinn-icons";
import { TriggerSourceEventData } from "../../recommendation/events";

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
  vviinnExtendedFiltersButtonClicked: EventEmitter<TriggerSourceEventData>;

  private buttonElement?: HTMLButtonElement;

  private handleButtonClick = () => {
    this.vviinnExtendedFiltersButtonClicked.emit({
      isTriggeredByVpsWidget: this.showInWidget,
      triggerElement: this.buttonElement,
    });
  };

  render() {
    return (
      <Host exportparts="extended-filters-button">
        <button
          ref={(el) => (this.buttonElement = el)}
          class="filters-more-button"
          onClick={this.handleButtonClick}
          part="extended-filters-button"
          aria-label={i18next.t("filters.a11y.openFilters")}
          type="button"
        >
          <FiltersIcon />
        </button>
      </Host>
    );
  }
}
