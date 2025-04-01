import { Component, Host, h, Prop, Element } from "@stencil/core";

@Component({
  tag: "vviinn-skeleton",
  styleUrl: "vviinn-skeleton.css",
  shadow: true,
})
export class VviinnSkeleton {
  @Element() el: HTMLElement;

  @Prop() height: number;
  @Prop() halfWidth: boolean = false;
  @Prop() aspectRatio?: number;

  render() {
    return (
      <Host>
        <div
          class={{
            "vviinn-skeleton": true,
          }}
          style={{
            height: this.height ? `${this.height.toString()}px` : "100%",
            width: this.halfWidth ? "50%" : "100%",
            "aspect-ratio": this.aspectRatio
              ? `${this.aspectRatio}`
              : undefined,
          }}
        ></div>
      </Host>
    );
  }
}
