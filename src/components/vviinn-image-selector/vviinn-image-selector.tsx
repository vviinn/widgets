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
  /** Accept image files dropped from the OS onto the selector */
  @Prop() useDragAndDrop: boolean = false;

  private fileInput: HTMLInputElement;

  @State() isDragOver: boolean = false;

  // dragleave fires when the pointer moves over inner elements; debounce it so
  // the drag-over state doesn't flicker (dragover keeps cancelling the timer).
  private dragLeaveTimer: ReturnType<typeof setTimeout>;

  // Guards against a second drop / file-input change starting a concurrent
  // upload while the first request is still in flight (racing two searches).
  private isProcessing = false;

  private async processFile(file: File) {
    if (this.isProcessing) return;

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

    this.isProcessing = true;
    try {
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
    } finally {
      this.isProcessing = false;
    }
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
    if (event.dataTransfer) event.dataTransfer.dropEffect = "copy";
    clearTimeout(this.dragLeaveTimer);
    this.isDragOver = true;
  }

  @Listen("dragleave")
  onDragLeave() {
    if (!this.useDragAndDrop) return;
    clearTimeout(this.dragLeaveTimer);
    this.dragLeaveTimer = setTimeout(() => (this.isDragOver = false), 50);
  }

  @Listen("drop", { passive: false })
  async onDrop(event: DragEvent) {
    if (!this.useDragAndDrop) return;
    event.preventDefault();
    clearTimeout(this.dragLeaveTimer);
    this.isDragOver = false;

    const file = parseDroppedFile(event.dataTransfer);
    if (file) await this.processFile(file);
  }

  // Safety net for a drag that ends without a dragleave reaching this host
  // (dropped outside the element, or cancelled): clears a stuck highlight.
  @Listen("drop", { target: "document" })
  @Listen("dragend", { target: "document" })
  onGlobalDragEnd() {
    if (!this.useDragAndDrop || !this.isDragOver) return;
    clearTimeout(this.dragLeaveTimer);
    this.isDragOver = false;
  }

  disconnectedCallback() {
    clearTimeout(this.dragLeaveTimer);
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
      <Host
        exportparts={
          this.useDragAndDrop ? "button:upload-photo_button" : "button"
        }
        class={{ "drag-over": this.isDragOver }}
      >
        {this.useDragAndDrop && (
          <div class="drop-zone__hint" aria-hidden="true">
            <span class="drop-zone__icon">
              <slot name="drop-zone-icon" />
            </span>
            <span class="drop-zone__text">
              <slot name="drop-zone-text" />
            </span>
          </div>
        )}
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
          {this.loading ? (
            <vviinn-preloader />
          ) : (
            <slot name="upload-button-text">Upload image</slot>
          )}
        </label>
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
