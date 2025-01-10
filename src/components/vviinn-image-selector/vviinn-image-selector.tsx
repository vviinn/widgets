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
import {
  BasicEventData,
  ImageUploadEventData,
  NoResultEventData,
  SearchIdEventData,
} from "../../recommendation/events";

/**
 * @part button -  button look and feel
 */
@Component({
  tag: "vviinn-image-selector",
  styleUrl: "vviinn-image-selector.css",
  shadow: true,
})
export class VviinnImageSelector {
  @Event() vviinnImageUpload: EventEmitter<ImageUploadEventData>;
  /** Wrong image format, that isn’t .jpg, .jpeg, png */
  @Event() vviinnNoResult: EventEmitter<NoResultEventData>;

  /** @internal */
  @Event() vviinnImageUploadFinished: EventEmitter<SearchIdEventData>;

  @Prop() basicEventData: BasicEventData;
  @Prop() startUpload: boolean;
  @Prop() loading: boolean = false;
  @Prop() accept: "image" | "application-octet-stream" = "image";
  @Prop() resetVpsButton: () => void;
  @Prop() token?: string;
  @Prop() apiPath?: string;
  @Prop() showInWidget?: boolean;
  @Prop() uploadStartedHandler?: () => void;

  private fileInput: HTMLInputElement;

  private async handleInputChange(event: Event) {
    this.vviinnImageUpload.emit({
      ...this.basicEventData,
      isTriggeredByVpsWidget: !!this.showInWidget,
    });
    const input = event.target as HTMLInputElement;

    this.uploadStartedHandler && this.uploadStartedHandler();

    const processingResult = await processSelectedFile(
      this.showInWidget ? "widget" : "components"
    )(input.files[0]);

    pipe(
      processingResult,
      E.match(
        ({ kind }) => {
          this.vviinnNoResult.emit({
            ...this.basicEventData,
            reason: kind,
          });
        },
        ({ links }) => {
          this.vviinnImageUploadFinished.emit({ searchId: links.self.href });
        }
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
