import { r as registerInstance, h, f as Host } from './index-42e4cfd6.js';
import { i as imageSearchState } from './imageSearch.store-074cab22.js';
import './number-98d54dd6.js';
import './NonEmptyArray-6ef0d207.js';
import './Handler-47db9890.js';
import './Array-4b9f84cf.js';

const vviinnPreloaderCss = ":host{--preloader-size:24px;--preloader-width:calc(var(--preloader-size) / 6);transform-origin:center;-webkit-animation:rotate 3s linear infinite;animation:rotate 3s linear infinite;border:var(--preloader-width) solid white;border-radius:50%;border-top-color:transparent;display:none;outline:0;width:var(--preloader-size);height:var(--preloader-size);box-sizing:border-box}:host(.active){display:flex}@-webkit-keyframes rotate{from{transform:rotate(-360deg)}to{transform:rotate(360deg)}}@keyframes rotate{from{transform:rotate(-360deg)}to{transform:rotate(360deg)}}";

let VviinnPreloader = class {
  constructor(hostRef) {
    registerInstance(this, hostRef);
  }
  isActive() {
    return (imageSearchState.loading || imageSearchState.objectDetectionInProgress);
  }
  render() {
    return (h(Host, { class: {
        active: this.isActive(),
      } }));
  }
};
VviinnPreloader.style = vviinnPreloaderCss;

export { VviinnPreloader as vviinn_preloader };
