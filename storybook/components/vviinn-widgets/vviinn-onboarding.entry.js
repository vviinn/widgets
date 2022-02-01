import { r as registerInstance, h, f as Host } from './index-42e4cfd6.js';

const vviinnOnboardingCss = ":host{--color-primary-system:#0F62FE;--color-primary-hover-system:#014CDA;--color-icons-system:#2F8EDF;--spacer:8px}vviinn-onboarding{display:block}vviinn-onboarding h3{font-size:22px;font-weight:600;line-height:32px;margin:0;margin-bottom:16px;text-align:center}vviinn-onboarding vviinn-slide{background:#f4f4f4;padding:24px}vviinn-onboarding svg{padding:16px 0}vviinn-onboarding .text{display:grid;grid-gap:8px}vviinn-onboarding .text>h4{color:#161616;font-size:18px;font-weight:600;line-height:24px;margin:unset;text-align:center}vviinn-onboarding .text>p{color:#525252;font-size:14px;font-style:normal;font-weight:normal;line-height:20px;margin:unset;text-align:center}vviinn-onboarding .colored{fill:var(--color-icons, var(--color-icons-system))}";

let VviinnOnboarding = class {
  constructor(hostRef) {
    registerInstance(this, hostRef);
  }
  render() {
    return (h(Host, null, h("h3", null, "So funktioniert es"), h("vviinn-slider", { showArrows: true }, h("vviinn-slide", null, h("vviinn-onboarding-card-1", null)), h("vviinn-slide", null, h("vviinn-onboarding-card-2", null)), h("vviinn-slide", null, h("vviinn-onboarding-card-3", null)))));
  }
};
VviinnOnboarding.style = vviinnOnboardingCss;

export { VviinnOnboarding as vviinn_onboarding };
