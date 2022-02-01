import { Component, Host, h, Element } from '@stencil/core';
import { OnboardingCard3Icon } from '../../../vviinn-icons';
import { slotChangeListener } from '../../../customized-slots';
export class VviinnOnboardingCard3 {
  componentWillLoad() {
    slotChangeListener(this, this.el);
  }
  render() {
    return (h(Host, null,
      h("slot", { name: "onboarding-card-3-icon" },
        h(OnboardingCard3Icon, null)),
      h("slot", { name: "onboarding-card-3-text" },
        h("div", { class: "text" },
          h("h4", null, "Ohne Hintergrund"),
          h("p", null, "Die besten Ergebnisse erh\u00E4ltst Du, wenn das gesuchte Objekt mit einfarbigem und hellem Hintergrund zu sehen ist.")))));
  }
  static get is() { return "vviinn-onboarding-card-3"; }
  static get encapsulation() { return "shadow"; }
  static get originalStyleUrls() { return {
    "$": ["../onboarding-card.css"]
  }; }
  static get styleUrls() { return {
    "$": ["../onboarding-card.css"]
  }; }
  static get elementRef() { return "el"; }
}
