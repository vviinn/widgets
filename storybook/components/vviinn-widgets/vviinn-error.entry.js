import { r as registerInstance, h, f as Host } from './index-42e4cfd6.js';

const vviinnErrorCss = ":host{background:#F4F4F4;border-radius:8px;display:grid;grid-gap:20px;padding:24px;text-align:center}::slotted(svg){display:grid;align-self:center}::slotted(h4){margin:unset;font-weight:600;font-size:18px;line-height:24px}::slotted(span){font-size:14px;line-height:20px}::slotted(button){-webkit-appearance:none;-moz-appearance:none;appearance:none;border:none;background:transparent;color:var(--color-primary, var(--color-primary-system));font-weight:600;font-size:16px;line-height:20px;cursor:pointer}";

let VviinnError = class {
  constructor(hostRef) {
    registerInstance(this, hostRef);
  }
  render() {
    return (h(Host, null, h("slot", { name: "icon" }), h("slot", { name: "title" }), h("slot", { name: "text" }), h("slot", { name: "action" })));
  }
};
VviinnError.style = vviinnErrorCss;

export { VviinnError as vviinn_error };
