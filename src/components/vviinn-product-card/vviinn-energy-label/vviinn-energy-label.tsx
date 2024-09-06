import { Component, Host, Prop, h, Element } from "@stencil/core";
import i18next from "i18next";
import {
  EnergyCertification,
  EnergyClassIconDirection,
} from "../../../interfaces/recommendation";
import { slotChangeListener } from "../../customized-slots";

/**
 * @part energy-label-container - Energy label container.
 * @part energy-label-icon - Icon with an energy class.
 * @part energy-label-product-type - Product type.
 * @part energy-label-data-sheet-link - Data sheet link.
 *
 * @slot vviinn-energy-label-data-sheet-text - Text of the data sheet link for the energy label.
 */

@Component({
  tag: "vviinn-energy-label",
  styleUrl: "vviinn-energy-label.css",
  shadow: true,
})
export class VviinnEnergyLabel {
  @Element() el: HTMLElement;
  @Prop() classLabelUrl?: EnergyCertification["classLabelUrl"];
  @Prop() classIconUrls?: EnergyCertification["classIconUrls"];
  @Prop() productType?: EnergyCertification["productType"];
  @Prop() classDataSheetUrl?: EnergyCertification["classDataSheetUrl"];
  @Prop() iconDirection: EnergyClassIconDirection = "right";

  /** @internal */
  @Prop() productClickHandler: (e: MouseEvent) => void;

  componentWillLoad() {
    slotChangeListener(this, this.el);
  }

  private labelClickHandler = (e: MouseEvent) => {
    if (this.classLabelUrl) {
      e.preventDefault();
      window.open(this.classLabelUrl, "_blank", "noopener noreferrer");
    } else this.productClickHandler(e);
  };

  render() {
    return (
      <Host
        class={{
          hidden:
            !this.classIconUrls && !this.productType && !this.classDataSheetUrl,
        }}
        exportparts="energy-label-container, energy-label-icon, energy-label-product-type, energy-label-data-sheet-link"
      >
        <div class="container" part="energy-label-container">
          {!!this.classIconUrls && (
            <a class="class-label-link" onClick={this.labelClickHandler}>
              <img
                class="class-label-icon"
                part="energy-label-icon"
                src={this.classIconUrls[this.iconDirection]}
              />
            </a>
          )}

          <div class="info-container">
            {this.productType && (
              <span class="product-type" part="energy-label-product-type">
                {this.productType}
              </span>
            )}
            {this.classDataSheetUrl && (
              <a
                class="data-sheet-link"
                part="energy-label-data-sheet-link"
                href={this.classDataSheetUrl}
                target="_blank"
                rel="noopener noreferrer"
              >
                <slot name="vviinn-energy-label-data-sheet-text">
                  {i18next.t("energyLabel.dataSheetText")}
                </slot>
              </a>
            )}
          </div>
        </div>
      </Host>
    );
  }
}
