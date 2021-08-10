import { Component, Host, h, Event, EventEmitter } from "@stencil/core";

@Component({
  tag: "vviinn-wrong-format",
  styleUrl: "vviinn-wrong-format.css",
  shadow: true,
})
export class VviinnWrongFormat {
  @Event() actionClick: EventEmitter<void>;

  render() {
    return (
      <Host>
        <vviinn-error>
          <h4 slot="title">Dateityp wird nicht unterstützt</h4>
          <span slot="text">
            Leider unterstützen wir dieses Format nicht. Bitte laden Sie eine
            .jpg, .png oder .gif Bilddatei hoch.
          </span>
          <button slot="action" onClick={() => this.actionClick.emit()}>
            Neues Bild hochladen
          </button>
        </vviinn-error>
      </Host>
    );
  }
}
