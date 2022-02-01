'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

const index = require('./index-e4714cef.js');
const imageSearch_store = require('./imageSearch.store-f6f89b7b.js');
require('./Handler-d1a8a86a.js');

const vviinnPreloaderCss = ":host{--preloader-size:24px;--preloader-width:calc(var(--preloader-size) / 6);transform-origin:center;-webkit-animation:rotate 3s linear infinite;animation:rotate 3s linear infinite;border:var(--preloader-width) solid white;border-radius:50%;border-top-color:transparent;display:none;outline:0;width:var(--preloader-size);height:var(--preloader-size);box-sizing:border-box}:host(.active){display:flex}@-webkit-keyframes rotate{from{transform:rotate(-360deg)}to{transform:rotate(360deg)}}@keyframes rotate{from{transform:rotate(-360deg)}to{transform:rotate(360deg)}}";

let VviinnPreloader = class {
  constructor(hostRef) {
    index.registerInstance(this, hostRef);
  }
  isActive() {
    return (imageSearch_store.imageSearchState.loading || imageSearch_store.imageSearchState.objectDetectionInProgress);
  }
  render() {
    return (index.h(index.Host, { class: {
        active: this.isActive(),
      } }));
  }
};
VviinnPreloader.style = vviinnPreloaderCss;

exports.vviinn_preloader = VviinnPreloader;
