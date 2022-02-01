import { Component, Host, h } from "@stencil/core";
import { imageSearchState } from "../../store/imageSearch.store";
import { pipe } from "fp-ts/lib/function";
import * as O from "fp-ts/lib/Option";
import { sequenceToOption } from "../../utils/option/option";
import { fromImage, move } from "../../geometry/Rectangle";
import { dimensionsFromImage, scaleByLargestSide } from "../../Image/sizing";
const getImageSizes = (i) => {
  const dimensions = dimensionsFromImage(i);
  const resize = scaleByLargestSide(288);
  const newDimensions = resize(dimensions);
  const sizes = newDimensions.map(d => d.size);
  return [sizes[0], sizes[1]];
};
export class VviinnImageView {
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
    imageSearchState.imageBounds = O.some(imageBounds);
    imageSearchState.searchArea = O.some(searchArea);
  }
  renderDetectedObject(object) {
    return h("vviinn-detected-object", { detectedObject: object });
  }
  renderImage() {
    return pipe(sequenceToOption(imageSearchState.imageUrl, imageSearchState.image), O.map(([url, refImage]) => {
      const [width, height] = getImageSizes(refImage);
      const image = (h("img", { decoding: "async", width: width, height: height, src: url, onLoad: (el) => this.handleInitialImageLoad(el), draggable: false }));
      return image;
    }), O.getOrElse(() => null));
  }
  renderCropper() {
    return pipe(imageSearchState.imageUrl, O.map(() => h("image-cropper", null)), O.getOrElse(() => null));
  }
  render() {
    return (h(Host, null,
      imageSearchState.loading ||
        imageSearchState.objectDetectionInProgress ? (h("div", { class: "image-preloader" },
        h("vviinn-preloader", null))) : null,
      h("highlight-box", null),
      this.renderImage(),
      this.renderCropper(),
      imageSearchState.detectedObjects.map((o) => this.renderDetectedObject(o))));
  }
  static get is() { return "vviinn-image-view"; }
  static get encapsulation() { return "shadow"; }
  static get originalStyleUrls() { return {
    "$": ["vviinn-image-view.css"]
  }; }
  static get styleUrls() { return {
    "$": ["vviinn-image-view.css"]
  }; }
}
