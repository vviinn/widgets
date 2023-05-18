import { Component, Host, h, Event, EventEmitter } from "@stencil/core";
import * as E from "fp-ts/Either";
import { pipe } from "fp-ts/lib/function";
import {
  imageSearchState,
  processSelectedFile,
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
  @Event() vviinnImageUpload: EventEmitter<void>;
  /** Event fires when user select file that no .jpg, .jpeg or png */
  @Event() vviinnNoResult: EventEmitter<void>;

  private async handleInputChange(event: Event) {
    const input = event.target as HTMLInputElement;
    const processingResult = await processSelectedFile(input.files[0]);

    pipe(
      processingResult,
      E.match(
        () => this.vviinnNoResult.emit(),
        () => this.vviinnImageUpload.emit()
      )
    );

    input.value = null;
  }

  private isLoading(): boolean {
    return imageSearchState.loading;
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
