import { Component, Host, h } from "@stencil/core";
import { getClipValue } from "../../../../geometry/Clip";
import * as O from "fp-ts/lib/Option";
import { pipe } from "fp-ts/function";
import { imageSearchState } from "../../../../store/imageSearch.store";
import { sequenceToOption } from "../../../../utils/option/option";
export class HighlightBox {
  getInsetValue() {
    return pipe(sequenceToOption(imageSearchState.searchArea, imageSearchState.imageBounds), O.map(([selection, image]) => getClipValue(selection, image)), O.getOrElse(() => ""));
  }
  renderImage() {
    return pipe(sequenceToOption(imageSearchState.imageUrl, imageSearchState.imageBounds), O.map(([url, bounds]) => (h("img", { src: url, width: bounds.width, height: bounds.height, style: { "clip-path": `${this.getInsetValue()}` } }))), O.getOrElse(() => ""));
  }
  render() {
    return h(Host, null, this.renderImage());
  }
  static get is() { return "highlight-box"; }
  static get encapsulation() { return "shadow"; }
  static get originalStyleUrls() { return {
    "$": ["highlight-box.css"]
  }; }
  static get styleUrls() { return {
    "$": ["highlight-box.css"]
  }; }
}
