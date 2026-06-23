import {
  Component,
  Host,
  h,
  Event,
  EventEmitter,
  Prop,
  Watch,
  State,
  Listen,
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
import { setLocalStorageItems } from "../../localStorage";
import { getAcceptableFileFormats, checkImageType } from "../../Image/error";
import { parseDroppedFile } from "../../helpers/dragAndDrop/parseDroppedFile";

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
  /** Wrong image format (supported formats depend on the browser) */
  @Event() vviinnNoResult: EventEmitter<NoResultEventData>;
  @Event() vviinnImageUploadFinished: EventEmitter<SearchIdEventData>;

  @Prop() basicEventData: BasicEventData;
  @Prop() startUpload: boolean;
  @Prop() loading: boolean = false;
  @Prop() accept: string;
  @Prop() resetVpsButton: () => void;
  @Prop() token: string;
  @Prop() apiPath?: string;
  @Prop() showInWidget: boolean;
  @Prop() storeName: SearchStoreName;
  @Prop() state: SearchStore;
  /** Accept images dropped onto the selector (file from OS or image URL from a page) */
  @Prop() useDragAndDrop: boolean = false;

  private fileInput: HTMLInputElement;

  @State() isDragOver: boolean = false;

  private async processFile(file: File) {
    const validationResult = checkImageType(file);

    if (E.isLeft(validationResult)) {
      this.vviinnNoResult.emit({
        ...this.basicEventData,
        reason: validationResult.left.kind,
        errorMessage: validationResult.left.inner,
        errorCode: validationResult.left.code,
      });
      return;
    }

    this.vviinnImageUploadStarted.emit({
      ...this.basicEventData,
      isTriggeredByVpsWidget: this.storeName === "widget",
    });

    const processingResult = await makeUploadFileRequest(
      this.storeName,
      this.token,
      this.apiPath,
    )(file);

    pipe(
      processingResult,
      E.match(
        ({ kind, code }) => {
          this.vviinnNoResult.emit({
            ...this.basicEventData,
            reason: kind,
            errorCode: code,
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
  }

  private async handleInputChange(event: Event) {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];
    if (!file) return;

    await this.processFile(file);

    input.value = "";
  }

  @Listen("dragover", { passive: false })
  onDragOver(event: DragEvent) {
    if (!this.useDragAndDrop) return;
    event.preventDefault();
    event.dataTransfer.dropEffect = "copy";
    if (!this.isDragOver) this.isDragOver = true;
  }

  @Listen("dragleave")
  onDragLeave() {
    if (!this.useDragAndDrop) return;
    this.isDragOver = false;
  }

  @Listen("drop", { passive: false })
  async onDrop(event: DragEvent) {
    if (!this.useDragAndDrop) return;
    event.preventDefault();
    this.isDragOver = false;

    const file = parseDroppedFile(event.dataTransfer);
    if (file) await this.processFile(file);
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
      <Host exportparts="button" class={{ "drag-over": this.isDragOver }}>
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
            {this.isDragOver ? (
              <span class="drop-hint">Drop image here</span>
            ) : (
              <slot name="upload-button-text">Upload image</slot>
            )}
          </label>
        )}
        <input
          id="fileInput"
          class="visually-hidden"
          type="file"
          tabindex="-1"
          accept={getAcceptableFileFormats()}
          onChange={(event: Event) => this.handleInputChange(event)}
          ref={(el) => (this.fileInput = el as HTMLInputElement)}
        />
      </Host>
    );
  }
}
