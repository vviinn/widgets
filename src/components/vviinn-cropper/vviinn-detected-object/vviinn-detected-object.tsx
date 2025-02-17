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
import { ValueObject, foldValueObject } from "../../../network/ion/ValueObject";
import {
  DetectedObject,
  detectedObjectEq,
} from "../../../searchSession/searchSession";
import {
  fromAlt,
  scaleWithSized,
  center,
  Rectangle,
} from "../../../geometry/Rectangle";
import {
  BasicEventData,
  SelectObjectEventData,
} from "../../../recommendation/events";

@Component({
  tag: "vviinn-detected-object",
  styleUrl: "vviinn-detected-object.css",
  shadow: true,
})
export class VviinnDetectedObject {
  @Prop() detectedObject: ValueObject<DetectedObject>;
  @Prop() selectedDetectedObject: ValueObject<DetectedObject>;
  @Prop() basicEventData: BasicEventData;
  @Prop() imageBounds: Rectangle | null;
  @Prop() showInWidget: boolean;

  @Event({ bubbles: true })
  vviinnSelectObject: EventEmitter<SelectObjectEventData>;

  private getObjectPosition(): [string, string] {
    return pipe(
      O.fromNullable(this.imageBounds),
      O.map((bounds) => {
        const objectRectangle = fromAlt(
          foldValueObject(this.detectedObject).rectangle,
        );

        const { x, y } = pipe(objectRectangle, scaleWithSized(bounds), center);

        return [`${x}px`, `${y}px`];
      }),
      O.getOrElse(() => ["0", "0"]),
    );
  }

  private selectDetectedObject() {
    const scaledRect = pipe(
      O.fromNullable(this.imageBounds),
      O.map((bounds) => {
        const rectangle = foldValueObject(this.detectedObject).rectangle;
        const transformedRect = fromAlt(rectangle);
        return scaleWithSized(bounds)(transformedRect);
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

    const thisObject = foldValueObject(this.detectedObject);
    const savedObject = foldValueObject(this.selectedDetectedObject);

    return detectedObjectEq.equals(thisObject, savedObject);
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
