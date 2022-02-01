import { r as registerInstance, h, f as Host } from './index-42e4cfd6.js';
import { h as dimensionsFromImage, j as scaleByLargestSide, k as fromImage, l as move, i as imageSearchState } from './imageSearch.store-074cab22.js';
import { _ as _function } from './NonEmptyArray-6ef0d207.js';
import { O as Option, s as sequenceToOption } from './number-98d54dd6.js';
import './Handler-47db9890.js';
import './Array-4b9f84cf.js';

const vviinnImageViewCss = ":host{display:grid;position:relative;justify-self:center}img{box-sizing:border-box;filter:brightness(60%);position:relative;-webkit-user-select:none;-moz-user-select:none;-ms-user-select:none;user-select:none;z-index:-1}.image-preloader{background:rgba(0, 0, 0, 0.25);border-radius:4px;bottom:18px;padding:4px 6px;pointer-events:none;position:absolute;right:18px;z-index:4}vviinn-preloader{--preloader-size:12px}";

const getImageSizes = (i) => {
  const dimensions = dimensionsFromImage(i);
  const resize = scaleByLargestSide(288);
  const newDimensions = resize(dimensions);
  const sizes = newDimensions.map(d => d.size);
  return [sizes[0], sizes[1]];
};
let VviinnImageView = class {
  constructor(hostRef) {
    registerInstance(this, hostRef);
  }
  handleInitialImageLoad(ev) {
    const target = ev.target;
    const imageBounds = fromImage(target);
    const padding = 12;
    const { x, y } = move(imageBounds, { x: padding, y: padding });
    const searchArea = {
      x,
      y,
      width: imageBounds.width - padding * 2,
      height: imageBounds.height - padding * 2,
    };
    imageSearchState.imageBounds = Option.some(imageBounds);
    imageSearchState.searchArea = Option.some(searchArea);
  }
  renderDetectedObject(object) {
    return h("vviinn-detected-object", { detectedObject: object });
  }
  renderImage() {
    return _function.pipe(sequenceToOption(imageSearchState.imageUrl, imageSearchState.image), Option.map(([url, refImage]) => {
      const [width, height] = getImageSizes(refImage);
      const image = (h("img", { decoding: "async", width: width, height: height, src: url, onLoad: (el) => this.handleInitialImageLoad(el), draggable: false }));
      return image;
    }), Option.getOrElse(() => null));
  }
  renderCropper() {
    return _function.pipe(imageSearchState.imageUrl, Option.map(() => h("image-cropper", null)), Option.getOrElse(() => null));
  }
  render() {
    return (h(Host, null, imageSearchState.loading ||
      imageSearchState.objectDetectionInProgress ? (h("div", { class: "image-preloader" }, h("vviinn-preloader", null))) : null, h("highlight-box", null), this.renderImage(), this.renderCropper(), imageSearchState.detectedObjects.map((o) => this.renderDetectedObject(o))));
  }
};
VviinnImageView.style = vviinnImageViewCss;

export { VviinnImageView as vviinn_image_view };
