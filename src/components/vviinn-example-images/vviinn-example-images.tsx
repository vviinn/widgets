import { Component, Host, h, Event, EventEmitter, Listen } from "@stencil/core";

@Component({
  tag: "vviinn-example-images",
  styleUrl: "vviinn-example-images.css",
  shadow: true,
})
export class VviinnExampleImages {
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

  render() {
    return (
      <Host>
        <h3>Mit den Beispielbildern die Suche direkt ausprobieren</h3>
        <div class="images">
          <vviinn-example-image
            width={240}
            height={160}
            src="https://cdn.vviinn.com/0/fit/368/0/ce/0/Z3M6Ly9haWFhcy1pbWdwcm94eS9leGFtcGxlcy9pbWctaW5zcGlyYXRpb24tMDEtTC5qcGc="
          />
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
