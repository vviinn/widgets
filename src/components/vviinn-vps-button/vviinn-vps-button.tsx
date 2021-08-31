import { Component, Host, h, Prop, State, Listen } from "@stencil/core";

@Component({
  tag: "vviinn-vps-button",
  styleUrl: "vviinn-vps-button.css",
  shadow: false,
})
export class VviinnVpsButton {
  /** vviinn customer token */
  @Prop() token: string;
  /** Currency sign will shown after price */
  @Prop() currencySign: string = "€";
  /** Locale for currency formatting */
  @Prop() locale: string = "de-DE";

  @State() pressed: boolean = false;

  @Listen("modalClosed")
  handleModalClosed() {
    this.pressed = false;
  }

  private handleKeyDown(ev: KeyboardEvent) {
    if (ev.code !== "Enter" && ev.code !== "Space") return;
    this.pressed = true;
  }

  private handleClick() {
    this.pressed = true;
  }

  render() {
    return (
      <Host
        tabindex="0"
        role="button"
        pressed={this.pressed}
        onClick={() => this.handleClick()}
        onKeyDown={(ev: KeyboardEvent) => this.handleKeyDown(ev)}
      >
        <slot>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="28"
            height="28"
            fill="none"
          >
            <defs />
            <path
              fill="#525252"
              fill-rule="evenodd"
              d="M9.771 3.89a.875.875 0 01.728-.39h7c.293 0 .566.146.728.39l1.49 2.235h3.033a2.625 2.625 0 012.625 2.625V21a2.625 2.625 0 01-2.625 2.625H5.25A2.625 2.625 0 012.625 21V8.75A2.625 2.625 0 015.25 6.125h3.031l1.49-2.235zm1.197 1.36l-1.49 2.235a.875.875 0 01-.729.39H5.25a.875.875 0 00-.875.875V21a.875.875 0 00.875.875h17.5a.875.875 0 00.875-.875V8.75a.875.875 0 00-.875-.875h-3.5a.875.875 0 01-.729-.39l-1.49-2.235h-6.063z"
              clip-rule="evenodd"
            />
            <path
              fill="#525252"
              fill-rule="evenodd"
              d="M14 11.375a3.062 3.062 0 100 6.125 3.062 3.062 0 000-6.125zm-4.813 3.063a4.812 4.812 0 119.625 0 4.812 4.812 0 01-9.625 0z"
              clip-rule="evenodd"
            />
          </svg>
        </slot>
        <vviinn-vps-widget
          active={this.pressed}
          currency-sign="€"
          token={this.token}
        />
      </Host>
    );
  }
}
