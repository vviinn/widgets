import { Component, Host, h, Prop } from "@stencil/core";

@Component({
  tag: "vviinn-wrong-format",
  styleUrl: "vviinn-wrong-format.css",
  shadow: true,
})
export class VviinnWrongFormat {
  @Prop() handler: VoidFunction;

  render() {
    return (
      <Host>
        <vviinn-error>
          <h4 slot="title">Dateityp wird nicht unterstützt</h4>
          <span slot="text">
            Leider unterstützen wir dieses Format nicht. Bitte laden Sie eine
            .jpg, .png oder .webp Bilddatei hoch.
          </span>
          <button slot="action" onClick={this.handler}>
            Neues Bild hochladen
          </button>
        </vviinn-error>
      </Host>
    );
  }
}
