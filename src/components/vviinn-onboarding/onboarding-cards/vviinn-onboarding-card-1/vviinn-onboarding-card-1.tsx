import { Component, Host, h, Element, Prop } from "@stencil/core";
import { slotChangeListener } from "../../../customized-slots";
import { OnboardingCard1Icon } from "../../../vviinn-icons";

@Component({
  tag: "vviinn-onboarding-card-1",
  styleUrl: "../onboarding-card.css",
  shadow: true,
})
export class VviinnOnboardingCard1 {
  @Element() el: HTMLElement;
  @Prop() cardTitle: string;
  @Prop() cardText: string;

  componentWillLoad() {
    slotChangeListener(this, this.el);
  }

  render() {
    return (
      <Host>
        <slot name="onboarding-card-1-icon">
          <OnboardingCard1Icon />
        </slot>
        <slot name="onboarding-card-1-text">
          <div class="text">
            <h4>{this.cardTitle}</h4>
            <p>{this.cardText}</p>
          </div>
        </slot>
      </Host>
    );
  }
}
