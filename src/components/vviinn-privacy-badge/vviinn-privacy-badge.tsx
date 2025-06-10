import { Component, Host, h, Element, Prop } from "@stencil/core";
import { slotChangeListener } from "../customized-slots";
import i18next from "i18next";

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

  componentDidLoad() {
    const link = this.el.shadowRoot?.querySelector(
      'a[href*="vviinn.com"]',
    ) as HTMLAnchorElement;
    if (link) {
      link.setAttribute("aria-label", i18next.t("a11y.vviinnLink"));
      link.addEventListener("keydown", (event: KeyboardEvent) => {
        if (event.key === "Enter") {
          event.preventDefault();
          link.click();
        }
      });
    }
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
