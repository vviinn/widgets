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
  private image: O.Option<HTMLImageElement> = O.none;

  private getInsetValue(): string {
    const searchArea = O.fromNullable(imageSearchState.searchArea);

    return pipe(
      sequenceToOption(searchArea, this.image),
      O.map(([selection, image]) => getClipValue(selection, image)),
      O.getOrElse(() => "")
    );
  }

  render() {
    return (
      <Host>
        <img ref={(el) => this.image = O.some(el)}
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
