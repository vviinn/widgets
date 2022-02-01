import { Component, Host, h, Element } from '@stencil/core';
import { OnboardingCard2Icon } from '../../../vviinn-icons';
import { slotChangeListener } from '../../../customized-slots';
export class VviinnOnboardingCard2 {
  componentWillLoad() {
    slotChangeListener(this, this.el);
  }
  render() {
    return (h(Host, null,
      h("slot", { name: "onboarding-card-2-icon" },
        h(OnboardingCard2Icon, null)),
      h("slot", { name: "onboarding-card-2-text" },
        h("div", { class: "text" },
          h("h4", null, "Verfeiner deine Suche"),
          h("p", null, "Du kannst den Bildrahmen selber festlegen und so die Produkte genau ausw\u00E4hlen.")))));
  }
  static get is() { return "vviinn-onboarding-card-2"; }
  static get encapsulation() { return "shadow"; }
  static get originalStyleUrls() { return {
    "$": ["../onboarding-card.css"]
  }; }
  static get styleUrls() { return {
    "$": ["../onboarding-card.css"]
  }; }
  static get elementRef() { return "el"; }
}
