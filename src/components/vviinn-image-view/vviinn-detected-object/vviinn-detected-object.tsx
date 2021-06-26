import { Component, Host, h, State, Prop } from "@stencil/core";
import { pipe } from "fp-ts/lib/function";
import { ValueObject, foldValueObject } from "../../../network/ion/ValueObject";
import { DetectedObject } from "../../../searchSession/searchSession";
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

  private getObjectPosition() {
    const objectRectangle = fromAlt(
      foldValueObject(this.detectedObject).rectangle
    );

    const { x, y } = pipe(
      objectRectangle,
      scaleWithSized(imageSearchState.imageBounds),
      center
    );

    return [`${x}px`, `${y}px`];
  }

  private selectDetectedObject() {
    const rectangle = foldValueObject(this.detectedObject).rectangle;
    const transformedRect = fromAlt(rectangle);
    const scaledRect = scaleWithSized(imageSearchState.imageBounds)(
      transformedRect
    );

    imageSearchState.searchArea = scaledRect;

    makeRectangularSearchRequest();
  }

  @State() position: [string, string] = ["0", "0"];
  render() {
    return (
      <Host
        onCLick={() => this.selectDetectedObject()}
        style={{
          "--x-position": this.getObjectPosition()[0],
          "--y-position": this.getObjectPosition()[1],
        }}
      ></Host>
    );
  }
}
