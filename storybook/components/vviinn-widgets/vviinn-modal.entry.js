import { r as registerInstance, k as createEvent, h, f as Host } from './index-42e4cfd6.js';

const vviinnModalCss = ":host{background:white;border-radius:4px;box-sizing:border-box;display:grid;grid-template-rows:-webkit-min-content auto;grid-template-rows:min-content auto;max-width:960px}@media (max-width: 415px){:host{-webkit-animation-name:fade-in;animation-name:fade-in;-webkit-animation-duration:0.5s;animation-duration:0.5s;-webkit-animation-fill-mode:forwards;animation-fill-mode:forwards}:host(.closed){-webkit-animation-name:fade-out;animation-name:fade-out;-webkit-animation-fill-mode:none;animation-fill-mode:none}.body{overflow-y:auto}}@media (max-width: 640px) and (min-width: 415px){:host{max-width:80%}}.head{align-items:center;border-bottom:1px solid #F4F4F4;display:grid;grid-gap:16px;grid-template-columns:-webkit-min-content auto -webkit-min-content;grid-template-columns:min-content auto min-content;justify-items:center;padding:16px}.title{font-weight:600;font-size:18px;line-height:24px}button{-webkit-appearance:none;-moz-appearance:none;appearance:none;background:none;border:none;cursor:pointer;display:grid;padding:unset}@-webkit-keyframes fade-in{from{transform:translateY(100%)}to{transform:translateY(0)}}@keyframes fade-in{from{transform:translateY(100%)}to{transform:translateY(0)}}@-webkit-keyframes fade-out{from{transform:translateY(0)}to{transform:translateY(100%)}}@keyframes fade-out{from{transform:translateY(0)}to{transform:translateY(100%)}}";

let VviinnModal = class {
  constructor(hostRef) {
    registerInstance(this, hostRef);
    this.modalClosed = createEvent(this, "modalClosed", 7);
    this.secondaryActionClicked = createEvent(this, "secondaryActionClicked", 7);
    this.active = false;
    this.slider = false;
  }
  close() {
    this.active = false;
    setTimeout(() => {
      this.modalClosed.emit();
    }, this.slider ? 500 : 0);
  }
  handleAnimationEnd(ev) {
    if (ev.animationName !== "fade-in")
      return;
    this.slider = true;
  }
  render() {
    return (h(Host, { exportparts: "secondary-action, title, close-button", class: { closed: !this.active }, onAnimationEnd: (ev) => this.handleAnimationEnd(ev) }, h("div", { class: "head" }, h("button", { part: "secondary-action", onClick: () => this.secondaryActionClicked.emit() }, h("svg", { width: "24", height: "24", viewBox: "0 0 24 24", fill: "none", xmlns: "http://www.w3.org/2000/svg" }, h("path", { d: "M20.25 12H3.75", stroke: "#161616", "stroke-width": "2", "stroke-linecap": "round", "stroke-linejoin": "round" }), h("path", { d: "M10.5 5.25L3.75 12L10.5 18.75", stroke: "#161616", "stroke-width": "2", "stroke-linecap": "round", "stroke-linejoin": "round" }))), h("div", { class: "title", part: "title" }, "Bildsuche"), h("button", { onClick: () => this.close(), class: "close-button", part: "close-button" }, h("svg", { width: "16", height: "16", viewBox: "0 0 16 16", fill: "none", xmlns: "http://www.w3.org/2000/svg" }, h("path", { d: "M16 1.4L14.6 0L8 6.6L1.4 0L0 1.4L6.6 8L0 14.6L1.4 16L8 9.4L14.6 16L16 14.6L9.4 8L16 1.4Z", fill: "#333333" })))), h("div", { class: "body" }, h("slot", null))));
  }
};
VviinnModal.style = vviinnModalCss;

export { VviinnModal as vviinn_modal };
