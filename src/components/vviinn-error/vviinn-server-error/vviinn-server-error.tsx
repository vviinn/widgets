import { Component, Host, h, Prop } from "@stencil/core";
import i18next from "i18next";
import { WarningIcon } from "../../vviinn-icons";

@Component({
  tag: "vviinn-server-error",
  styleUrl: "vviinn-server-error.css",
  shadow: true,
})
export class VviinnServerError {
  @Prop() handler: VoidFunction;

  render() {
    return (
      <Host>
        <vviinn-error>
          <WarningIcon />
          <h4 slot="title">{i18next.t("serverErrorBlock.title")}</h4>
          <button slot="action" onClick={this.handler}>
            {i18next.t("serverErrorBlock.button")}
          </button>
        </vviinn-error>
      </Host>
    );
  }
}
