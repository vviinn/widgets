import { Component, Host, h, Prop } from "@stencil/core";

@Component({
  tag: "vviinn-server-error",
  styleUrl: "vviinn-server-error.css",
  shadow: true,
})
export class VviinnServerError {
  @Prop() handler: VoidFunction;

  render() {
    return (
      <Host>
        <vviinn-error>
          <h4 slot="title">Keine Verbindung</h4>
          <span slot="text">
            Etwas hat leider nicht funktioniert. Bitte prüfen Sie Ihre
            Internetverbindung und laden Sie das Bild noch einmal hoch.
          </span>
          <button slot="action" onClick={this.handler}>
            Erneut versuchen
          </button>
        </vviinn-error>
      </Host>
    );
  }
}
