import { Component, Host, h, State, Event, EventEmitter } from "@stencil/core";
import * as O from "fp-ts/lib/Option";
import { pipe } from "fp-ts/lib/function";
import { fromFile } from "../../../Image/fromFile";
import { toFile } from "../../../Image/toFile";
import { resizeImage } from "../../../Image/resizeImage";

const checkImageType = (f: File): O.Option<File> =>
  f.type.split("/")[0] === "image" ? O.some(f) : O.none;

@Component({
  tag: "image-selector",
  styleUrl: "image-selector.css",
  shadow: true,
})
export class ImageSelector {
  @State() dragover: boolean = false;
  @State() error: boolean = false;

  @Event() imageSelected: EventEmitter<File>;

  private input: HTMLInputElement | undefined;

  private handleDrop(ev: DragEvent) {
    ev.preventDefault();
    this.dragover = false;
    this.handleFileSelection(O.fromNullable(ev.dataTransfer.files[0]));
  }

  private handleDragOver(ev: DragEvent) {
    ev.preventDefault();
    this.error = false;
    this.dragover = true;
  }

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
    const r = await fromFile(f);

    r.onload = async () => {
      const t = resizeImage(300, r);
      const file = await toFile(t);
      this.imageSelected.emit(file);
    };
  }

  private fileSelectionError() {
    this.error = true;
  }

  render() {
    const fileMessage = this.error ? (
      <span class="error">use only image files!</span>
    ) : (
      <span>or drop files here</span>
    );

    return (
      <Host>
        <div
          class={{ dragover: this.dragover, error: this.error }}
          id="drop-zone"
          onDrop={(ev) => this.handleDrop(ev)}
          onDragOver={(ev) => this.handleDragOver(ev)}
        >
          <label htmlFor="fileInput">Click to select files</label>
          {fileMessage}
          <input
            ref={(el) => (this.input = el)}
            id="fileInput"
            class="visually-hidden"
            type="file"
            accept="image/*"
            capture="enviroment"
            onChange={() => this.handleInputChange()}
          />
        </div>
      </Host>
    );
  }
}
