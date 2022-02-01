import { Component, Host, h, Prop, State, Element } from "@stencil/core";
import { imageSearchState } from "../../../store/imageSearch.store";
import { CheckIcon } from "../../vviinn-icons";
const FILTERS_COUNT = 5;
const ACTIVE_FILTER_CLASSNAME = ".filter.active";
const getFilterId = (filter) => filter.href.split("/").reverse()[0];
export class SearchFilters {
  constructor() {
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
    return (h(Host, { exportparts: "filter, show-more-filters" },
      h("div", { class: "filters" },
        this.filter.filters
          .filter((_, i) => (this.hideFilters ? i < FILTERS_COUNT : true))
          .map((f, n) => (h("div", { role: "button", tabindex: "0", part: this.isFilterSelected(f) ? "filter active" : "filter", class: {
            filter: true,
            active: this.selectedCategoryId === getFilterId(f),
          }, style: { "animation-delay": `${n * 10}ms` }, onPointerUp: (ev) => {
            ev.stopPropagation();
            this.handleFilterSelection(f);
          }, onKeyPress: (ev) => this.handleEnter(ev, f) },
          this.isFilterSelected(f) ? h(CheckIcon, null) : null,
          f.name))),
        h("div", { class: {
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
  static get is() { return "search-filters"; }
  static get encapsulation() { return "shadow"; }
  static get originalStyleUrls() { return {
    "$": ["search-filters.css"]
  }; }
  static get styleUrls() { return {
    "$": ["search-filters.css"]
  }; }
  static get properties() { return {
    "filter": {
      "type": "unknown",
      "mutable": false,
      "complexType": {
        "original": "SearchSessionFilter | null",
        "resolved": "SearchSessionFilter",
        "references": {
          "SearchSessionFilter": {
            "location": "import",
            "path": "../../../searchSession/searchSession"
          }
        }
      },
      "required": false,
      "optional": false,
      "docs": {
        "tags": [],
        "text": ""
      },
      "defaultValue": "null"
    }
  }; }
  static get states() { return {
    "selectedCategoryId": {},
    "hideFilters": {}
  }; }
  static get elementRef() { return "el"; }
}
