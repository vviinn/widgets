import { Component, Host, h, Prop, Element } from "@stencil/core";
import styles from "./vviinn-product-card.css";

@Component({
  tag: "vviinn-product-card-skeleton",
  shadow: true,
  styles,
})
export class VviinnProductCardSkeleton {
  @Element() el: HTMLElement;

  @Prop() imageRatio: number = 1;

  render() {
    return (
      <Host
        class={{
          animated: true,
        }}
      >
        <div style={{ "aspect-ratio": "1", width: "100%" }}>
          <vviinn-skeleton />
        </div>
        <div class="content-container">
          <vviinn-skeleton height={40} />
          <vviinn-skeleton height={20} halfWidth={true} />
          <vviinn-skeleton height={40} />
        </div>
      </Host>
    );
  }
}
