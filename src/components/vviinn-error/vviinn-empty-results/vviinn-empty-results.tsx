import { Component, Host, h } from "@stencil/core";

import i18next from "i18next";

@Component({
  tag: "vviinn-empty-results",
  styleUrl: "vviinn-empty-results.css",
  shadow: true,
})
export class VviinnEmptyResults {
  render() {
    return (
      <Host>
        <vviinn-error>
          <svg
            slot="icon"
            class="icon"
            width="32"
            height="32"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M16 2a14 14 0 1 0 0 28 14 14 0 0 0 0-28Zm0 26a12 12 0 1 1 0-24 12 12 0 0 1 0 24Z"
              fill="#525252"
            />
            <path
              d="M17 8h-2v11h2V8Zm-1 14a1.5 1.5 0 1 0 0 3 1.5 1.5 0 0 0 0-3Z"
              fill="#525252"
            />
          </svg>
          <h4 slot="title">{i18next.t("emptyResultsBlock.title")}</h4>
          <span slot="text">{i18next.t("emptyResultsBlock.text")}</span>
        </vviinn-error>
      </Host>
    );
  }
}
