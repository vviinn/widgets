import { Component, Host, h, Event, EventEmitter } from "@stencil/core";
import * as O from "fp-ts/lib/Option";
import * as E from "fp-ts/Either";
import * as TE from "fp-ts/TaskEither";
import { pipe } from "fp-ts/lib/function";
import { imageResizeTask } from "../../Image/resizeImage";
import { imageSearchState } from "../../store/imageSearch.store";

import { uploadFile } from "../../store/imageSearch.store";
import { checkImageType, fileDoesntExist } from "../../Image/error";

@Component({
  tag: "vviinn-image-selector",
  styleUrl: "vviinn-image-selector.css",
  shadow: true,
})
export class VviinnImageSelector {
  @Event() imageSelected: EventEmitter<void>;
  @Event() imageSelectedError: EventEmitter<void>;

  private handleInputChange(event: Event) {
    const input = event.target as HTMLInputElement;
    this.handleFileSelection(O.fromNullable(input.files[0]));
  }

  private async handleFileSelection(file: O.Option<File>) {
    const resizeTask = imageResizeTask(imageSearchState.imageWidth);
    const checkImageAndStartSessionTask = pipe(
      file,
      E.fromOption(() => fileDoesntExist),
      E.chain(checkImageType),
      TE.fromEither,
      TE.chainTaskK(resizeTask),
      TE.mapLeft((error) => {
        this.imageSelectedError.emit();
        return error;
      }),
      TE.chain(uploadFile)
    );

    await checkImageAndStartSessionTask();
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
