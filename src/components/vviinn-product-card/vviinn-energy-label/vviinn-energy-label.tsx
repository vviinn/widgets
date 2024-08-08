import { Component, Host, Prop, h } from "@stencil/core";
import {
  EnergyEfficiencyClass,
  MaxEnergyEfficiencyClass,
  MinEnergyEfficiencyClass,
} from "../../../interfaces/recommendation";
import { getEnergyLabel } from "./icons";

@Component({
  tag: "vviinn-energy-label",
  styleUrl: "vviinn-energy-label.css",
  shadow: true,
})
export class VviinnEnergyLabel {
  @Prop() energyEfficiencyClass: EnergyEfficiencyClass;
  @Prop() minEnergyEfficiencyClass: MinEnergyEfficiencyClass;
  @Prop() maxEnergyEfficiencyClass: MaxEnergyEfficiencyClass;
  @Prop() productType: string;

  private energyLabelIcon: SVGElement | null = null;

  connectedCallback() {
    this.energyLabelIcon = getEnergyLabel(
      this.energyEfficiencyClass,
      this.minEnergyEfficiencyClass,
      this.maxEnergyEfficiencyClass
    );
  }

  render() {
    return (
      <Host
        part="energy-label"
        class={{
          hidden: !this.energyLabelIcon,
        }}
      >
        <div class="container">
          {this.energyLabelIcon}
          <span class="product-type">{this.productType}</span>
        </div>
      </Host>
    );
  }
}
