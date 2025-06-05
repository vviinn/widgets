import { Component, Host, Prop, h } from "@stencil/core";
import i18next from "i18next";
import { WarningIcon } from "../vviinn-icons";
import { searchState } from "../../store/search.store";
import {
  ErrorType,
  errorI18nKeys,
  errorTypesWithTopMargin,
  errorTypesWithText,
  errorTypesAlwaysShowButton,
} from "./index";

@Component({
  tag: "vviinn-error",
  styleUrl: "vviinn-error.css",
  shadow: true,
})
export class VviinnError {
  @Prop() addBackground: boolean = true;
  @Prop() errorType?: ErrorType;
  @Prop() handler?: VoidFunction;
  @Prop() addTopMargin: boolean = false;

  private getErrorContent() {
    if (!this.errorType) return null;

    const i18nKey = errorI18nKeys[this.errorType];

    return {
      title: i18next.t(`${i18nKey}.title`),
      text: errorTypesWithText.has(this.errorType)
        ? i18next.t(`${i18nKey}.text`)
        : null,
      buttonText: this.shouldShowButton()
        ? i18next.t(`${i18nKey}.button`)
        : null,
    };
  }

  private shouldShowButton(): boolean {
    if (!this.errorType) return false;

    if (errorTypesAlwaysShowButton.has(this.errorType)) return true;

    return (
      this.errorType === "empty-results" && searchState.searchType === "image"
    );
  }

  render() {
    const content = this.getErrorContent();
    const needsTopMargin =
      this.addTopMargin ||
      (this.errorType && errorTypesWithTopMargin.has(this.errorType));

    const hostClasses = { "add-top-margin": needsTopMargin };
    const contentClasses = {
      "error-content": true,
      "add-background": this.addBackground,
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
      <Host class={hostClasses}>
        <div class={contentClasses}>{errorContent}</div>
      </Host>
    );
  }
}
