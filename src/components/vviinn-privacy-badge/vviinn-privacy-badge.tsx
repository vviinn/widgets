import { Component, Host, h, Element, Prop } from "@stencil/core";
import { slotChangeListener } from "../customized-slots";

@Component({
  tag: "vviinn-privacy-badge",
  styleUrl: "vviinn-privacy-badge.css",
  shadow: true,
})
export class VviinnPrivacyBadge {
  @Element() el: HTMLElement;
  @Prop() privacyBadgeText: string;

  componentWillLoad() {
    slotChangeListener(this, this.el);
  }

  render() {
    return (
      <Host>
        <slot name="vviinn-privacy-badge-text">
          <div innerHTML={this.privacyBadgeText}></div>
        </slot>
      </Host>
    );
  }
}
