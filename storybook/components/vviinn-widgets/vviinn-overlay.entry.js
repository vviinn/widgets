import { r as registerInstance, h, f as Host } from './index-42e4cfd6.js';

const vviinnOverlayCss = ":host{-webkit-animation:fade-in 0.5s ease-in-out;animation:fade-in 0.5s ease-in-out;background:rgba(0, 0, 0, 0.5);display:block;height:100vh;left:0;overflow:hidden;position:fixed;top:0;width:100vw;z-index:9999}@-webkit-keyframes fade-in{from{opacity:0.1}to{opacity:1}}@keyframes fade-in{from{opacity:0.1}to{opacity:1}}";

let VviinnOverlay = class {
  constructor(hostRef) {
    registerInstance(this, hostRef);
  }
  render() {
    return (h(Host, null, h("slot", null)));
  }
};
VviinnOverlay.style = vviinnOverlayCss;

export { VviinnOverlay as vviinn_overlay };
