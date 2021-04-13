import { Component, Host, h, Prop } from "@stencil/core";
import { ClipShape, getClipValue } from "../../../../geometry/Clip";
import * as O from "fp-ts/Option";
import { pipe } from "fp-ts/function";
import { Rectangular } from "../../../../geometry/Rectangle";
import { RectangleAlt } from "../../../../geometry/RectangleAlt";

@Component({
  tag: "highlight-box",
  styleUrl: "highlight-box.css",
  shadow: true,
})
export class HighlightBox {
  @Prop() image: HTMLImageElement | undefined;
  @Prop() selection: ClipShape | undefined;

  private getInsetValue(): string {
    return pipe(
      O.fromNullable(this.selection),
      O.map((selection) => getClipValue(selection, this.image)),
      O.getOrElse(() => "")
    );
  }

  private translate(): string {
    switch (this.selection.kind) {
      case "rectangle":
        return this.translateRectangle(this.selection);
      case "rectangleAlt":
        return this.translateRectangleAlt(this.selection);
    }
  }

  private translateRectangle(rect: Rectangular): string {
    return `translate(${rect.position.x}px, ${rect.position.y}px)`;
  }

  private translateRectangleAlt(rect: RectangleAlt): string {
    const top = this.image.height * rect.top;
    const left = this.image.width * rect.left;
    const width = this.image.width * rect.width;
    const height = this.image.height * rect.height;

    return `translate(${left + width * 0.5}px, ${top + height * 0.5}px)`;
  }

  render() {
    return (
      <Host>
        {this.selection.kind === "rectangleAlt" ? (
          <div class="pointer" style={{ transform: this.translate() }}></div>
        ) : null}

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
