import { Component, Host, h, Prop, Event, EventEmitter } from "@stencil/core";
import { pipe } from "fp-ts/lib/function";
import { IonItem, foldIonItem } from "../../../../network/ionClient";
import { DetectedObject } from "../../../../searchSession/searchSession";

import {
  fromAlt,
  scaleWithSized,
  center,
} from "../../../../geometry/Rectangle";

@Component({
  tag: "detected-object-view",
  styleUrl: "detected-object.css",
  shadow: true,
})
export class DetectedObjectView {
  @Prop() referenceImage: HTMLImageElement;
  @Prop() detectedObject: IonItem<DetectedObject>;

  @Event() detectedObjectSelected:
    | EventEmitter<IonItem<DetectedObject>>
    | undefined;

  private translate(): [string, string] {
    const objectRectangle = fromAlt(foldIonItem(this.detectedObject).rectangle);

    const { x, y } = pipe(
      objectRectangle,
      scaleWithSized(this.referenceImage),
      center
    );

    return [`${x}px`, `${y}px`];
  }

  render() {
    return (
      <Host
        style={{
          "--x-position": this.translate()[0],
          "--y-position": this.translate()[1],
        }}
        onClick={() => this.detectedObjectSelected.emit(this.detectedObject)}
      ></Host>
    );
  }
}
