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
import {
  makeUploadFileRequest,
  SearchStore,
  SearchStoreName,
} from "../../store/search.store";
import {
  BasicEventData,
  ImageUploadEventData,
  NoResultEventData,
  SearchIdEventData,
} from "../../recommendation/events";
import { BasicError } from "../../error";
import { VisualSearchResponse } from "../../interfaces";
import { setLocalStorageItems } from "../../localStorage";

/**
 * @part button -  button look and feel
 */
@Component({
  tag: "vviinn-image-selector",
  styleUrl: "vviinn-image-selector.css",
  shadow: true,
})
export class VviinnImageSelector {
  @Event() vviinnImageUploadStarted: EventEmitter<ImageUploadEventData>;
  /** Wrong image format, that isn't .jpg, .jpeg, png */
  @Event() vviinnNoResult: EventEmitter<NoResultEventData>;
  @Event() vviinnImageUploadFinished: EventEmitter<SearchIdEventData>;

  @Prop() basicEventData: BasicEventData;
  @Prop() startUpload: boolean;
  @Prop() loading: boolean = false;
  @Prop() accept: "image" | "application-octet-stream" = "image";
  @Prop() resetVpsButton: () => void;
  @Prop() token?: string;
  @Prop() apiPath?: string;
  @Prop() showInWidget: boolean;
  @Prop() storeName: SearchStoreName;
  @Prop() state: SearchStore;

  private fileInput: HTMLInputElement;

  private async handleInputChange(event: Event) {
    this.vviinnImageUploadStarted.emit({
      ...this.basicEventData,
      isTriggeredByVpsWidget: this.storeName === "widget",
    });
    const input = event.target as HTMLInputElement;

    const processingResult: E.Either<
      BasicError<string | Response>,
      VisualSearchResponse
    > = await makeUploadFileRequest(this.storeName)(input.files[0]);

    pipe(
      processingResult,
      E.match(
        ({ kind }) => {
          this.vviinnNoResult.emit({
            ...this.basicEventData,
            reason: kind,
          });
        },
        (response) => {
          if (!this.showInWidget)
            setLocalStorageItems(
              this.state.image?.src,
              this.state.detectedObjects,
            );

          this.vviinnImageUploadFinished.emit({
            searchId: response.requestId,
            isTriggeredByVpsWidget: this.storeName === "widget",
          });
        },
      ),
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
          <label
            htmlFor="fileInput"
            part="button"
            tabindex="0"
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                this.fileInput?.click();
              }
            }}
          >
            <slot name="upload-button-text">Upload image</slot>
          </label>
        )}
        <input
          id="fileInput"
          class="visually-hidden"
          type="file"
          tabindex="-1"
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
