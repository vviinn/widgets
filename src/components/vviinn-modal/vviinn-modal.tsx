import { Component, Host, h, State, Event, EventEmitter } from "@stencil/core";

@Component({
  tag: "vviinn-modal",
  styleUrl: "vviinn-modal.css",
  shadow: true,
})
export class VviinnModal {
  @State() active: boolean = true;

  @Event() modalClosed: EventEmitter<AnimationEvent>;
  @Event() secondaryActionClicked: EventEmitter<void>;

  private close() {
    this.active = false;
    this.modalClosed.emit();
  }

  render() {
    return (
      <Host exportparts="secondary-action,title"
        class={{ closed: !this.active }}
      >
        <div class="head">
          <button part="secondary-action" onClick={() => this.secondaryActionClicked.emit()}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M20.25 12H3.75" stroke="#161616" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
              <path d="M10.5 5.25L3.75 12L10.5 18.75" stroke="#161616" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
            </svg>
          </button>
          <div class="title" part="title">Bildsuche</div>
          <button onClick={() => this.close()}>
            <svg
              width="16"
              height="16"
              viewBox="0 0 16 16"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M16 1.4L14.6 0L8 6.6L1.4 0L0 1.4L6.6 8L0 14.6L1.4 16L8 9.4L14.6 16L16 14.6L9.4 8L16 1.4Z"
                fill="#333333"
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
