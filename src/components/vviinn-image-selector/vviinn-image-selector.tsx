import { Component, Host, h, Event, EventEmitter, State } from "@stencil/core";
import * as E from "fp-ts/Either";
import { pipe } from "fp-ts/lib/function";
import {
  imageSearchState,
  imageSearchStateListener,
  processSelectedFile,
} from "../../store/imageSearch.store";

const MAX_PRELOADER_TIME_MS = 5000;

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

  @State() preloaderTimeout: boolean = false;

  private timeoutId: number = undefined;

  connectedCallback() {
    imageSearchStateListener("loading", (isLoadingStarted) => {
      if (isLoadingStarted) {
        this.startPreloaderTimeout(MAX_PRELOADER_TIME_MS);
      } else {
        this.resetPreloaderTimeout();
      }
    });
  }

  private startPreloaderTimeout(ms: number) {
    this.timeoutId = window.setTimeout(() => {
      this.preloaderTimeout = true;
    }, ms);
  }

  private resetPreloaderTimeout() {
    window.clearTimeout(this.timeoutId);
    this.preloaderTimeout = false;
  }

  private async handleInputChange(event: Event) {
    const input = event.target as HTMLInputElement;
    const processingResult = await processSelectedFile(input.files[0]);

    pipe(
      processingResult,
      E.match(
        () => this.imageSelectedError.emit(),
        () => this.imageSelected.emit()
      )
    );

    input.value = null;
  }

  private isLoading(): boolean {
    return (
      imageSearchState.loading || imageSearchState.objectDetectionInProgress
    );
  }

  private showPreloader(): boolean {
    return !this.preloaderTimeout && this.isLoading();
  }

  render() {
    return (
      <Host exportparts="button">
        {this.showPreloader() ? <vviinn-preloader /> : null}
        {this.showPreloader() ? null : (
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
