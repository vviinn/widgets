import { r as registerInstance, h, f as Host, g as getElement } from './index-42e4cfd6.js';
import { i as imageSearchState } from './imageSearch.store-074cab22.js';
import { b as CheckIcon } from './index-17312b47.js';
import './number-98d54dd6.js';
import './NonEmptyArray-6ef0d207.js';
import './Handler-47db9890.js';
import './Array-4b9f84cf.js';

const searchFiltersCss = ":host{display:grid;grid-gap:1rem}.filters{display:flex;flex-direction:row;flex-wrap:wrap;gap:0.5rem}.filter{align-items:center;-webkit-animation-duration:0.25s;animation-duration:0.25s;-webkit-animation-fill-mode:forwards;animation-fill-mode:forwards;-webkit-animation-name:scalein;animation-name:scalein;border:1px solid lightgray;cursor:pointer;display:flex;flex-direction:row;grid-gap:8px;height:-webkit-max-content;height:-moz-max-content;height:max-content;min-width:-webkit-max-content;min-width:-moz-max-content;min-width:max-content;padding:0.1rem;transform:scale(0);transition-property:background;transition-duration:0.25s;transition-timing-function:ease-in-out;-webkit-user-select:none;-moz-user-select:none;-ms-user-select:none;user-select:none;padding:6px 16px}.filter.active{border:1px solid black;padding:6px 8px}.filter:hover{border:1px solid gray}.show-more{display:flex}.show-more.hidden{display:none}.show-more::after{content:url(\"data:image/svg+xml,%3Csvg width='16' height='16' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M8 12.2l-6-6L3.2 5 8 9.8 12.8 5 14 6.2l-6 6z' fill='%23525252'/%3E%3C/svg%3E\");display:block;height:16px;margin-top:1px;margin-left:8px}.show-more.active::after{transform:rotateX(180deg)}@-webkit-keyframes scalein{from{opacity:0;transform:scale(0.5)}to{opacity:1;transform:scale(1)}}@keyframes scalein{from{opacity:0;transform:scale(0.5)}to{opacity:1;transform:scale(1)}}@media (max-width: 415px){.show-more::after{transform:rotate(-90deg)}.show-more.active::after{transform:rotate(90deg)}}@media (max-width: 800px){.filters{flex-wrap:nowrap;overflow-x:scroll;-ms-scroll-snap-type:x mandatory;scroll-snap-type:x mandatory;grid-gap:unset}.filter{scroll-snap-align:end;margin-right:0.5rem}}";

const FILTERS_COUNT = 5;
const ACTIVE_FILTER_CLASSNAME = ".filter.active";
const getFilterId = (filter) => filter.href.split("/").reverse()[0];
let SearchFilters = class {
  constructor(hostRef) {
    registerInstance(this, hostRef);
    this.filter = null;
    this.selectedCategoryId = null;
    this.hideFilters = true;
  }
  handleFilterSelection(filter) {
    return this.isFilterSelected(filter)
      ? this.clearSelectedFilter()
      : this.selectFilter(filter);
  }
  selectFilter(filter) {
    this.selectedCategoryId = getFilterId(filter);
    imageSearchState.activeIonLink = filter;
  }
  clearSelectedFilter() {
    this.selectedCategoryId = null;
    imageSearchState.activeIonLink = undefined;
    this.findSelectedFilter().blur();
  }
  findSelectedFilter() {
    return this.el.shadowRoot.querySelector(ACTIVE_FILTER_CLASSNAME);
  }
  toggleFilters() {
    this.hideFilters = !this.hideFilters;
  }
  handleEnter(ev, f) {
    if (ev.key !== "Enter")
      return;
    this.handleFilterSelection(f);
  }
  isFilterSelected(filterLink) {
    return this.selectedCategoryId === getFilterId(filterLink);
  }
  render() {
    return (h(Host, { exportparts: "filter, show-more-filters" }, h("div", { class: "filters" }, this.filter.filters
      .filter((_, i) => (this.hideFilters ? i < FILTERS_COUNT : true))
      .map((f, n) => (h("div", { role: "button", tabindex: "0", part: this.isFilterSelected(f) ? "filter active" : "filter", class: {
        filter: true,
        active: this.selectedCategoryId === getFilterId(f),
      }, style: { "animation-delay": `${n * 10}ms` }, onPointerUp: (ev) => {
        ev.stopPropagation();
        this.handleFilterSelection(f);
      }, onKeyPress: (ev) => this.handleEnter(ev, f) }, this.isFilterSelected(f) ? h(CheckIcon, null) : null, f.name))), h("div", { class: {
        filter: true,
        "show-more": true,
        hidden: this.filter.filters.length <= FILTERS_COUNT,
        active: !this.hideFilters,
      }, role: "button", tabindex: "0", "aria-role": "button", onClick: () => this.toggleFilters(), onKeyPress: (ev) => {
        if (ev.key === "Enter") {
          this.toggleFilters();
        }
      }, part: "show-more-filters" }, this.hideFilters ? "Zeige mehr" : "Zeige weniger"))));
  }
  get el() { return getElement(this); }
};
SearchFilters.style = searchFiltersCss;

export { SearchFilters as search_filters };
