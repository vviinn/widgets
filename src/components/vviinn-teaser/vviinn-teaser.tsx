import { Component, Host, h, Element } from "@stencil/core";
import i18next from "i18next";

import { slotChangeListener } from "../customized-slots";

@Component({
  tag: "vviinn-teaser",
  styleUrl: "vviinn-teaser.css",
  shadow: true,
})
export class VviinnTeaser {
  @Element() el: HTMLElement;

  componentWillLoad() {
    slotChangeListener(this, this.el);
  }

  render() {
    return (
      <Host>
        <slot>
          <span class="vviinn-teaser-text">
            <slot name="vviinn-teaser-text">{i18next.t("teaserText")}</slot>
          </span>
        </slot>
      </Host>
    );
  }
}
