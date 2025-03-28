import {
  Component,
  Host,
  h,
  State,
  Prop,
  Event,
  EventEmitter,
} from "@stencil/core";
import { pipe } from "fp-ts/lib/function";
import * as O from "fp-ts/lib/Option";
import { detectedObjectEq } from "../../../searchSession/searchSession";
import { scaleWithSized, center } from "../../../geometry/Rectangle";
import {
  BasicEventData,
  SelectObjectEventData,
} from "../../../recommendation/events";
import { Rectangle } from "../../../interfaces/search";

@Component({
  tag: "vviinn-detected-object",
  styleUrl: "vviinn-detected-object.css",
  shadow: true,
})
export class VviinnDetectedObject {
  @Prop() detectedObject: Rectangle;
  @Prop() selectedDetectedObject: Rectangle;
  @Prop() basicEventData: BasicEventData;
  @Prop() imageBounds: Rectangle | null;
  @Prop() showInWidget: boolean;

  @Event({ bubbles: true })
  vviinnSelectObject: EventEmitter<SelectObjectEventData>;

  private getObjectPosition(): [string, string] {
    return pipe(
      O.fromNullable(this.imageBounds),
      O.map((bounds) => {
        const { left, top } = pipe(
          this.detectedObject,
          scaleWithSized(bounds),
          center,
        );

        return [`${left}px`, `${top}px`];
      }),
      O.getOrElse(() => ["0", "0"]),
    );
  }

  private selectDetectedObject() {
    const scaledRect = pipe(
      O.fromNullable(this.imageBounds),
      O.map((bounds) => {
        return scaleWithSized(bounds)(this.detectedObject);
      }),
      O.toNullable,
    );

    this.vviinnSelectObject.emit({
      ...this.basicEventData,
      detectedObject: this.detectedObject,
      searchArea: scaledRect,
    });
  }

  private isActive(): boolean {
    if (!this.detectedObject || !this.selectedDetectedObject) return false;

    return detectedObjectEq.equals(
      this.detectedObject,
      this.selectedDetectedObject,
    );
  }

  @State() position: [string, string] = ["0", "0"];
  render() {
    return (
      <Host
        class={{
          active: this.isActive(),
        }}
        onClick={() => this.selectDetectedObject()}
        style={{
          "--x-position": this.getObjectPosition()[0],
          "--y-position": this.getObjectPosition()[1],
        }}
      ></Host>
    );
  }
}
