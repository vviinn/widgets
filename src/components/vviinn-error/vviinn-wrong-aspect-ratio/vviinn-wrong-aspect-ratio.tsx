import { Component, Host, h, Prop } from "@stencil/core";

import i18next from "i18next";
import { WarningIcon } from "../../vviinn-icons";

@Component({
  tag: "vviinn-wrong-aspect-ratio",
  shadow: true,
})
export class VviinnWrongAspectRatio {
  @Prop() handler: VoidFunction;

  render() {
    return (
      <Host>
        <vviinn-error>
          <WarningIcon />
          <h4 slot="title">
            {/* TODO: Add translations */}
            The image is too narrow
          </h4>
          <button slot="action" onClick={this.handler}>
            {i18next.t("emptyResultsBlock.button")}
          </button>
        </vviinn-error>
      </Host>
    );
  }
}
