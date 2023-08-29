import {
  Component,
  Host,
  h,
  State,
  Event,
  EventEmitter,
  Prop,
  Element,
} from "@stencil/core";
import i18next from "i18next";

import { slotChangeListener } from "../customized-slots";
import { BasicEventData } from "../../recommendation/events";
import { campaignTypeNames } from "../../campaign/Campaign";
import { imageSearchState } from "../../store/imageSearch.store";
import * as O from "fp-ts/lib/Option";
import { pipe } from "fp-ts/lib/function";
import { sequenceToOption } from "../../utils/option/option";

@Component({
  tag: "vviinn-modal",
  styleUrl: "vviinn-modal.css",
  shadow: true,
})
export class VviinnModal {
  @Element() el: HTMLElement;

  @Prop({ mutable: true, reflect: true }) active: boolean = false;
  @Prop() resetState: () => void;
  /** @internal */
  @Prop() buttonElementId?: string;
  /** @internal */
  @Prop() widgetVersion: string;
  /** @internal */
  @Prop() hideBackButton: boolean = false;

  @State() slider: boolean = false;

  /** Event emitted when Close Button clicked and close animation ends */
  @Event() vviinnWidgetClose: EventEmitter<BasicEventData>;

  /** @internal */
  @Event({ bubbles: true })
  secondaryActionClicked: EventEmitter;

  componentWillLoad() {
    slotChangeListener(this, this.el);
  }

  private close() {
    this.active = false;

    setTimeout(
      () => {
        this.vviinnWidgetClose.emit({
          widgetType: "VPS",
          campaignTypeId: "VPS",
          campaignTypeName: campaignTypeNames["VPS"],
          widgetId: this.buttonElementId,
          widgetVersion: this.widgetVersion,
        });
      },
      this.slider ? 500 : 0
    );
  }

  private handleAnimationEnd(ev: AnimationEvent) {
    if (ev.animationName !== "fade-in") return;
    this.slider = true;
  }

  private renderImage(): HTMLImageElement | null {
    return pipe(
      sequenceToOption(imageSearchState.imageUrl, imageSearchState.image),
      O.map(([url]) => {
        const image = (
          <img width="32" height="32" src={url} class="title-image" />
        );

        return image;
      }),
      O.getOrElse(() => null)
    );
  }

  render() {
    return (
      <Host
        exportparts="secondary-action, title, close-button"
        class={{ closed: !this.active }}
        onAnimationEnd={(ev: AnimationEvent) => this.handleAnimationEnd(ev)}
      >
        <div class="head">
          {!this.hideBackButton && (
            <button
              part="secondary-action"
              onClick={() => {
                this.resetState();
                this.secondaryActionClicked.emit();
              }}
            >
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M20.25 12H3.75"
                  stroke="currentColor"
                  stroke-width="2"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                />
                <path
                  d="M10.5 5.25L3.75 12L10.5 18.75"
                  stroke="currentColor"
                  stroke-width="2"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                />
              </svg>
            </button>
          )}

          <div class="title" part="title">
            {this.renderImage()}
            <slot name="vviinn-image-search-modal-title">
              {i18next.t("imageSearchModalTitle")}
            </slot>
          </div>

          <button
            onClick={() => this.close()}
            class="close-button"
            part="close-button"
          >
            <svg
              width="16"
              height="16"
              viewBox="0 0 16 16"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M16 1.4L14.6 0L8 6.6L1.4 0L0 1.4L6.6 8L0 14.6L1.4 16L8 9.4L14.6 16L16 14.6L9.4 8L16 1.4Z"
                fill="currentColor"
              />
            </svg>
          </button>
        </div>
        <div class="body">
          <slot></slot>
        </div>
      </Host>
    );
  }
}
