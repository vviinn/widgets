import { Component, Host, h, Event, EventEmitter } from "@stencil/core";
import * as O from "fp-ts/lib/Option";
import * as TE from "fp-ts/TaskEither";
import * as TO from "fp-ts/lib/TaskOption";
//import * as T from "fp-ts/lib/Task";
import { pipe } from "fp-ts/lib/function";
import { findFirstMap } from "fp-ts/Array";
import { imageResizeTask } from "../../Image/resizeImage";
import { imageSearchState } from "../../store/imageSearch.store";

import { uploadFile2 } from "../../store/imageSearch.store";

const SUPPORTED_FILE_TYPES = ["jpg", "jpeg", "png"];

const checkImageType = (f: File): O.Option<File> => {
  const fileType = f.type.split("/")[1];
  return findFirstMap((supportedType: string) =>
    supportedType === fileType ? O.some(f) : O.none
  )(SUPPORTED_FILE_TYPES);
};
//f.type.split("/")[0] === "image" ? O.some(f) : O.none;

@Component({
  tag: "vviinn-image-selector",
  styleUrl: "vviinn-image-selector.css",
  shadow: true,
})
export class VviinnImageSelector {
  @Event() imageSelected: EventEmitter<void>;

  private handleInputChange(event: Event) {
    const input = event.target as HTMLInputElement;
    this.handleFileSelection(O.fromNullable(input.files[0]));
  }

  private async handleFileSelection(file: O.Option<File>) {
    const resizeTask = imageResizeTask(imageSearchState.imageWidth);
    let kek = pipe(
      file,
      O.chain(checkImageType),
      TO.fromOption,
      TO.chainTaskK(resizeTask),
      TE.fromTaskOption(() => "File format not supported")
      //TE.chain(uploadFile2)
    );

    console.log(await kek());

    //this.imageSelected.emit();
  }

  render() {
    return (
      <Host exportparts="button">
        <label htmlFor="fileInput" part="button">
          <slot name="upload-button-text">Upload image</slot>
        </label>
        <input
          id="fileInput"
          class="visually-hidden"
          type="file"
          accept="image/*"
          onChange={(event: Event) => this.handleInputChange(event)}
        />
      </Host>
    );
  }
}
