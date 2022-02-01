'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

const index = require('./index-e4714cef.js');
const index$1 = require('./index-b10317c7.js');
const customizedSlots = require('./customized-slots-9c9ebadc.js');

const vviinnVpsButtonCss = "";

let VviinnVpsButton = class {
  constructor(hostRef) {
    index.registerInstance(this, hostRef);
    this.globalSlotsChanged = index.createEvent(this, "globalSlotsChanged", 7);
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
    return (index.h(index.Host, { tabindex: "0", role: "button", pressed: this.pressed, onClick: () => this.handleClick(), onKeyDown: (ev) => this.handleKeyDown(ev) }, index.h("slot", null, index.h(index$1.CameraIcon, null)), index.h(customizedSlots.SlotSkeleton, null), index.h("vviinn-vps-widget", { active: this.pressed, "currency-sign": "\u20AC", token: this.token, locale: this.locale, apiPath: this.apiPath, exportparts: "brand, currency, deeplink, image, image-link, price-amount, price-container, price-outdated, price-prefix, price-regular, price-sale, title, product-card" })));
  }
  get el() { return index.getElement(this); }
};
VviinnVpsButton.style = vviinnVpsButtonCss;

exports.vviinn_vps_button = VviinnVpsButton;
