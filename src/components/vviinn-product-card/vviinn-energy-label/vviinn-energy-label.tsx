import { Component, Host, Prop, h, Element } from "@stencil/core";
import i18next from "i18next";
import {
  EnergyCertification,
  EnergyClassIconDirection,
} from "../../../interfaces";
import { slotChangeListener } from "../../customized-slots";
import { energyLabelParts } from "../../../cssParts";

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
  @Prop() classIconUrls?: EnergyCertification["classIconUrls"];
  @Prop() productType?: EnergyCertification["productType"];
  @Prop() classDataSheetUrl?: EnergyCertification["classDataSheetUrl"];
  @Prop() iconDirection: EnergyClassIconDirection = "right";
  @Prop() certificationClass?: EnergyCertification["certificationClass"];
  @Prop() classRange?: EnergyCertification["classRange"];

  componentWillLoad() {
    slotChangeListener(this, this.el);
  }

  private getEnergyIconAltText(): string {
    if (
      !!this.certificationClass &&
      !!this.classRange?.min &&
      !!this.classRange?.max
    ) {
      return i18next.t("energyLabel.iconAltWithClass", {
        energyClass: this.certificationClass,
        minClass: this.classRange.min,
        maxClass: this.classRange.max,
      });
    }

    if (!!this.certificationClass) {
      return i18next.t("energyLabel.iconAltWithClassOnly", {
        energyClass: this.certificationClass,
      });
    }

    return i18next.t("energyLabel.iconAlt");
  }

  render() {
    return (
      <Host
        class={{
          hidden:
            !this.classIconUrls && !this.productType && !this.classDataSheetUrl,
        }}
        exportparts={energyLabelParts}
      >
        <div class="container" part="energy-label-container">
          {!!this.classIconUrls && (
            <img
              class="class-label-icon"
              part="energy-label-icon"
              src={this.classIconUrls[this.iconDirection]}
              alt={this.getEnergyIconAltText()}
            />
          )}

          {(this.productType || this.classDataSheetUrl) && (
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
          )}
        </div>
      </Host>
    );
  }
}
