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
import { processSelectedFile } from "../../store/search.store";
import * as E from "fp-ts/lib/Either";
import { BasicEventData } from "../../recommendation/events";
import {
  MinusIcon,
  PhotoFrameCorner,
  PlusIcon,
  RoundCameraIcon,
} from "../vviinn-icons";

type ZoomCapabilities = {
  min: number;
  max: number;
};

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
  @State() zoomCapabilities: ZoomCapabilities | null = null;

  @Event() vviinnImageUpload: EventEmitter<BasicEventData>;
  @Event() vviinnNoResult: EventEmitter<BasicEventData>;
  /** @internal */
  @Event() vviinnImageUploadFinished: EventEmitter;
  /** @internal */
  @Event() vviinnCameraEnabled: EventEmitter;

  private videoElement: HTMLVideoElement | null;
  private videoTrack: MediaStreamTrack | null = null;

  componentDidLoad() {
    this.videoElement = this.el.shadowRoot.getElementById(
      "camera-preview"
    ) as HTMLVideoElement;
  }

  private initializeZoom = async () => {
    if (!this.videoTrack) return;
    const capabilities = this.videoTrack.getCapabilities() as any;
    if ("zoom" in capabilities) {
      this.zoomCapabilities = capabilities.zoom;

      await this.videoTrack.applyConstraints({
        advanced: [{ zoom: this.zoomCapabilities.min }] as any,
      });
    }
  };

  private onZoom = async (action: "in" | "out") => {
    if (!this.videoTrack || !this.zoomCapabilities) return;
    const { max, min } = this.zoomCapabilities;
    const currentSettings = this.videoTrack.getSettings() as any;
    const currentZoom = currentSettings.zoom ?? min;

    const step = (max - min) / 3;
    const roundedStep = Math.round(step * 10) / 10;

    let newZoom: number;
    newZoom =
      action === "in" ? currentZoom + roundedStep : currentZoom - roundedStep;

    if (newZoom < min) newZoom = min;
    if (newZoom > max) newZoom = max;

    await this.videoTrack.applyConstraints({
      advanced: [{ zoom: newZoom }] as any,
    });
  };

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
  }

  private async selectImage() {
    if (!this.srcObject) return;
    this.vviinnImageUpload.emit(this.basicEventData);
    let file: File;

    const photoFrame = this.el.shadowRoot.getElementById("photo-frame");
    const video = this.videoElement;
    const photoFrameRect = photoFrame.getBoundingClientRect();
    const videoRect = video.getBoundingClientRect();

    const { videoWidth, videoHeight } = video;

    const canvas = document.createElement("canvas");
    this.selected = true;
    this.videoElement.pause();
    this.createPlaceholderImageCanvas();

    const videoCoefficientWidth = videoWidth / videoRect.width;
    const videoCoefficientHeight = videoHeight / videoRect.height;

    const cropDimension = Math.min(
      photoFrameRect.width * videoCoefficientWidth,
      photoFrameRect.height * videoCoefficientHeight
    );

    canvas.width = cropDimension;
    canvas.height = cropDimension;

    const dxFrame =
      photoFrameRect.left -
      videoRect.left +
      (photoFrameRect.width - cropDimension / videoCoefficientWidth) / 2;
    const dyFrame =
      photoFrameRect.top -
      videoRect.top +
      (photoFrameRect.height - cropDimension / videoCoefficientHeight) / 2;

    const dx = dxFrame * videoCoefficientWidth;
    const dy = dyFrame * videoCoefficientHeight;

    const ctx = canvas.getContext("2d");
    ctx.drawImage(
      video,
      dx,
      dy,
      cropDimension,
      cropDimension,
      0,
      0,
      canvas.width,
      canvas.height
    );

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
    this.videoTrack = this.srcObject.getVideoTracks()[0];
    this.initializeZoom();

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

        <img
          id="captured-image-placeholder"
          class={{ hidden: !this.selected }}
        />

        <div class={{ container: true, hidden: !this.videoInitialized }}>
          <div class="photo-frame-container">
            <div id="photo-frame">
              <PhotoFrameCorner className="photo-frame-corner top-left" />
              <PhotoFrameCorner className="photo-frame-corner top-right" />
              <PhotoFrameCorner className="photo-frame-corner bottom-left" />
              <PhotoFrameCorner className="photo-frame-corner bottom-right" />
            </div>

            <div
              class={{ "zoom-buttons": true, hidden: !this.zoomCapabilities }}
            >
              <button onClick={() => this.onZoom("out")}>
                <MinusIcon />
              </button>
              <button onClick={() => this.onZoom("in")}>
                <PlusIcon />
              </button>
            </div>
          </div>

          <div class="buttons-group">
            <div class="buttons-group-info">
              Put object into the square area
            </div>

            <button class="photo-button" onClick={() => this.selectImage()}>
              <RoundCameraIcon />
            </button>
          </div>
        </div>
      </Host>
    );
  }
}
