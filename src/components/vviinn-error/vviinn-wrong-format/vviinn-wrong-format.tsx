import { Component, Host, h, Prop } from "@stencil/core";
import i18next from "i18next";
import { WarningIcon } from "../../vviinn-icons";

@Component({
  tag: "vviinn-wrong-format",
  styleUrl: "vviinn-wrong-format.css",
  shadow: true,
})
export class VviinnWrongFormat {
  @Prop() handler: VoidFunction;
  @Prop() addBackground: boolean = true;

  render() {
    return (
      <Host>
        <vviinn-error addBackground={this.addBackground}>
          <WarningIcon />
          <h4 slot="title">{i18next.t("wrongFormatBlock.title")}</h4>
          <span slot="text">{i18next.t("wrongFormatBlock.text")}</span>
          <button slot="action" onClick={this.handler}>
            {i18next.t("wrongFormatBlock.button")}
          </button>
        </vviinn-error>
      </Host>
    );
  }
}
