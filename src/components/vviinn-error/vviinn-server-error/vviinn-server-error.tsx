import { Component, Host, h, Event, EventEmitter } from "@stencil/core";

@Component({
  tag: "vviinn-server-error",
  styleUrl: "vviinn-server-error.css",
  shadow: true,
})
export class VviinnServerError {
  @Event() actionClick: EventEmitter<void>;

  render() {
    return (
      <Host>
        <vviinn-error>
          <h4 slot="title">Keine Verbindung</h4>
          <span slot="text">
            Etwas hat leider nicht funktioniert. Bitte prüfen Sie Ihre
            Internetverbindung und laden Sie das Bild noch einmal hoch.
          </span>
          <button slot="action" onClick={() => this.actionClick.emit()}>
            Erneut versuchen
          </button>
        </vviinn-error>
      </Host>
    );
  }
}
