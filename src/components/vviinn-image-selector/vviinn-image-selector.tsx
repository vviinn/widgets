import { Component, Host, h, Event, EventEmitter } from "@stencil/core";
import * as O from "fp-ts/lib/Option";
import { pipe } from "fp-ts/lib/function";
import { imageSearchState } from "../../store/imageSearch.store";

const checkImageType = (f: File): O.Option<File> =>
  f.type.split("/")[0] === "image" ? O.some(f) : O.none;

@Component({
  tag: "vviinn-image-selector",
  styleUrl: "vviinn-image-selector.css",
  shadow: true,
})
export class VviinnImageSelector {
  @Event() imageSelected: EventEmitter<void>;
  @Event() imageResized: EventEmitter<File>;

  private input: HTMLInputElement | undefined;

  private handleInputChange() {
    this.handleFileSelection(O.fromNullable(this.input.files[0]));
  }

  private handleFileSelection(file: O.Option<File>) {
    pipe(
      file,
      O.chain(checkImageType),
      O.map((file) => this.fileSelectionSuccess(file))
    );
  }

  private async fileSelectionSuccess(f: File) {
    imageSearchState.image = f;
    this.imageSelected.emit();
  }

  render() {
    return (
      <Host exportparts="image-upload-button">
        <label htmlFor="fileInput" part="image-upload-button">
          <slot>upload file</slot>
        </label>
        <input
          ref={(el) => (this.input = el)}
          id="fileInput"
          class="visually-hidden"
          type="file"
          accept="image/*"
          capture="enviroment"
          onChange={() => this.handleInputChange()}
        />
      </Host>
    );
  }
}
