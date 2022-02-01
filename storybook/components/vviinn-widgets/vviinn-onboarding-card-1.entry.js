import { r as registerInstance, h, f as Host, g as getElement } from './index-42e4cfd6.js';
import { s as slotChangeListener } from './customized-slots-f3745585.js';
import { O as OnboardingCard1Icon } from './index-17312b47.js';

const onboardingCardCss = ":host{align-items:center;background:#f4f4f4;display:grid;grid-template-rows:repeat(2, 1fr);justify-items:center;padding:24px;width:100%}h4{color:#161616;font-size:18px;font-weight:600;line-height:24px;margin:unset;text-align:center}svg{padding:16px 0}p{color:#525252;font-size:14px;font-style:normal;font-weight:normal;line-height:20px;margin:unset;text-align:center}.colored{fill:var(--color-icons, var(--color-icons-system))}.text{display:grid;grid-gap:8px}";

let VviinnOnboardingCard1 = class {
  constructor(hostRef) {
    registerInstance(this, hostRef);
  }
  componentWillLoad() {
    slotChangeListener(this, this.el);
  }
  render() {
    return (h(Host, null, h("slot", { name: "onboarding-card-1-icon" }, h(OnboardingCard1Icon, null)), h("slot", { name: "onboarding-card-1-text" }, h("div", { class: "text" }, h("h4", null, "Starte die Bildsuche"), h("p", null, "Lade ein Bild aus Deiner Galerie hoch oder fotografiere ein Produkt mit Deiner Kamera.")))));
  }
  get el() { return getElement(this); }
};
VviinnOnboardingCard1.style = onboardingCardCss;

export { VviinnOnboardingCard1 as vviinn_onboarding_card_1 };
