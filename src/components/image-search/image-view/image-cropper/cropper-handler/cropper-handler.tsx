import { Component, Host, h, Prop } from "@stencil/core";
import { Handler, getCursorValue } from "../../../../../cropper/Handler";
import styles from "./cropper-handler.css";

@Component({
  tag: "cropper-handler",
  shadow: true,
  styles,
})
export class CropperHandler {
  @Prop() handler: Handler;
  @Prop() disabled: boolean = false;

  render() {
    return (
      <Host
        part={`handle ${getCursorValue(this.handler.direction)}`}
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
