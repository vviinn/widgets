import { Component, Host, h, Event, EventEmitter } from "@stencil/core";

@Component({
  tag: "vviinn-empty-results",
  styleUrl: "vviinn-empty-results.css",
  shadow: true,
})
export class VviinnEmptyResults {
  @Event() actionClick: EventEmitter<void>;

  render() {
    return (
      <Host>
        <vviinn-error>
          <h4 slot="title">Leider nichts gefunden</h4>
          <span slot="text">
            Leider konnten wir keine passenden Produkte finden. Bitte versuche
            es mit einem anderen Bildausschnitt noch einmal.
          </span>
          <button slot="action" onClick={() => this.actionClick.emit()}>
            Erneut versuchen
          </button>
        </vviinn-error>
      </Host>
    );
  }
}
