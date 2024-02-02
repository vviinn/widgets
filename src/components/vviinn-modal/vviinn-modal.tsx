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
import { SecondaryActionIcon } from "../vviinn-icons/";

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
  /** @internal */
  @Prop() isFirstScreen: boolean;

  @State() slider: boolean = false;

  /** Event emitted when Close Button clicked and close animation ends */
  @Event() vviinnWidgetClose: EventEmitter<BasicEventData>;
  /** @internal */
  @Event({ bubbles: true })
  componentWillLoad() {
    slotChangeListener(this, this.el);
  }

  private resetTopScroll() {
    const element: HTMLElement = this.el.shadowRoot.querySelector(".body");
    element.scroll({ top: 0 });
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
          <img width="28" height="28" src={url} class="title-image" />
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
        class={{ closed: !this.active, "first-screen": this.isFirstScreen }}
        onAnimationEnd={(ev: AnimationEvent) => this.handleAnimationEnd(ev)}
      >
        <div class="head">
          {!this.hideBackButton && (
            <button
              part="secondary-action"
              onClick={() => {
                this.resetState();
                this.resetTopScroll();
              }}
            >
              <SecondaryActionIcon />
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
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
            >
              <path
                d="M12 13.3892L6.91958 18.4696C6.72248 18.6667 6.49095 18.7653 6.225 18.7653C5.95905 18.7653 5.72753 18.6667 5.53043 18.4696C5.33333 18.2725 5.23478 18.041 5.23478 17.775C5.23478 17.5091 5.33333 17.2776 5.53043 17.0805L10.6109 12L5.53043 6.9196C5.33333 6.7225 5.23478 6.49098 5.23478 6.22503C5.23478 5.95908 5.33333 5.72755 5.53043 5.53045C5.72753 5.33335 5.95905 5.2348 6.225 5.2348C6.49095 5.2348 6.72248 5.33335 6.91958 5.53045L12 10.6109L17.0804 5.53045C17.2775 5.33335 17.5091 5.2348 17.775 5.2348C18.041 5.2348 18.2725 5.33335 18.4696 5.53045C18.6667 5.72755 18.7652 5.95908 18.7652 6.22503C18.7652 6.49098 18.6667 6.7225 18.4696 6.9196L13.3892 12L18.4696 17.0805C18.6667 17.2776 18.7652 17.5091 18.7652 17.775C18.7652 18.041 18.6667 18.2725 18.4696 18.4696C18.2725 18.6667 18.041 18.7653 17.775 18.7653C17.5091 18.7653 17.2775 18.6667 17.0804 18.4696L12 13.3892Z"
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
