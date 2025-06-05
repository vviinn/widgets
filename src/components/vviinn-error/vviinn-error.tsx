import { Component, Host, Prop, h } from "@stencil/core";

@Component({
  tag: "vviinn-error",
  styleUrl: "vviinn-error.css",
  shadow: true,
})
export class VviinnError {
  @Prop() addBackground: boolean = true;

  render() {
    return (
      <Host class={{ "add-background": this.addBackground }}>
        <slot name="icon"></slot>
        <slot name="title"></slot>
        <slot name="text"></slot>
        <slot name="action"></slot>
      </Host>
    );
  }
}
