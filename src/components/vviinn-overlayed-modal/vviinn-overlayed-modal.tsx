import { Component, Host, h, Prop, Event, EventEmitter } from "@stencil/core";

@Component({
  tag: "vviinn-overlayed-modal",
  styleUrl: "vviinn-overlayed-modal.css",
  shadow: true,
})
export class VviinnOverlayedModal {
  @Prop() active: boolean = false;

  @Event() secondaryActionClicked: EventEmitter<void>;
  @Event() modalClosed: EventEmitter<void>;

  private close() {
    this.active = false;
    this.modalClosed.emit();
  }

  render() {
    return (
      <Host class={{ active: this.active }}>
        <vviinn-overlay>
          <vviinn-modal
            onSecondaryActionClicked={() => this.secondaryActionClicked.emit()}
            onModalClosed={() => this.close()}
          >
            <slot>CONTENT</slot>
          </vviinn-modal>
        </vviinn-overlay>
      </Host>
    );
  }
}
