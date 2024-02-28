import {
  Component,
  Host,
  h,
  Prop,
  Event,
  EventEmitter,
  State,
  Watch,
  Element,
} from "@stencil/core";
import { pipe } from "fp-ts/lib/function";
import { toFile } from "../../Image/toFile";
import { processSelectedFile } from "../../store/imageSearch.store";
import * as E from "fp-ts/lib/Either";
import { BasicEventData } from "../../recommendation/events";
import { RoundCameraIcon } from "../vviinn-icons";

@Component({
  tag: "vviinn-example-image",
  styleUrl: "vviinn-example-image.css",
  shadow: true,
})
export class VviinnExampleImage {
  @Element() el: HTMLElement;
  @Prop() exampleImageSource: string;
  @Prop() width: number = 0;
  @Prop() height: number = 0;
  @Prop() basicEventData: BasicEventData;
  @Prop() srcObject: MediaStream;
  @Prop() cameraButtonClicked: boolean = false;

  @State() selected: boolean = false;
  @State() videoInitialized: boolean = false;

  @Event() vviinnImageUpload: EventEmitter<BasicEventData>;
  @Event() vviinnNoResult: EventEmitter<BasicEventData>;
  /** @internal */
  @Event() vviinnImageUploadFinished: EventEmitter;
  /** @internal */
  @Event() vviinnCameraEnabled: EventEmitter;

  private videoElement: HTMLVideoElement | null;

  componentDidLoad() {
    this.videoElement = this.el.shadowRoot.getElementById(
      "camera-preview"
    ) as HTMLVideoElement;
  }

  private createPlaceholderImageCanvas() {
    const imgPlaceholder = this.el.shadowRoot.getElementById(
      "captured-image-placeholder"
    ) as HTMLImageElement;

    const video = this.videoElement;
    const { videoWidth, videoHeight } = video;
    const canvas = document.createElement("canvas");

    canvas.width = videoWidth;
    canvas.height = videoHeight;

    const ctx = canvas.getContext("2d");
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

    const dataURI = canvas.toDataURL("image/jpeg");
    imgPlaceholder.src = dataURI;
    imgPlaceholder.classList.remove("hidden");
  }

  private async selectImage() {
    if (!this.srcObject) return;
    this.selected = true;
    this.vviinnImageUpload.emit(this.basicEventData);
    let file: File;

    const photoFrame = this.el.shadowRoot.getElementById("photo-frame");
    const photoFrameRect = photoFrame.getBoundingClientRect();
    const cropSize = Math.min(photoFrameRect.width, photoFrameRect.height);

    const video = this.videoElement;
    const { videoWidth, videoHeight } = video;

    const canvas = document.createElement("canvas");
    this.videoElement.pause();
    this.createPlaceholderImageCanvas();

    canvas.width = cropSize;
    canvas.height = cropSize;
    const dx = (videoWidth - cropSize) / 2;
    const dy = (videoHeight - cropSize) / 3;

    const ctx = canvas.getContext("2d");
    ctx.drawImage(video, dx, dy, cropSize, cropSize, 0, 0, cropSize, cropSize);
    const dataURI = canvas.toDataURL("image/jpeg");
    file = await toFile(dataURI);

    pipe(
      await processSelectedFile(file),
      E.match(
        () => this.vviinnNoResult.emit(this.basicEventData),
        () => this.vviinnImageUploadFinished.emit()
      )
    );

    this.selected = false;
    this.videoInitialized = false;
    this.vviinnCameraEnabled.emit(false);
  }

  private handleKeyPress({ key }: KeyboardEvent) {
    if (key !== "Enter" && key !== " ") return;
    this.selectImage();
  }

  @Watch("srcObject")
  handleSrcObjectChange() {
    if (!this.srcObject) {
      this.videoInitialized = false;
      return;
    }
    this.videoElement.srcObject = this.srcObject;

    this.videoElement.onloadedmetadata = () => {
      this.vviinnCameraEnabled.emit(true);
      this.videoInitialized = true;
    };
  }

  render() {
    return (
      <Host
        onKeyUp={(ev: KeyboardEvent) => this.handleKeyPress(ev)}
        class={{ "video-expanded": this.cameraButtonClicked }}
      >
        <video
          id="camera-preview"
          class={{
            hidden: !this.videoInitialized || this.selected,
          }}
          autoplay
          playsinline
          muted
        ></video>
        <img
          src={this.exampleImageSource}
          width={this.width}
          height={this.height}
          tabindex={1}
          class={{ hidden: this.videoInitialized || this.selected }}
        />

        <img id="captured-image-placeholder" class="hidden" />

        <div class="container">
          <div
            class={{
              hidden: !this.videoInitialized,
            }}
            id="photo-frame"
          ></div>

          <div class="buttons-group">
            <button
              class={{ "photo-button": true, visible: this.videoInitialized }}
              onClick={() => this.selectImage()}
            >
              <RoundCameraIcon />
            </button>
          </div>
        </div>
      </Host>
    );
  }
}
