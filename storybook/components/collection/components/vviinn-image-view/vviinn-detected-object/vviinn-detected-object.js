import { Component, Host, h, State, Prop } from "@stencil/core";
import { pipe } from "fp-ts/lib/function";
import * as O from "fp-ts/lib/Option";
import { foldValueObject } from "../../../network/ion/ValueObject";
import { detectedObjectEq, } from "../../../searchSession/searchSession";
import { fromAlt, scaleWithSized, center } from "../../../geometry/Rectangle";
import { imageSearchState, makeRectangularSearchRequest, } from "../../../store/imageSearch.store";
export class VviinnDetectedObject {
  constructor() {
    this.position = ["0", "0"];
  }
  getObjectPosition() {
    return pipe(imageSearchState.imageBounds, O.map((bounds) => {
      const objectRectangle = fromAlt(foldValueObject(this.detectedObject).rectangle);
      const { x, y } = pipe(objectRectangle, scaleWithSized(bounds), center);
      return [`${x}px`, `${y}px`];
    }), O.getOrElse(() => ["0", "0"]));
  }
  selectDetectedObject() {
    pipe(imageSearchState.imageBounds, O.map((bounds) => {
      const rectangle = foldValueObject(this.detectedObject).rectangle;
      const transformedRect = fromAlt(rectangle);
      const scaledRect = scaleWithSized(bounds)(transformedRect);
      imageSearchState.detectedObject = this.detectedObject;
      imageSearchState.searchArea = O.some(scaledRect);
    }));
    makeRectangularSearchRequest();
  }
  isActive() {
    if (!this.detectedObject)
      return false;
    if (!imageSearchState.detectedObject)
      return false;
    const thisObject = foldValueObject(this.detectedObject);
    const savedObject = foldValueObject(imageSearchState.detectedObject);
    return detectedObjectEq.equals(thisObject, savedObject);
  }
  render() {
    return (h(Host, { class: {
        active: this.isActive(),
      }, onClick: () => this.selectDetectedObject(), style: {
        "--x-position": this.getObjectPosition()[0],
        "--y-position": this.getObjectPosition()[1],
      } }));
  }
  static get is() { return "vviinn-detected-object"; }
  static get encapsulation() { return "shadow"; }
  static get originalStyleUrls() { return {
    "$": ["vviinn-detected-object.css"]
  }; }
  static get styleUrls() { return {
    "$": ["vviinn-detected-object.css"]
  }; }
  static get properties() { return {
    "detectedObject": {
      "type": "unknown",
      "mutable": false,
      "complexType": {
        "original": "ValueObject<DetectedObject>",
        "resolved": "Valueable<DetectedObject> & Partial<MemberObject> & Partial<Linked>",
        "references": {
          "ValueObject": {
            "location": "import",
            "path": "../../../network/ion/ValueObject"
          },
          "DetectedObject": {
            "location": "import",
            "path": "../../../searchSession/searchSession"
          }
        }
      },
      "required": false,
      "optional": false,
      "docs": {
        "tags": [],
        "text": ""
      }
    }
  }; }
  static get states() { return {
    "position": {}
  }; }
}
