import { Component, Host, h, Prop, Event, EventEmitter } from "@stencil/core";

@Component({
  tag: "vviinn-overlayed-modal",
  styleUrl: "vviinn-overlayed-modal.css",
  shadow: true,
})
export class VviinnOverlayedModal {
  @Prop() active: boolean = false;

  @Event() secondaryActionClicked: EventEmitter<void>;

  render() {
    return (
      <Host class={{ active: this.active }}>
        <vviinn-overlay>
          <vviinn-modal onSecondaryActionClicked={() => this.secondaryActionClicked.emit()}>
            <slot>CONTENT</slot>
          </vviinn-modal>
        </vviinn-overlay>
      </Host>
    );
  }
}

