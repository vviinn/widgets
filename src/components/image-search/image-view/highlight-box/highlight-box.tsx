import { Component, Host, h } from "@stencil/core";
import { getClipValue } from "../../../../geometry/Clip";
import * as O from "fp-ts/lib/Option";
import { pipe } from "fp-ts/function";
import { imageSearchState } from "../../../../store/imageSearch.store";
import { sequenceToOption } from "../../../../utils/option/option";

@Component({
  tag: "highlight-box",
  styleUrl: "highlight-box.css",
  shadow: true,
})
export class HighlightBox {
  private getInsetValue(): string {
    return pipe(
      sequenceToOption(
        imageSearchState.searchArea,
        imageSearchState.imageBounds
      ),
      O.map(([selection, image]) => getClipValue(selection, image)),
      O.getOrElse(() => "")
    );
  }

  private renderImage(): HTMLImageElement | string {
    return pipe(
      sequenceToOption(imageSearchState.imageUrl, imageSearchState.imageBounds),
      O.map(([url, bounds]) => (
        <img
          src={url}
          width={bounds.width}
          height={bounds.height}
          style={{ "clip-path": `${this.getInsetValue()}` }}
        />
      )),
      O.getOrElse(() => "")
    );
  }

  render() {
    return <Host>{this.renderImage()}</Host>;
  }
}
