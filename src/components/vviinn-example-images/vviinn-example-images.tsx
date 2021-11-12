import { Component, Host, h, Event, EventEmitter, Listen, Element } from "@stencil/core";
import { slotChangeListener } from "../customized-slots";

@Component({
  tag: "vviinn-example-images",
  styleUrl: "vviinn-example-images.css",
  shadow: true,
})
export class VviinnExampleImages {
  @Element() el: HTMLElement;
  @Event() imageSelected: EventEmitter<void>;
  @Event() imageSelectedError: EventEmitter<void>;

  @Listen("exampleImageSelected")
  handleImageSelection() {
    this.imageSelected.emit();
  }

  @Listen("exampleImageError")
  handleImageSelectionError() {
    this.imageSelectedError.emit();
  }

  componentWillLoad() {
    slotChangeListener(this, this.el);
  }

  render() {
    return (
      <Host>
        <h3>Mit den Beispielbildern die Suche direkt ausprobieren</h3>
        <div class="images">
          <slot name="vviinn-example-images-1">
            <vviinn-example-image
              width={240}
              height={160}
              src="https://cdn.vviinn.com/0/fit/368/0/ce/0/Z3M6Ly9haWFhcy1pbWdwcm94eS9leGFtcGxlcy9pbWctaW5zcGlyYXRpb24tMDEtTC5qcGc="
            />
          </slot>
          <vviinn-example-image
            width={240}
            height={360}
            src="https://cdn.vviinn.com/0/fit/368/0/ce/0/Z3M6Ly9haWFhcy1pbWdwcm94eS9leGFtcGxlcy9pbWctaW5zcGlyYXRpb24tMDItTS5qcGc="
          />
          <vviinn-example-image
            width={240}
            height={149}
            src="https://cdn.vviinn.com/0/fit/368/0/ce/0/Z3M6Ly9haWFhcy1pbWdwcm94eS9leGFtcGxlcy9pbWctaW5zcGlyYXRpb24tMDMtTS5qcGc="
          />
          <vviinn-example-image
            width={240}
            height={161}
            src="https://cdn.vviinn.com/0/fit/368/0/ce/0/Z3M6Ly9haWFhcy1pbWdwcm94eS9leGFtcGxlcy9pbWctaW5zcGlyYXRpb24tMDQtTC5qcGc="
          />
        </div>
      </Host>
    );
  }
}
