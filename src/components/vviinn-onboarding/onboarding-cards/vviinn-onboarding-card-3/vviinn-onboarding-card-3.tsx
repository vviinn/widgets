import { Component, Host, h, Element, Prop } from "@stencil/core";
import { OnboardingCard3Icon } from "../../../vviinn-icons";
import { slotChangeListener } from "../../../customized-slots";

@Component({
  tag: "vviinn-onboarding-card-3",
  styleUrl: "../onboarding-card.css",
  shadow: true,
})
export class VviinnOnboardingCard3 {
  @Element() el: HTMLElement;
  @Prop() cardTitle: string;
  @Prop() cardText: string;

  componentWillLoad() {
    slotChangeListener(this, this.el);
  }

  render() {
    return (
      <Host>
        <slot name="onboarding-card-3-icon">
          <OnboardingCard3Icon />
        </slot>
        <slot name="onboarding-card-3-text">
          <div class="text">
            <h4>{this.cardTitle}</h4>
            <p>{this.cardText}</p>
          </div>
        </slot>
      </Host>
    );
  }
}
