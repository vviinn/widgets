import { Component, Host, h, Prop, Event, EventEmitter } from "@stencil/core";
import { getClipValue } from "../../../../geometry/Clip";
import * as O from "fp-ts/lib/Option";
import { Option } from "fp-ts/lib/Option";
import { pipe } from "fp-ts/function";
import {
  Rectangle,
  scaleWithSized,
} from "../../../../geometry/Rectangle";
import { IonLink } from "../../../../network/ionClient";

@Component({
  tag: "highlight-box",
  styleUrl: "highlight-box.css",
  shadow: true,
})
export class HighlightBox {
  @Prop() image: HTMLImageElement | undefined;
  @Prop() selection: Rectangle | undefined;
  @Prop() link: Option<IonLink> | undefined;
  @Prop() index: number = 0;

  @Event() detectedObjectSelected:
    | EventEmitter<[Rectangle, IonLink]>
    | undefined;

  private getInsetValue(): string {
    return pipe(
      O.fromNullable(this.selection),
      O.map(scaleWithSized(this.image)),
      O.map((selection) => getClipValue(selection, this.image)),
      O.getOrElse(() => "")
    );
  }

  render() {
    return (
      <Host>
        <img
          src={this.image.src}
          style={{
            background: "black",
            "clip-path": `${this.getInsetValue()}`,
          }}
        />
      </Host>
    );
  }
}
