import { r as registerInstance, h, f as Host } from './index-42e4cfd6.js';

const vviinnSlideCss = ":host{display:grid;justify-items:center}";

let VviinnSlide = class {
  constructor(hostRef) {
    registerInstance(this, hostRef);
  }
  render() {
    return (h(Host, null, h("slot", null)));
  }
};
VviinnSlide.style = vviinnSlideCss;

export { VviinnSlide as vviinn_slide };
