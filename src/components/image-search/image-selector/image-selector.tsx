import {
  Component,
  Host,
  h,
  State,
  Event,
  EventEmitter,
} from "@stencil/core";
import * as O from "fp-ts/lib/Option";
import { pipe } from "fp-ts/lib/function";
import { imageSearchState } from "../../../store/imageSearch.store";

const checkImageType = (f: File): O.Option<File> =>
  f.type.split("/")[0] === "image" ? O.some(f) : O.none;

@Component({
  tag: "image-selector",
  styleUrl: "image-selector.css",
  shadow: true,
})
export class ImageSelector {
  @State() error: boolean = false;

  @Event() imageSelected: EventEmitter<HTMLImageElement>;
  @Event() imageResized: EventEmitter<File>;

  private handleInputChange() {
    this.handleFileSelection(O.fromNullable(this.input.files[0]));
  }

  private handleFileSelection(file: O.Option<File>) {
    pipe(
      file,
      O.chain(checkImageType),
      O.fold(
        () => this.fileSelectionError(),
        (file) => this.fileSelectionSuccess(file)
      )
    );
  }

  private async fileSelectionSuccess(f: File) {
    imageSearchState.image = f;
    this.imageSelected.emit();
  }

  private fileSelectionError() {
    this.error = true;
  }

  render() {
    return (
      <Host exportparts="file-button">
        <label htmlFor="fileInput" part="button">
          <slot name="upload-button-text"></slot>
        </label>
        <input
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
