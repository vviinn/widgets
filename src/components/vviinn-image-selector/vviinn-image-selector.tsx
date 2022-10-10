import { Component, Host, h, Event, EventEmitter } from "@stencil/core";
import * as E from "fp-ts/Either";
import { pipe } from "fp-ts/lib/function";
import { checkFileWithExtention } from "../../store/file-processing";
import {
  imageSearchState,
  imageSearcStateListener,
} from "../../store/imageSearch.store";

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

  private async handleInputChange(event: Event) {
    const input = event.target as HTMLInputElement;

    pipe(
      checkFileWithExtention(input.files[0]),
      E.matchW(
        () => this.imageSelectedError.emit(),
        (file) => {
          imageSearchState.imageSelectedObserver.next(file);
        }
      )
    );

    input.value = null;
  }

  componentWillLoad() {
    imageSearcStateListener("status", (status) => {
      if (status !== "imageProcessed") return;
      this.imageSelected.emit();
    });
  }

  private isLoading(): boolean {
    return (
      imageSearchState.status === "imageSelected" ||
      imageSearchState.status === "pending" ||
      imageSearchState.objectDetectionInProgress
    );
  }

  render() {
    return (
      <Host exportparts="button">
        {this.isLoading() ? <vviinn-preloader /> : null}
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
