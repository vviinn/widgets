import { Component, Host, h, Prop, Event, EventEmitter } from "@stencil/core";
import { Rectangle } from "../../../../geometry/Rectangle";

@Component({
  tag: "selection-box",
  styleUrl: "selection-box.css",
  shadow: true,
})
export class SelectionBox {
  @Prop() selection: Rectangle | undefined;

  @Event() selectionClicked: EventEmitter<Rectangle>;

  render() {
    return (
      <Host
        style={{
          width: `${this.selection.width}px`,
          height: `${this.selection.height}px`,
          transform: `translate(${this.selection.position.x}px, ${this.selection.position.y}px)`,
        }}
        onClick={() => this.selectionClicked.emit(this.selection)}
      ></Host>
    );
  }
}
