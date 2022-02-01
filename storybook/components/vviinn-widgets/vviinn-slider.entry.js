import { h, r as registerInstance, f as Host, g as getElement } from './index-42e4cfd6.js';
import { N as NonEmptyArray, _ as _function } from './NonEmptyArray-6ef0d207.js';
import { O as Option, s as sequenceToOption, a as Ord } from './number-98d54dd6.js';
import { A as ArrowIcon } from './index-17312b47.js';

const getStyleMap = (data) => {
  return {
    "arrow-wrapper": true,
    [data.kind]: true,
    disabled: data.disabled,
  };
};
const Arrow = ({ kind, tabindex, disabled, onClick, onKeyDown, }) => (h("div", { class: getStyleMap({ kind, disabled }), onClick: onClick, tabindex: tabindex, onKeyDown: onKeyDown },
  h(ArrowIcon, null)));

const vviinnSliderCss = ":host{--color-primary-system:#0F62FE;--color-primary-hover-system:#014CDA;--color-icons-system:#2F8EDF;--spacer:8px}:host{--num-items:0;--position:0;display:grid;grid-gap:20px;justify-items:center;position:relative}.items-wrapper{overflow:hidden;width:100%}.items{box-sizing:border-box;display:grid;grid-auto-flow:column;grid-template-columns:repeat(var(--num-items), 100%);transform:translateX(calc(-100% * var(--position)));transition:transform 0.33s ease-in-out}.controls{display:grid;grid-gap:16px;grid-template-columns:repeat(var(--num-items), -webkit-min-content);grid-template-columns:repeat(var(--num-items), min-content)}.bullet{background:#E0E0E0;border-radius:50%;box-sizing:border-box;cursor:pointer;height:8px;width:8px;transition:background 0.1s ease-in-out}.bullet:hover{background:#C6C6C6}.bullet.active{background:var(--color-primary, var(--color-primary-system))}.bullet:active{background:transparent;border:2px solid var(--color-primary, var(--color-primary-system))}.arrow-wrapper{align-items:center;background:white;border:2px solid white;bottom:0;box-sizing:border-box;display:grid;height:calc(var(--spacer) * 6);justify-items:center;margin:auto;position:absolute;top:0;transform:translate3d(0, -50%, 0);transition:border 0.25ms ease-in-out;width:calc(var(--spacer) * 4)}.arrow-wrapper:active{border-color:var(--color-primary, var(--color-primary-system));opacity:0.75}.arrow-wrapper:focus{border-color:var(--color-primary, var(--color-primary-system));opacity:0.5;outline:none}.prev{left:0}.next{right:0}.next>svg{transform:rotate3d(0, 1, 0, 180deg)}.arrow-wrapper>svg{transition:fill 0.25ms ease-in-out;fill:#A8A8A8}.arrow-wrapper:hover>svg{fill:#8D8D8D}";

let VviinnSlider = class {
  constructor(hostRef) {
    registerInstance(this, hostRef);
    this.elementsCount = 0;
    this.internalPosition = 0;
    this.swipeStartPosition = Option.none;
    this.showBullets = true;
    this.position = 0;
    this.showArrows = false;
  }
  positionWatchHandler(newValue) {
    this.internalPosition = newValue;
    this.el.style.setProperty("--position", `${newValue}`);
    this.setActiveCssClassToSlide(newValue);
  }
  connectedCallback() {
    this.handleDomContentChanges();
  }
  handleDomContentChanges() {
    const items = this.el.querySelectorAll("vviinn-slide");
    this.elementsCount = items.length;
    this.el.style.setProperty("--num-items", `${this.elementsCount}`);
    this.setActiveCssClassToSlide(0);
  }
  setActiveCssClassToSlide(index) {
    const items = this.el.querySelectorAll("vviinn-slide");
    items.forEach((i) => i.classList.remove("active"));
    items[index].classList.add("active");
  }
  goToSlide(index) {
    this.internalPosition = index;
    this.el.style.setProperty("--position", `${index}`);
    this.setActiveCssClassToSlide(index);
  }
  renderBullets() {
    return this.showBullets ? (h("div", { class: "controls" }, NonEmptyArray.range(0, this.elementsCount - 1).map((i) => (h("div", { class: {
        bullet: true,
        active: i == this.internalPosition % this.elementsCount,
      }, onClick: () => this.goToSlide(i) }))))) : null;
  }
  nextSlide() {
    this.internalPosition++;
    this.renderSlidePosition();
  }
  prevSlide() {
    const nextPostion = this.internalPosition - 1;
    this.internalPosition =
      nextPostion > -1 ? nextPostion : this.elementsCount - 1;
    this.renderSlidePosition();
  }
  renderSlidePosition() {
    requestAnimationFrame(() => {
      this.el.style.setProperty("--position", `${this.internalPosition % this.elementsCount}`);
    });
  }
  handleKeyDown(event) {
    if (event.key !== "Space" && event.key !== "Enter")
      return;
    const target = event.target;
    const direction = target.className.includes("prev") ? "prev" : "next";
    switch (direction) {
      case "prev":
        this.prevSlide();
        break;
      case "next":
        this.nextSlide();
        break;
    }
  }
  handleTouchStart(event) {
    if (!this.showBullets)
      return;
    this.swipeStartPosition = _function.pipe(event.touches[0], Option.fromNullable, Option.map((t) => t.clientX));
  }
  handleTouchEnd(event) {
    if (!this.showBullets)
      return;
    const swipeEndPosition = _function.pipe(event.changedTouches[0], Option.fromNullable, Option.map((t) => t.clientX));
    _function.pipe(sequenceToOption(this.swipeStartPosition, swipeEndPosition), Option.map(([start, end]) => Ord.compare(start, end)), Option.map((swipeDirection) => {
      switch (swipeDirection) {
        case 1:
          return this.nextSlide();
        case -1:
          return this.prevSlide();
      }
    }));
  }
  render() {
    return (h(Host, null, h("div", { class: "items-wrapper" }, h("div", { class: "items", onTouchStart: (e) => this.handleTouchStart(e), onTouchEnd: (e) => this.handleTouchEnd(e) }, h("slot", null))), this.showArrows
      ? [
        h(Arrow, { kind: "prev", onClick: () => this.prevSlide(), onKeyDown: (ev) => this.handleKeyDown(ev), tabindex: 1, disabled: false }),
        h(Arrow, { kind: "next", onClick: () => this.nextSlide(), onKeyDown: (ev) => this.handleKeyDown(ev), tabindex: 0, disabled: false }),
      ]
      : null, this.renderBullets()));
  }
  get el() { return getElement(this); }
  static get watchers() { return {
    "position": ["positionWatchHandler"]
  }; }
};
VviinnSlider.style = vviinnSliderCss;

export { VviinnSlider as vviinn_slider };
