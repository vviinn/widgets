import {
  Component,
  Host,
  h,
  Prop,
  State,
  Event,
  EventEmitter,
} from "@stencil/core";
import * as O from "fp-ts/lib/Option";
import { pipe } from "fp-ts/lib/function";
//import { fromFile } from "../../../Image/fromFile";
//import { toFile } from "../../../Image/toFile";
//import { resizeImage } from "../../../Image/resizeImage";
import { imageSearchState } from "../../../store/imageSearch.store";

const checkImageType = (f: File): O.Option<File> =>
  f.type.split("/")[0] === "image" ? O.some(f) : O.none;

@Component({
  tag: "image-selector",
  styleUrl: "image-selector.css",
  shadow: true,
})
export class ImageSelector {
  @Prop() useDrag: boolean = false;
  @State() dragover: boolean = false;
  @State() error: boolean = false;

  @Event() imageSelected: EventEmitter<HTMLImageElement>;
  @Event() imageResized: EventEmitter<File>;

  private input: HTMLInputElement | undefined;

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
    /* const image = await fromFile(f);

     * image.onload = async () => {
     *   const resized = resizeImage(300, image);
     *   const file = await toFile(resized);
     *   this.imageResized.emit(file);
     *   this.imageSelected.emit(image);

     *   imageSearchState.image = file;
     * }; */
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
