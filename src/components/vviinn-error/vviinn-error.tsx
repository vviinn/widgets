import { Component, Host, Prop, h } from "@stencil/core";
import i18next from "i18next";
import { WarningIcon } from "../vviinn-icons";
import { ErrorType, errorTypeConfig } from "./index";
import { getAcceptableFileFormatsForDisplay } from "../../Image/error";

@Component({
  tag: "vviinn-error",
  styleUrl: "vviinn-error.css",
  shadow: true,
})
export class VviinnError {
  @Prop() hasBackground: boolean = true;
  @Prop() errorType?: ErrorType;
  @Prop() handler?: VoidFunction;
  @Prop() hasTopMargin: boolean = false;
  @Prop() searchType?: string;

  private getErrorContent() {
    if (!this.errorType) return null;

    const config = errorTypeConfig[this.errorType];

    const translationOptions =
      this.errorType === "wrong-format"
        ? { formats: getAcceptableFileFormatsForDisplay() }
        : undefined;

    const textKey = `${config.i18nKey}.text`;
    const buttonKey = `${config.i18nKey}.button`;

    return {
      title: i18next.t(`${config.i18nKey}.title`),
      text: i18next.exists(textKey)
        ? i18next.t(textKey, translationOptions)
        : null,
      buttonText: this.hasButton() ? i18next.t(buttonKey) : null,
    };
  }

  private hasButton(): boolean {
    if (!this.errorType) return false;

    const config = errorTypeConfig[this.errorType];
    const buttonKey = `${config.i18nKey}.button`;

    if (!i18next.exists(buttonKey)) return false;

    return !!this.handler;
  }

  render() {
    const content = this.getErrorContent();

    const contentClasses = {
      "error-content": true,
      "add-background": this.hasBackground,
    };

    const errorContent = this.errorType
      ? [
          <WarningIcon />,
          <h4>{content?.title}</h4>,
          content?.text && <span>{content.text}</span>,
          content?.buttonText && (
            <button onClick={this.handler}>{content.buttonText}</button>
          ),
        ]
      : [
          <slot name="icon"></slot>,
          <slot name="title"></slot>,
          <slot name="text"></slot>,
          <slot name="action"></slot>,
        ];

    return (
      <Host>
        <div class={contentClasses}>{errorContent}</div>
      </Host>
    );
  }
}
