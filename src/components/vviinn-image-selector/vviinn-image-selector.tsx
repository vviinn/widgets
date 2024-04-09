import {
  Component,
  Host,
  h,
  Event,
  EventEmitter,
  Prop,
  Watch,
} from "@stencil/core";
import * as E from "fp-ts/Either";
import { pipe } from "fp-ts/lib/function";
import { processSelectedFile } from "../../store/search.store";
import { BasicEventData, NoResultEventData } from "../../recommendation/events";

/**
 * @part button -  button look and feel
 */
@Component({
  tag: "vviinn-image-selector",
  styleUrl: "vviinn-image-selector.css",
  shadow: true,
})
export class VviinnImageSelector {
  @Event() vviinnImageUpload: EventEmitter<BasicEventData>;
  /** Wrong image format, that isn’t .jpg, .jpeg, png */
  @Event() vviinnNoResult: EventEmitter<NoResultEventData>;

  /** @internal */
  @Event() vviinnImageUploadFinished: EventEmitter;

  @Prop() basicEventData: BasicEventData;
  @Prop() startUpload: boolean;
  @Prop() loading: boolean = false;
  @Prop() accept: "image" | "application-octet-stream" = "image";
  @Prop() resetVpsButton: () => void;
  @Prop() capture?: "environment" | "user";

  private fileInput: HTMLInputElement;

  private async handleInputChange(event: Event) {
    this.vviinnImageUpload.emit(this.basicEventData);
    const input = event.target as HTMLInputElement;
    const processingResult = await processSelectedFile(input.files[0]);

    pipe(
      processingResult,
      E.match(
        ({ kind }) =>
          this.vviinnNoResult.emit({
            ...this.basicEventData,
            reason: kind,
          }),
        () => this.vviinnImageUploadFinished.emit()
      )
    );

    input.value = null;
  }

  @Watch("startUpload")
  startUploadWatcher(upload: boolean) {
    if (upload) {
      this.fileInput.click();
      this.resetVpsButton();
    }
  }

  render() {
    return (
      <Host exportparts="button">
        {this.loading ? (
          <vviinn-preloader />
        ) : (
          <label htmlFor="fileInput" part="button">
            <slot name="upload-button-text">Upload image</slot>
          </label>
        )}
        <input
          id="fileInput"
          class="visually-hidden"
          type="file"
          capture={this.capture}
          accept={
            this.accept === "image" ? "image/*" : "application/octet-stream"
          }
          onChange={(event: Event) => this.handleInputChange(event)}
          ref={(el) => (this.fileInput = el as HTMLInputElement)}
        />
      </Host>
    );
  }
}
