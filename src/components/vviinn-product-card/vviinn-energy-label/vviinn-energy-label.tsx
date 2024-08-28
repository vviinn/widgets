import { Component, Host, Prop, h } from "@stencil/core";
import { EnergyEfficiencyClass } from "../../../interfaces/recommendation";
import { getEnergyLabel } from "./icons";

@Component({
  tag: "vviinn-energy-label",
  styleUrl: "vviinn-energy-label.css",
  shadow: true,
})
export class VviinnEnergyLabel {
  @Prop() energyEfficiencyClass: EnergyEfficiencyClass = "A";
  @Prop() minEnergyEfficiencyClass: EnergyEfficiencyClass = "A";
  @Prop() maxEnergyEfficiencyClass: EnergyEfficiencyClass = "G";
  @Prop() productType: string = "Moebel";
  @Prop() labelLink?: string = null;
  @Prop() documentationLink?: string = "#";

  /** @internal */
  @Prop() productClickHandler: (e: MouseEvent) => void;

  private energyLabelIcon: SVGElement | null = null;

  connectedCallback() {
    this.energyLabelIcon = getEnergyLabel(
      this.energyEfficiencyClass,
      this.minEnergyEfficiencyClass,
      this.maxEnergyEfficiencyClass
    );
  }

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
          hidden: !this.energyLabelIcon,
        }}
      >
        <div class="container">
          <a
            class="label-link"
            href={this.labelLink}
            onClick={this.labelClickHandler}
          >
            {this.energyLabelIcon}
          </a>
          <div class="info-container">
            {this.productType && (
              <span class="product-type">{this.productType}</span>
            )}
            {this.documentationLink && (
              <a
                class="energy-efficiency-certificate"
                href={this.documentationLink}
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
