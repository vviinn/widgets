import {
  Component,
  Host,
  h,
  Prop
} from "@stencil/core";
import { Handler, getCursorValue } from "../../../../../cropper/Handler";

@Component({
  tag: "cropper-handler",
  styleUrl: "cropper-handler.css",
  shadow: true,
})
export class CropperHandler {
  @Prop() handler: Handler;
  @Prop() disabled: boolean = false;

  render() {
    return (
      <Host part={`handle ${getCursorValue(this.handler.direction)}`}
        class={{
          disabled: this.disabled,
          [getCursorValue(this.handler.direction)]: true,
        }}
        style={{
          "--size": "20px",
          cursor: getCursorValue(this.handler.direction),
        }}
        draggable={false}
      ></Host>
    );
  }
}
