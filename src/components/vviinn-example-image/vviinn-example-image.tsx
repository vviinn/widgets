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

  private async selectImage() {
    this.selected = true;
    this.vviinnImageUpload.emit(this.basicEventData);
    let file: File;

    if (this.srcObject) {
      const video = this.videoElement;
      const canvas = document.createElement("canvas");
      this.videoElement.pause();
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      const ctx = canvas.getContext("2d");
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
      const dataURI = canvas.toDataURL("image/jpeg");
      file = await toFile(dataURI);
    } else {
      file = await toFile(this.exampleImageSource);
    }

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
            hidden: !this.videoInitialized,
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
          class={{ hidden: this.videoInitialized }}
        />

        <div class="buttons-group">
          <button
            class={{ "photo-button": true, visible: this.videoInitialized }}
            onClick={() => this.selectImage()}
          >
            <RoundCameraIcon />
          </button>
        </div>
      </Host>
    );
  }
}
