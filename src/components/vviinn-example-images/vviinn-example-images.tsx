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
        <slot name="vviinn-example-images-title">
          <h3>Mit den Beispielbildern die Suche direkt ausprobieren</h3>
        </slot>
        <div class="images">
          <slot name="vviinn-example-images-1">
            <vviinn-example-image
              width={240}
              height={320}
              src="https://cdn.vviinn.com/0/fit/240/0/ce/0/Z3M6Ly9haWFhcy1pbWdwcm94eS9leGFtcGxlcy9pbWctaW5zcGlyYXRpb24tMDEtTC5qcGc="
            />
          </slot>
          <slot name="vviinn-example-images-2">
            <vviinn-example-image
              width={240}
              height={240}
              src="https://cdn.vviinn.com/0/fit/240/0/ce/0/Z3M6Ly9haWFhcy1pbWdwcm94eS9leGFtcGxlcy9pbWctaW5zcGlyYXRpb24tMDItTS5qcGc="
            />
          </slot>
          <slot name="vviinn-example-images-3">
            <vviinn-example-image
              width={240}
              height={240}
              src="https://cdn.vviinn.com/0/fit/240/0/ce/0/Z3M6Ly9haWFhcy1pbWdwcm94eS9leGFtcGxlcy9pbWctaW5zcGlyYXRpb24tMDMtTS5qcGc="
            />
          </slot>
          <slot name="vviinn-example-images-4">
            <vviinn-example-image
              width={240}
              height={320}
              src="https://cdn.vviinn.com/0/fit/240/0/ce/0/Z3M6Ly9haWFhcy1pbWdwcm94eS9leGFtcGxlcy9pbWctaW5zcGlyYXRpb24tMDQtTC5qcGc="
            />
          </slot>
        </div>
      </Host>
    );
  }
}
