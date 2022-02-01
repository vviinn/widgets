'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

const index = require('./index-e4714cef.js');

const vviinnErrorCss = ":host{background:#F4F4F4;border-radius:8px;display:grid;grid-gap:20px;padding:24px;text-align:center}::slotted(svg){display:grid;align-self:center}::slotted(h4){margin:unset;font-weight:600;font-size:18px;line-height:24px}::slotted(span){font-size:14px;line-height:20px}::slotted(button){-webkit-appearance:none;-moz-appearance:none;appearance:none;border:none;background:transparent;color:var(--color-primary, var(--color-primary-system));font-weight:600;font-size:16px;line-height:20px;cursor:pointer}";

let VviinnError = class {
  constructor(hostRef) {
    index.registerInstance(this, hostRef);
  }
  render() {
    return (index.h(index.Host, null, index.h("slot", { name: "icon" }), index.h("slot", { name: "title" }), index.h("slot", { name: "text" }), index.h("slot", { name: "action" })));
  }
};
VviinnError.style = vviinnErrorCss;

exports.vviinn_error = VviinnError;
