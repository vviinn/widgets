import { r as registerInstance, c as createEvent, h, H as Host, g as getElement } from './index-d92b0799.js';
import { a as CameraIcon } from './index-ba7b7672.js';
import { S as SlotSkeleton } from './customized-slots-06a5874a.js';

const vviinnVpsButtonCss = "";

let VviinnVpsButton = class {
  constructor(hostRef) {
    registerInstance(this, hostRef);
    this.globalSlotsChanged = createEvent(this, "globalSlotsChanged", 7);
    /** Currency sign will shown after price */
    this.currencySign = "€";
    /** Locale for currency formatting */
    this.locale = "de-DE";
    this.pressed = false;
  }
  handleModalClosed() {
    this.pressed = false;
  }
  componentDidLoad() {
    const slots = this.el.querySelectorAll("[slot]");
    this.globalSlotsChanged.emit(Array.from(slots));
  }
  handleKeyDown(ev) {
    if (ev.code !== "Enter" && ev.code !== "Space")
      return;
    this.pressed = true;
  }
  handleClick() {
    this.pressed = true;
  }
  render() {
    return (h(Host, { tabindex: "0", role: "button", pressed: this.pressed, onClick: () => this.handleClick(), onKeyDown: (ev) => this.handleKeyDown(ev) }, h("slot", null, h(CameraIcon, null)), h(SlotSkeleton, null), h("vviinn-vps-widget", { active: this.pressed, "currency-sign": "\u20AC", token: this.token, locale: this.locale, apiPath: this.apiPath, exportparts: "brand, currency, deeplink, image, image-link, price-amount, price-container, price-outdated, price-prefix, price-regular, price-sale, title, product-card" })));
  }
  get el() { return getElement(this); }
};
VviinnVpsButton.style = vviinnVpsButtonCss;

export { VviinnVpsButton as vviinn_vps_button };
