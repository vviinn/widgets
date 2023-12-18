import { Component, Host, h, Element } from "@stencil/core";

@Component({
  tag: "vviinn-skeleton",
  styleUrl: "vviinn-skeleton.css",
  shadow: true,
})
export class VviinnSkeleton {
  @Element() el: HTMLElement;

  render() {
    return <Host></Host>;
  }
}
