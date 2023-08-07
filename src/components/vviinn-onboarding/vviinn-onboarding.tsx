import { Component, Host, h, Element } from "@stencil/core";
import i18next from "i18next";

import { slotChangeListener } from "../customized-slots";

@Component({
  tag: "vviinn-onboarding",
  styleUrl: "vviinn-onboarding.css",
  shadow: true,
})
export class VviinnOnboarding {
  @Element() el: HTMLElement;

  componentWillLoad() {
    slotChangeListener(this, this.el);
  }

  render() {
    return (
      <Host>
        <slot name="vviinn-onboarding-title">
          <h3>{i18next.t("onboardingBlock.onboardingTitleText")}</h3>
        </slot>
        <vviinn-slider showArrows={true}>
          <vviinn-slide>
            <vviinn-onboarding-card-1
              cardTitle={i18next.t("onboardingBlock.onboardingCard1.title")}
              cardText={i18next.t("onboardingBlock.onboardingCard1.text")}
            />
          </vviinn-slide>
          <vviinn-slide>
            <vviinn-onboarding-card-2
              cardTitle={i18next.t("onboardingBlock.onboardingCard2.title")}
              cardText={i18next.t("onboardingBlock.onboardingCard2.text")}
            />
          </vviinn-slide>
          <vviinn-slide>
            <vviinn-onboarding-card-3
              cardTitle={i18next.t("onboardingBlock.onboardingCard3.title")}
              cardText={i18next.t("onboardingBlock.onboardingCard3.text")}
            />
          </vviinn-slide>
        </vviinn-slider>
      </Host>
    );
  }
}
