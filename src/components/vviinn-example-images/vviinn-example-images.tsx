import {
  Component,
  Host,
  h,
  Event,
  EventEmitter,
  Listen,
  Element,
} from "@stencil/core";
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

  private imagesBlock!: HTMLDivElement;

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

  private delegateFocus() {
    const firstSlot = this.imagesBlock.childNodes[0];
    const firstExampleImage = firstSlot.childNodes[0];

    (firstExampleImage as HTMLElement).focus();
  }

  render() {
    return (
      <Host onFocus={() => this.delegateFocus()}>
        <slot name="vviinn-example-images-title">
          <h3>Mit den Beispielbildern die Suche direkt ausprobieren</h3>
        </slot>
        <div
          class="images"
          ref={(el) => (this.imagesBlock = el as HTMLDivElement)}
        >
          <slot name="vviinn-example-images-1">
            <vviinn-example-image
              width={480}
              height={640}
              src="https://cdn.vviinn.com/0/fit/480/0/ce/0/Z3M6Ly9haWFhcy1pbWdwcm94eS9leGFtcGxlcy9pbWctaW5zcGlyYXRpb24tMDEtTC5qcGc="
              tabIndex={0}
            />
          </slot>
          <slot name="vviinn-example-images-2">
            <vviinn-example-image
              width={280}
              height={480}
              src="https://cdn.vviinn.com/0/fit/480/0/ce/0/Z3M6Ly9haWFhcy1pbWdwcm94eS9leGFtcGxlcy9pbWctaW5zcGlyYXRpb24tMDItTS5qcGc="
              tabIndex={1}
            />
          </slot>
          <slot name="vviinn-example-images-3">
            <vviinn-example-image
              width={280}
              height={480}
              src="https://cdn.vviinn.com/0/fit/480/0/ce/0/Z3M6Ly9haWFhcy1pbWdwcm94eS9leGFtcGxlcy9pbWctaW5zcGlyYXRpb24tMDMtTS5qcGc="
              tabIndex={2}
            />
          </slot>
          <slot name="vviinn-example-images-4">
            <vviinn-example-image
              width={480}
              height={640}
              src="https://cdn.vviinn.com/0/fit/480/0/ce/0/Z3M6Ly9haWFhcy1pbWdwcm94eS9leGFtcGxlcy9pbWctaW5zcGlyYXRpb24tMDQtTC5qcGc="
              tabIndex={3}
            />
          </slot>
        </div>
      </Host>
    );
  }
}
