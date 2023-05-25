import { Component, Host, h, Prop, Event, EventEmitter } from "@stencil/core";

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

  @Event() vviinnWidgetClose: EventEmitter<void>;

  render() {
    return (
      <Host class={{ active: this.active }}>
        <vviinn-overlay>
          <vviinn-modal
            resetState={this.resetState}
            active={this.active}
            buttonElementId={this.buttonElementId}
          >
            <slot>CONTENT</slot>
          </vviinn-modal>
        </vviinn-overlay>
      </Host>
    );
  }
}
