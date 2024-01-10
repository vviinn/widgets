import { Component, Host, h, Prop, Element } from "@stencil/core";

@Component({
  tag: "vviinn-skeleton",
  styleUrl: "vviinn-skeleton.css",
  shadow: true,
})
export class VviinnSkeleton {
  @Element() el: HTMLElement;

  @Prop() height: number;
  @Prop() squared: boolean = false;
  @Prop() halfWidth: boolean = false;

  render() {
    return (
      <Host>
        <div
          class={{
            "vviinn-skeleton": true,
            "vviinn-skeleton--squared": this.squared,
          }}
          style={{
            height: `${this.height.toString()}px`,
            width: this.halfWidth ? "50%" : "100%",
          }}
        ></div>
      </Host>
    );
  }
}
