import { Component, Host, h, Element, State, Prop } from "@stencil/core";
import { chunksOf } from "fp-ts/lib/Array";
import { ChevronIcon } from "../vviinn-icons";
const COLUMNS_NUMBER_CSS_VAR = "--vviinn-carousel-columns";
const CAROUSEL_WIDTH_CSS_VAR = "--vviinn-carousel-content-width";
const CAROUSEL_IMAGE_WIDTH_CSS_VAR = "--vviinn-carousel-image-width";
const CONTENT_GROUP_CSS_CLASS = "items-group";
const INCOMPLETE_GROUP_CSS_CLASS = "incomplete";
export class VviinnCarousel {
  constructor() {
    this.moveDirection = "right";
    this.contentGroups = [];
    this.activeContentGroup = 0;
    this.mode = "modern";
    this.imageWidth = 140;
    this.showScroll = true;
    this.content = [];
    this.isContentClonned = false;
    this.resizeObserver = new ResizeObserver(() => this.handleResize());
  }
  connectedCallback() {
    this.el.style.setProperty(CAROUSEL_IMAGE_WIDTH_CSS_VAR, `${this.imageWidth}px`);
  }
  disconnectedCallback() {
    this.resizeObserver.unobserve(this.el.offsetParent);
  }
  componentDidRender() {
    this.setWidth();
    this.processScrollbarWidth();
  }
  getContentClassMap() {
    return {
      content: true,
      [this.moveDirection]: true,
      [this.mode]: true,
    };
  }
  handleResize() {
    this.setWidth();
    this.processScrollbarWidth();
  }
  calculateMoveStep() {
    const contentWidths = this.getContent().map((el) => el.getBoundingClientRect().width);
    const sum = contentWidths.reduce((acc, val) => acc + val, 0);
    return sum / contentWidths.length;
  }
  setWidth() {
    const parent = this.el.offsetParent;
    if (!parent)
      return;
    const parentStyles = getComputedStyle(parent);
    const parentWidth = parent.getBoundingClientRect().width;
    const width = parentWidth -
      (parseInt(parentStyles["padding-right"]) +
        parseInt(parentStyles["padding-left"]));
    this.el.style.setProperty(CAROUSEL_WIDTH_CSS_VAR, `${width}px`);
  }
  cloneSlottedContent(event) {
    if (this.isContentClonned)
      return;
    const slot = event.target;
    this.content = slot.assignedElements();
    this.isContentClonned = true;
    this.renderContent();
    this.setWidth();
    this.resizeObserver.observe(this.el.offsetParent);
  }
  renderContent() {
    const c = this.mode === "classic"
      ? chunksOf(this.getColumnsNumber())(this.content)
      : this.content.reduce((fragment, element) => {
        fragment.append(element);
        return fragment;
      }, new DocumentFragment());
    this.mode === "classic" ? this.renderGroup(c) : this.renderLine(c);
  }
  renderGroup(content) {
    const columnsNumber = this.getColumnsNumber();
    const groups = content.map((el) => {
      const container = document.createElement("div");
      const groupClassNames = el.length < columnsNumber
        ? [CONTENT_GROUP_CSS_CLASS, INCOMPLETE_GROUP_CSS_CLASS]
        : [CONTENT_GROUP_CSS_CLASS];
      container.classList.add(...groupClassNames);
      return el.reduce((acc, el) => {
        acc.append(el);
        return acc;
      }, container);
    });
    const combinedElements = groups.reduce((fragment, element) => {
      fragment.append(element);
      return fragment;
    }, new DocumentFragment());
    this.appendToContent(combinedElements);
    this.contentGroups = this.getContentGroups();
  }
  renderLine(item) {
    this.appendToContent(item);
  }
  getActiveGroupIndex() {
    var _a, _b;
    const contentNodeLeft = (_b = (_a = this.getContentNode()) === null || _a === void 0 ? void 0 : _a.getBoundingClientRect()) === null || _b === void 0 ? void 0 : _b.left;
    if (!contentNodeLeft)
      return 0;
    const groups = this.getContentGroups();
    const groupsPositions = groups.map((g) => g.getBoundingClientRect().left);
    const indexedPositions = groupsPositions
      .map((value, index) => [value, index])
      .filter((x) => x[0] >= 0);
    return indexedPositions.length > 0 ? indexedPositions[0][1] : 0;
  }
  getContentNode() {
    return this.el.shadowRoot.querySelector(".content");
  }
  getContent() {
    const children = this.getContentNode().children;
    return Array.from(children).map((c) => c);
  }
  getColumnsNumber() {
    const styleSheet = getComputedStyle(this.el);
    const columnsInCss = styleSheet.getPropertyValue(COLUMNS_NUMBER_CSS_VAR);
    return parseInt(columnsInCss);
  }
  getContentGroups() {
    return Array.from(this.el.shadowRoot.querySelectorAll(`.${CONTENT_GROUP_CSS_CLASS}`));
  }
  appendToContent(content) {
    const contentNode = this.getContentNode();
    contentNode.append(content);
  }
  showNext() {
    this.moveDirection = "right";
    const contentContainer = this.getContentNode();
    requestAnimationFrame(() => {
      contentContainer.scrollTo({
        top: 0,
        left: contentContainer.scrollLeft + this.calculateMoveStep(),
        behavior: "smooth",
      });
    });
  }
  showPrev() {
    this.moveDirection = "left";
    const contentContainer = this.getContentNode();
    requestAnimationFrame(() => {
      contentContainer.scrollTo({
        top: 0,
        left: contentContainer.scrollLeft - this.calculateMoveStep(),
        behavior: "smooth",
      });
    });
  }
  processScrollbarWidth() {
    const target = this.getContentNode();
    const scrollRatio = (target.scrollLeft + target.clientWidth) / target.scrollWidth;
    const scrolledWidth = target.clientWidth * scrollRatio;
    this.el.style.setProperty("--vviinn-progressbar-width", `${scrolledWidth}px`);
    this.activeContentGroup = this.getActiveGroupIndex();
  }
  showBullets() {
    return this.mode === "classic" && this.showScroll;
  }
  showScrollbar() {
    return this.mode === "modern" && this.showScroll;
  }
  getClassMap() {
    return {
      [this.mode]: true,
      "show-scrollbar": this.showScrollbar(),
    };
  }
  render() {
    return (h(Host, { class: this.getClassMap() },
      h("div", { class: "body" },
        h("button", { class: "prev", onClick: () => this.showPrev() },
          h(ChevronIcon, null)),
        h("div", { class: this.getContentClassMap(), onScroll: () => this.processScrollbarWidth() }),
        h("button", { class: "next", onClick: () => this.showNext() },
          h(ChevronIcon, null))),
      this.showBullets() ? (h("div", { class: "bullets" }, this.contentGroups
        .map((_, i) => i)
        .map((i) => (h("div", { class: {
          bullet: true,
          active: this.activeContentGroup === i,
        } }))))) : (""),
      h("slot", { onSlotchange: (x) => this.cloneSlottedContent(x) })));
  }
  static get is() { return "vviinn-carousel"; }
  static get encapsulation() { return "shadow"; }
  static get originalStyleUrls() { return {
    "$": ["vviinn-carousel.css"]
  }; }
  static get styleUrls() { return {
    "$": ["vviinn-carousel.css"]
  }; }
  static get properties() { return {
    "mode": {
      "type": "string",
      "mutable": false,
      "complexType": {
        "original": "CarouselMode",
        "resolved": "\"classic\" | \"modern\"",
        "references": {
          "CarouselMode": {
            "location": "local"
          }
        }
      },
      "required": false,
      "optional": false,
      "docs": {
        "tags": [],
        "text": ""
      },
      "attribute": "mode",
      "reflect": false,
      "defaultValue": "\"modern\""
    },
    "imageWidth": {
      "type": "number",
      "mutable": false,
      "complexType": {
        "original": "number",
        "resolved": "number",
        "references": {}
      },
      "required": false,
      "optional": false,
      "docs": {
        "tags": [],
        "text": ""
      },
      "attribute": "image-width",
      "reflect": false,
      "defaultValue": "140"
    },
    "showScroll": {
      "type": "boolean",
      "mutable": false,
      "complexType": {
        "original": "boolean",
        "resolved": "boolean",
        "references": {}
      },
      "required": false,
      "optional": false,
      "docs": {
        "tags": [],
        "text": ""
      },
      "attribute": "show-scroll",
      "reflect": false,
      "defaultValue": "true"
    }
  }; }
  static get states() { return {
    "moveDirection": {},
    "contentGroups": {},
    "activeContentGroup": {}
  }; }
  static get elementRef() { return "el"; }
}
