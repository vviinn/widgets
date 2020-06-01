import { r as registerInstance, h, H as Host } from './index-ba09a897.js';

const vprResultCss = ":host{display:block}";

const VprResult = class {
    constructor(hostRef) {
        registerInstance(this, hostRef);
    }
    render() {
        return (h(Host, null, h("slot", null)));
    }
};
VprResult.style = vprResultCss;

export { VprResult as vpr_result };
