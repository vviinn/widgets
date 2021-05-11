import {
  Component,
  Host,
  h,
  Prop,
  Event,
  EventEmitter,
  Listen,
  State,
} from "@stencil/core";
import { pipe } from "fp-ts/lib/function";
import {
  ValueObject,
  foldValueObject,
} from "../../../../network/ion/ValueObject";
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
  @Prop() detectedObject: ValueObject<DetectedObject>;

  @State() position: [string, string] = ["0", "0"];

  @Event()
  detectedObjectSelected: EventEmitter<ValueObject<DetectedObject>> | undefined;

  @Listen("imageContainerResized", { target: "window" })
  handleImageResizing() {
    setTimeout(() => {
      this.position = this.translate();
    }, 100);
  }

  private translate(): [string, string] {
    const objectRectangle = fromAlt(
      foldValueObject(this.detectedObject).rectangle
    );

    const { x, y } = pipe(
      objectRectangle,
      scaleWithSized(this.referenceImage),
      center
    );

    return [`${x}px`, `${y}px`];
  }

  componentDidLoad() {
    this.position = this.translate();
  }

  render() {
    return (
      <Host
        style={{
          "--x-position": this.position[0],
          "--y-position": this.position[1],
        }}
        onClick={() => this.detectedObjectSelected.emit(this.detectedObject)}
      ></Host>
    );
  }
}
