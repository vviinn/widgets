import { r as registerInstance, h, f as Host } from './index-42e4cfd6.js';
import { s as sequenceToOption, O as Option } from './number-98d54dd6.js';
import { p as pipe } from './Handler-47db9890.js';
import { i as imageSearchState } from './imageSearch.store-074cab22.js';
import './NonEmptyArray-6ef0d207.js';
import './Array-4b9f84cf.js';

const fromRectangle = (shape, target) => {
  const top = `${shape.y}px`;
  const left = `${shape.x}px`;
  const right = `${target.width - (shape.x + shape.width)}px`;
  const bottom = `${target.height - (shape.y + shape.height)}px`;
  return {
    top,
    right,
    bottom,
    left,
  };
};
const printClip = (clip) => `inset(${clip.top} ${clip.right} ${clip.bottom} ${clip.left})`;
const getClipValue = (shape, target) => printClip(fromRectangle(shape, target));

const highlightBoxCss = ":host{display:grid;position:absolute;box-sizing:border-box;border:none;width:100%;height:100%;-webkit-user-select:none;-moz-user-select:none;-ms-user-select:none;user-select:none;--size:10px;--x-position:0;--y-position:0}img{-webkit-user-select:none;-moz-user-select:none;-ms-user-select:none;user-select:none}.pointer{position:absolute;width:var(--size);height:var(--size);background:black;border-radius:50%;z-index:2;cursor:pointer;transform:translate(var(--x-position), var(--y-position)) scale(0);-webkit-animation:0.25s linear fadein;animation:0.25s linear fadein;-webkit-animation-fill-mode:forwards;animation-fill-mode:forwards}.pointer::after{content:\"\";cursor:pointer;border:5px solid black;border-radius:50%;width:var(--size);height:var(--size);display:block;transform:translate(calc(-50% + var(--size) * 0.5), calc(-50% + var(--size) * 0.5));padding:calc(var(--size) * 0.5);opacity:.75}@-webkit-keyframes fadein{from{transform:translate(var(--x-position), var(--y-position)) scale(0)}to{transform:translate(var(--x-position), var(--y-position)) scale(1)}}@keyframes fadein{from{transform:translate(var(--x-position), var(--y-position)) scale(0)}to{transform:translate(var(--x-position), var(--y-position)) scale(1)}}";

let HighlightBox = class {
  constructor(hostRef) {
    registerInstance(this, hostRef);
  }
  getInsetValue() {
    return pipe(sequenceToOption(imageSearchState.searchArea, imageSearchState.imageBounds), Option.map(([selection, image]) => getClipValue(selection, image)), Option.getOrElse(() => ""));
  }
  renderImage() {
    return pipe(sequenceToOption(imageSearchState.imageUrl, imageSearchState.imageBounds), Option.map(([url, bounds]) => (h("img", { src: url, width: bounds.width, height: bounds.height, style: { "clip-path": `${this.getInsetValue()}` } }))), Option.getOrElse(() => ""));
  }
  render() {
    return h(Host, null, this.renderImage());
  }
};
HighlightBox.style = highlightBoxCss;

export { HighlightBox as highlight_box };
