import { Component, Host, Prop, h } from "@stencil/core";
import {
  EnergyCertification,
  EnergyCertificationClassIconDirection,
} from "../../../interfaces/recommendation";

@Component({
  tag: "vviinn-energy-label",
  styleUrl: "vviinn-energy-label.css",
  shadow: true,
})
export class VviinnEnergyLabel {
  @Prop() labelLink?: string = null;
  @Prop() energyCertification?: EnergyCertification;
  @Prop() classIconDirection: EnergyCertificationClassIconDirection = "right";

  /** @internal */
  @Prop() productClickHandler: (e: MouseEvent) => void;

  private labelClickHandler = (e: MouseEvent) => {
    if (this.labelLink) {
      e.preventDefault();
      window.open(this.labelLink, "_blank", "noopener noreferrer");
    } else this.productClickHandler(e);
  };

  render() {
    return (
      <Host
        part="energy-label"
        class={{
          hidden:
            !this.energyCertification?.classIconUrls &&
            !this.energyCertification?.productType &&
            !this.energyCertification?.classDataSheetUrl,
        }}
      >
        <div class="container">
          <a
            class="label-link"
            href={this.labelLink}
            onClick={this.labelClickHandler}
          >
            {!!this.energyCertification?.classIconUrls && (
              <img
                src={
                  this.energyCertification.classIconUrls[
                    this.classIconDirection
                  ]
                }
              />
            )}
          </a>

          <div class="info-container">
            {this.energyCertification?.productType && (
              <span class="product-type">
                {this.energyCertification.productType}
                Machine
              </span>
            )}
            {this.energyCertification?.classDataSheetUrl && (
              <a
                class="energy-efficiency-certificate"
                href={this.energyCertification.classDataSheetUrl}
                target="_blank"
                rel="noopener noreferrer"
              >
                Documentation
              </a>
            )}
          </div>
        </div>
      </Host>
    );
  }
}
