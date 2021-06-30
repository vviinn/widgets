import { Component, Host, h, State, Prop } from "@stencil/core";
import { pipe } from "fp-ts/lib/function";
import * as O from "fp-ts/lib/Option";
import { ValueObject, foldValueObject } from "../../../network/ion/ValueObject";
import {
  DetectedObject,
  detectedObjectEq,
} from "../../../searchSession/searchSession";
import { fromAlt, scaleWithSized, center } from "../../../geometry/Rectangle";
import {
  imageSearchState,
  makeRectangularSearchRequest,
} from "../../../store/imageSearch.store";

@Component({
  tag: "vviinn-detected-object",
  styleUrl: "vviinn-detected-object.css",
  shadow: true,
})
export class VviinnDetectedObject {
  @Prop() detectedObject: ValueObject<DetectedObject>;

  private getObjectPosition(): [string, string] {
    return pipe(
      imageSearchState.imageBounds,
      O.map((bounds) => {
        const objectRectangle = fromAlt(
          foldValueObject(this.detectedObject).rectangle
        );

        const { x, y } = pipe(objectRectangle, scaleWithSized(bounds), center);

        return [`${x}px`, `${y}px`];
      }),
      O.getOrElse(() => ["0", "0"])
    );
  }

  private selectDetectedObject() {
    pipe(
      imageSearchState.imageBounds,
      O.map((bounds) => {
        const rectangle = foldValueObject(this.detectedObject).rectangle;
        const transformedRect = fromAlt(rectangle);
        const scaledRect = scaleWithSized(bounds)(transformedRect);

        imageSearchState.detectedObject = this.detectedObject;
        imageSearchState.searchArea = scaledRect;
      })
    );

    makeRectangularSearchRequest();
  }

  private isActive(): boolean {
    if (!this.detectedObject) return false;
    if (!imageSearchState.detectedObject) return false;

    const thisObject = foldValueObject(this.detectedObject);
    const savedObject = foldValueObject(imageSearchState.detectedObject);

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
