import { Component, Host, h, Element } from '@stencil/core';
import { slotChangeListener } from '../../../customized-slots';
import { OnboardingCard1Icon } from '../../../vviinn-icons';
export class VviinnOnboardingCard1 {
  componentWillLoad() {
    slotChangeListener(this, this.el);
  }
  render() {
    return (h(Host, null,
      h("slot", { name: "onboarding-card-1-icon" },
        h(OnboardingCard1Icon, null)),
      h("slot", { name: "onboarding-card-1-text" },
        h("div", { class: "text" },
          h("h4", null, "Starte die Bildsuche"),
          h("p", null, "Lade ein Bild aus Deiner Galerie hoch oder fotografiere ein Produkt mit Deiner Kamera.")))));
  }
  static get is() { return "vviinn-onboarding-card-1"; }
  static get encapsulation() { return "shadow"; }
  static get originalStyleUrls() { return {
    "$": ["../onboarding-card.css"]
  }; }
  static get styleUrls() { return {
    "$": ["../onboarding-card.css"]
  }; }
  static get elementRef() { return "el"; }
}
