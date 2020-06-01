import { r as registerInstance, h, H as Host } from './index-ba09a897.js';

const moptVprCss = ":host{display:block}";

const MoptVpr = class {
    constructor(hostRef) {
        registerInstance(this, hostRef);
        this.blockTitle = 'Recommended products';
        this.recommendations = [];
    }
    componentWillLoad() {
        console.log("/mocks/recommendations.json");
    }
    render() {
        return (h(Host, null, h("h4", null, this.blockTitle), h("div", { class: "results" }, this.recommendations.map(r => (h("vpr-result", { item: r }))))));
    }
};
MoptVpr.style = moptVprCss;

export { MoptVpr as mopt_vpr };
