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

const exampleImageSourceFallback = "../../assets/vviinn_img_start-hero.jpg";

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

  @State() selected: boolean = false;

  @Event() vviinnImageUpload: EventEmitter<BasicEventData>;
  @Event() vviinnNoResult: EventEmitter<BasicEventData>;
  /** @internal */
  @Event() vviinnImageUploadFinished: EventEmitter;

  private videoElement: HTMLVideoElement | null;

  componentDidLoad() {
    this.videoElement = this.el.shadowRoot.getElementById(
      "camera-preview"
    ) as HTMLVideoElement;
  }

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
      file = await toFile(
        this.exampleImageSource ?? exampleImageSourceFallback
      );
    }

    pipe(
      await processSelectedFile(file),
      E.match(
        () => this.vviinnNoResult.emit(this.basicEventData),
        () => this.vviinnImageUploadFinished.emit()
      )
    );

    this.selected = false;
  }

  private handleKeyPress({ key }: KeyboardEvent) {
    if (key !== "Enter" && key !== " ") return;
    this.selectImage();
  }

  @Watch("srcObject")
  handleSrcObjectChange() {
    if (!this.srcObject) return;
    this.videoElement.srcObject = this.srcObject;
  }

  render() {
    return (
      <Host onKeyUp={(ev: KeyboardEvent) => this.handleKeyPress(ev)}>
        <video
          id="camera-preview"
          class={{ hidden: !this.srcObject }}
          autoplay
          playsinline
          muted
        ></video>
        <img
          src={this.exampleImageSource ?? exampleImageSourceFallback}
          width={this.width}
          height={this.height}
          tabindex={1}
          class={{ hidden: !!this.srcObject }}
        />
        <button class="example-button" onClick={() => this.selectImage()}>
          <RoundCameraIcon />
        </button>
      </Host>
    );
  }
}
