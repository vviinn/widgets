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
    const searchArea = O.fromNullable(imageSearchState.searchArea);
    const imageBounds = O.fromNullable(imageSearchState.imageBounds);
    return pipe(
      sequenceToOption(searchArea, imageBounds),
      O.map(([selection, image]) => getClipValue(selection, image)),
      O.getOrElse(() => "")
    );
  }

  render() {
    return (
      <Host>
        <img
          src={imageSearchState.resizedImageUrl}
          style={{
            background: "black",
            "clip-path": `${this.getInsetValue()}`,
          }}
        />
      </Host>
    );
  }
}
