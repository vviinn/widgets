import { Component, Host, h, Prop } from "@stencil/core";

import i18next from "i18next";
import { WarningIcon } from "../../vviinn-icons";
import { searchState } from "../../../store/search.store";

@Component({
  tag: "vviinn-empty-results",
  styleUrl: "vviinn-empty-results.css",
  shadow: true,
})
export class VviinnEmptyResults {
  @Prop() handler: VoidFunction;
  @Prop() addBackground: boolean = true;

  render() {
    return (
      <Host>
        <vviinn-error addBackground={this.addBackground}>
          <WarningIcon />
          <h4 slot="title">{i18next.t("emptyResultsBlock.title")}</h4>
          {searchState.searchType === "image" && (
            <button slot="action" onClick={this.handler}>
              {i18next.t("emptyResultsBlock.button")}
            </button>
          )}
        </vviinn-error>
      </Host>
    );
  }
}
