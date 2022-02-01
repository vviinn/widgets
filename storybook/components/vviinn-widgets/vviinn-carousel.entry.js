import { r as registerInstance, h, f as Host, g as getElement } from './index-42e4cfd6.js';
import { _ as _Array } from './Array-4b9f84cf.js';
import { a as ChevronIcon } from './index-17312b47.js';
import './NonEmptyArray-6ef0d207.js';

const vviinnCarouselCss = ":host{--vviinn-progressbar-width:0;--vviinn-carousel-item-width:150px;--vviinn-carousel-columns:4;--vviinn-carousel-image-width-system:140px}.body{display:flex;position:relative;width:var(--vviinn-carousel-content-width);flex-direction:column}.content-wrapper *{box-sizing:border-box}.content-wrapper{overflow-y:hidden;overflow-x:auto;flex-grow:1}.bullets{margin-top:16px;display:flex;flex-direction:row;grid-gap:24px;justify-content:center}.bullet{width:10px;height:10px;background:#E0E0E0;border-radius:50%}.bullet.active{background:#161616}@media (min-width: 480px){.content::-webkit-scrollbar{display:none}.content{-ms-overflow-style:none;scrollbar-width:none}}.content{display:flex;flex-direction:row;grid-gap:8px;-ms-scroll-snap-type:x mandatory;scroll-snap-type:x mandatory;overflow-y:hidden;overflow-x:auto;flex-grow:1}.content.left>*{scroll-snap-align:start}.content.right>*{scroll-snap-align:end}:host(.modern) button{border-radius:50%}:host(.classic) button{border-radius:2px}button{align-items:center;background-color:white;border:none;box-shadow:0px 2px 6px rgba(0, 0, 0, 0.15);cursor:pointer;display:grid;height:40px;justify-items:center;position:absolute;top:calc(50% - 20px);width:40px;z-index:1;padding:0;margin:0}button.prev svg{transform:rotate(180deg);margin-left:-5px}.prev{left:0}.next{right:0}.items-group{display:grid;min-width:100%;grid-template-columns:repeat(auto-fit, minmax(var(--vviinn-carousel-image-width, --vviinn-carousel-image-width-system), 1fr));align-items:center;justify-items:center;grid-gap:16px}.items-group.incomplete{grid-template-columns:repeat(auto-fill, minmax(var(--vviinn-carousel-image-width, --vviinn-carousel-image-width-system), 1fr))}vviinn-product-card::part(price-container){text-align:center}";

const COLUMNS_NUMBER_CSS_VAR = "--vviinn-carousel-columns";
const CAROUSEL_WIDTH_CSS_VAR = "--vviinn-carousel-content-width";
const CAROUSEL_IMAGE_WIDTH_CSS_VAR = "--vviinn-carousel-image-width";
const CONTENT_GROUP_CSS_CLASS = "items-group";
const INCOMPLETE_GROUP_CSS_CLASS = "incomplete";
let VviinnCarousel = class {
  constructor(hostRef) {
    registerInstance(this, hostRef);
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
      ? _Array.chunksOf(this.getColumnsNumber())(this.content)
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
    return (h(Host, { class: this.getClassMap() }, h("div", { class: "body" }, h("button", { class: "prev", onClick: () => this.showPrev() }, h(ChevronIcon, null)), h("div", { class: this.getContentClassMap(), onScroll: () => this.processScrollbarWidth() }), h("button", { class: "next", onClick: () => this.showNext() }, h(ChevronIcon, null))), this.showBullets() ? (h("div", { class: "bullets" }, this.contentGroups
      .map((_, i) => i)
      .map((i) => (h("div", { class: {
        bullet: true,
        active: this.activeContentGroup === i,
      } }))))) : (""), h("slot", { onSlotchange: (x) => this.cloneSlottedContent(x) })));
  }
  get el() { return getElement(this); }
};
VviinnCarousel.style = vviinnCarouselCss;

export { VviinnCarousel as vviinn_carousel };
