import { Component, Host, h, Prop } from "@stencil/core";

import i18next from "i18next";
import { WarningIcon } from "../../vviinn-icons";

@Component({
  tag: "vviinn-empty-results",
  shadow: true,
})
export class VviinnEmptyResults {
  @Prop() handler: VoidFunction;

  render() {
    return (
      <Host>
        <vviinn-error>
          <WarningIcon />
          <h4 slot="title">{i18next.t("emptyResultsBlock.title")}</h4>
          <button slot="action" onClick={this.handler}>
            {i18next.t("emptyResultsBlock.button")}
          </button>
        </vviinn-error>
      </Host>
    );
  }
}
