import { Component, Host, Prop, h, Element } from "@stencil/core";
import i18next from "i18next";
import {
  EnergyCertification,
  EnergyCertificationClassIconDirection,
} from "../../../interfaces/recommendation";
import { slotChangeListener } from "../../customized-slots";

/**
 * @part energy-label-container - Energy label container.
 * @part energy-label-icon - Icon with an energy class.
 * @part energy-label-product-type - Product type.
 * @part energy-label-data-sheet-link - Data sheet link.
 *
 * @slot energy-label-data-sheet-text - Data sheet link's text.
 */

@Component({
  tag: "vviinn-energy-label",
  styleUrl: "vviinn-energy-label.css",
  shadow: true,
})
export class VviinnEnergyLabel {
  @Element() el: HTMLElement;
  @Prop() energyCertification?: EnergyCertification;
  @Prop() iconDirection: EnergyCertificationClassIconDirection = "right";

  /** @internal */
  @Prop() productClickHandler: (e: MouseEvent) => void;

  componentWillLoad() {
    slotChangeListener(this, this.el);
  }

  private labelClickHandler = (e: MouseEvent) => {
    if (this.energyCertification?.classLabelUrl) {
      e.preventDefault();
      window.open(
        this.energyCertification.classLabelUrl,
        "_blank",
        "noopener noreferrer"
      );
    } else this.productClickHandler(e);
  };

  render() {
    return (
      <Host
        class={{
          hidden:
            !this.energyCertification?.classIconUrls &&
            !this.energyCertification?.productType &&
            !this.energyCertification?.classDataSheetUrl,
        }}
        exportparts="energy-label-container, energy-label-icon, energy-label-product-type, energy-label-data-sheet-link"
      >
        <div class="container" part="energy-label-container">
          <a
            class="class-label-link"
            href={this.energyCertification?.classLabelUrl}
            onClick={this.labelClickHandler}
          >
            {!!this.energyCertification?.classIconUrls && (
              <img
                class="class-label-icon"
                part="energy-label-icon"
                src={this.energyCertification.classIconUrls[this.iconDirection]}
              />
            )}
          </a>

          <div class="info-container">
            {this.energyCertification?.productType && (
              <span class="product-type" part="energy-label-product-type">
                {this.energyCertification.productType}
              </span>
            )}
            {this.energyCertification?.classDataSheetUrl && (
              <a
                class="data-sheet-link"
                part="energy-label-data-sheet-link"
                href={this.energyCertification.classDataSheetUrl}
                target="_blank"
                rel="noopener noreferrer"
              >
                <span slot="energy-label-data-sheet-text">
                  {i18next.t("energyLabel.dataSheetText")}
                </span>
              </a>
            )}
          </div>
        </div>
      </Host>
    );
  }
}
