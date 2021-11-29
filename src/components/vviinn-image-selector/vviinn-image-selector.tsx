import { Component, Host, h, Event, EventEmitter } from "@stencil/core";
import * as O from "fp-ts/lib/Option";
import * as E from "fp-ts/Either";
import * as TE from "fp-ts/TaskEither";
import { pipe } from "fp-ts/lib/function";
import { resizeImage } from "../../Image/resizeImage";
import { imageSearchState } from "../../store/imageSearch.store";

import { uploadFile } from "../../store/imageSearch.store";
import { checkImageType, fileDoesntExist } from "../../Image/error";
import { imageFromFileTask } from "../../Image/fromFile";
import { convertB64toFileTask } from "../../Image/toFile";

/**
 * @part button -  button look and feel
 */
@Component({
  tag: "vviinn-image-selector",
  styleUrl: "vviinn-image-selector.css",
  shadow: true,
})
export class VviinnImageSelector {
  /** Event fires when user select file */
  @Event() imageSelected: EventEmitter<void>;
  /** Event fires when user select file that no .jpg, .jpeg or png */
  @Event() imageSelectedError: EventEmitter<void>;

  private handleInputChange(event: Event) {
    const input = event.target as HTMLInputElement;
    this.handleFileSelection(O.fromNullable(input.files[0]));
    input.value = null;
  }

  private async handleFileSelection(file: O.Option<File>) {
    const convertImageTaskEither = pipe(
      file,
      E.fromOption(() => fileDoesntExist),
      E.chain(checkImageType),
      TE.fromEither,
      TE.chainTaskK(imageFromFileTask),
      TE.mapLeft((error) => {
        this.imageSelectedError.emit();
        return error;
      })
    );

    const sendImageToStoreTaskEither = pipe(
      convertImageTaskEither,
      TE.map((image) => {
        imageSearchState.image = O.some(image);
        imageSearchState.imageUrl = O.some(image.src);
      })
    );

    const checkImageAndStartSessionTask = pipe(
      convertImageTaskEither,
      TE.map((image) => resizeImage(imageSearchState.imageWidth, image)),
      TE.chainTaskK(convertB64toFileTask),
      TE.chain(uploadFile),
      TE.map(() => this.imageSelected.emit())
    );

    await checkImageAndStartSessionTask();
    await sendImageToStoreTaskEither();
  }

  private isLoading(): boolean {
    return imageSearchState.loading || imageSearchState.objectDetectionInProgress;
  }

  render() {
    return (
      <Host exportparts="button">
        <vviinn-preloader />
        {this.isLoading() ? null : (
          <label htmlFor="fileInput" part="button">
            <slot name="upload-button-text">Upload image</slot>
          </label>
        )}
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
