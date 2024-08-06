import { Component, Host, Prop, h } from "@stencil/core";
import { getEnergyLabel } from "./icons";
import { EnergyEfficiencyClass } from "../../../interfaces/recommendation";

@Component({
  tag: "vviinn-energy-label",
  styleUrl: "vviinn-energy-label.css",
  shadow: true,
})
export class VviinnEnergyLabel {
  @Prop() energyEfficiencyClass: EnergyEfficiencyClass;
  @Prop() minEnergyEfficiencyClass: EnergyEfficiencyClass;
  @Prop() maxEnergyEfficiencyClass: EnergyEfficiencyClass;
  @Prop() productType: string;
  render() {
    return (
      <Host part="energy-label">
        <div class="container">
          {getEnergyLabel(
            this.energyEfficiencyClass,
            this.minEnergyEfficiencyClass,
            this.maxEnergyEfficiencyClass
          )}
          <span class="product-type">{this.productType}</span>
        </div>
      </Host>
    );
  }
}
