import { Component, Host, h, Element, Prop } from "@stencil/core";

import { slotChangeListener } from "../customized-slots";

@Component({
  tag: "vviinn-teaser",
  styleUrl: "vviinn-teaser.css",
  shadow: true,
})
export class VviinnTeaser {
  @Element() el: HTMLElement;
  @Prop() teaserText: string;

  componentWillLoad() {
    slotChangeListener(this, this.el);
  }

  render() {
    return (
      <Host>
        <slot>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="64"
            height="64"
            fill="none"
          >
            <defs />
            <path
              fill="#C6C6C6"
              d="M48 28a11.98 11.98 0 00-9.77 18.942L28 57.172 30.828 60l10.23-10.23A11.994 11.994 0 1048 28zm0 20a8 8 0 118-8 8.009 8.009 0 01-8 8zM34 24a6 6 0 10-6-6 6.006 6.006 0 006 6zm0-8a2 2 0 110 4 2 2 0 010-4z"
            />
            <path
              fill="#C6C6C6"
              d="M24 48H8V35.993L18 26l11.172 11.172L32 34.336 20.828 23.165a4 4 0 00-5.656 0L8 30.336V8h40v12h4V8a4.004 4.004 0 00-4-4H8a4.004 4.004 0 00-4 4v40a4.005 4.005 0 004 4h16v-4z"
            />
          </svg>
          <span class="vviinn-teaser-text">
            <slot name="vviinn-teaser-text">
              {/* TODO: Finde Produkte auf <br /> einem Foto */}
              {this.teaserText}
            </slot>
          </span>
        </slot>
      </Host>
    );
  }
}
