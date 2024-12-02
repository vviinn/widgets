import { Component, Host, h, Prop, Event, EventEmitter } from "@stencil/core";
import { BasicEventData } from "../../recommendation/events";

@Component({
  tag: "vviinn-overlayed-modal",
  styleUrl: "vviinn-overlayed-modal.css",
  shadow: true,
})
export class VviinnOverlayedModal {
  @Prop() active: boolean = false;
  @Prop() resetState: () => void;
  /** @internal */
  @Prop() buttonElementId?: string;
  /** @internal */
  @Prop() hideBackButton: boolean = false;
  /** @internal */
  @Prop() widgetVersion: string;
  /** @internal */
  @Prop() isFirstScreen: boolean;

  @Event() vviinnWidgetClose: EventEmitter<BasicEventData>;

  render() {
    return (
      <Host class={{ active: this.active }}>
        <vviinn-overlay>
          <vviinn-modal
            resetState={this.resetState}
            active={this.active}
            buttonElementId={this.buttonElementId}
            hideBackButton={this.hideBackButton}
            widgetVersion={this.widgetVersion}
            isFirstScreen={this.isFirstScreen}
          >
            <slot>CONTENT</slot>
          </vviinn-modal>
        </vviinn-overlay>
      </Host>
    );
  }
}
