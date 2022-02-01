import { r as registerInstance, h, f as Host, g as getElement } from './index-42e4cfd6.js';
import { c as OnboardingCard2Icon } from './index-17312b47.js';
import { s as slotChangeListener } from './customized-slots-f3745585.js';

const onboardingCardCss = ":host{align-items:center;background:#f4f4f4;display:grid;grid-template-rows:repeat(2, 1fr);justify-items:center;padding:24px;width:100%}h4{color:#161616;font-size:18px;font-weight:600;line-height:24px;margin:unset;text-align:center}svg{padding:16px 0}p{color:#525252;font-size:14px;font-style:normal;font-weight:normal;line-height:20px;margin:unset;text-align:center}.colored{fill:var(--color-icons, var(--color-icons-system))}.text{display:grid;grid-gap:8px}";

let VviinnOnboardingCard2 = class {
  constructor(hostRef) {
    registerInstance(this, hostRef);
  }
  componentWillLoad() {
    slotChangeListener(this, this.el);
  }
  render() {
    return (h(Host, null, h("slot", { name: "onboarding-card-2-icon" }, h(OnboardingCard2Icon, null)), h("slot", { name: "onboarding-card-2-text" }, h("div", { class: "text" }, h("h4", null, "Verfeiner deine Suche"), h("p", null, "Du kannst den Bildrahmen selber festlegen und so die Produkte genau ausw\u00E4hlen.")))));
  }
  get el() { return getElement(this); }
};
VviinnOnboardingCard2.style = onboardingCardCss;

export { VviinnOnboardingCard2 as vviinn_onboarding_card_2 };
